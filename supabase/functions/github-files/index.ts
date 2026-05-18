import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifyAdmin(req: Request): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user } } = await callerClient.auth.getUser();
  if (!user) return null;

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: adminRow } = await adminClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return adminRow ? user.id : null;
}

async function ghFetch(path: string, options: RequestInit = {}) {
  const token = Deno.env.get("GITHUB_TOKEN");
  const owner = Deno.env.get("GITHUB_OWNER");
  const repo = Deno.env.get("GITHUB_REPO");

  if (!token || !owner || !repo) {
    throw new Error("GitHub credentials not configured. Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO secrets.");
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${errBody}`);
  }

  return res.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const adminId = await verifyAdmin(req);
    if (!adminId) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // LIST files in public/ folder
    if (req.method === "GET" && action === "list") {
      const data = await ghFetch("public");
      const images = (data as any[])
        .filter((f: any) => f.type === "file" && /\.(png|webp|jpg|jpeg|gif|svg)$/i.test(f.name))
        .map((f: any) => ({
          name: f.name,
          sha: f.sha,
          size: f.size,
          download_url: f.download_url,
        }));
      return jsonResponse({ files: images });
    }

    // UPLOAD a file to public/
    if (req.method === "POST" && action === "upload") {
      const body = await req.json();
      const { filename, content, message } = body;

      if (!filename || !content) {
        return jsonResponse({ error: "filename and content (base64) required" }, 400);
      }

      // Check if file exists to get sha for update
      let sha: string | undefined;
      try {
        const existing = await ghFetch(`public/${filename}`);
        sha = (existing as any).sha;
      } catch {
        // file doesn't exist, that's fine
      }

      const result = await ghFetch(`public/${filename}`, {
        method: "PUT",
        body: JSON.stringify({
          message: message || `Add ${filename}`,
          content,
          branch: "main",
          ...(sha ? { sha } : {}),
        }),
      });

      return jsonResponse({ success: true, file: (result as any).content });
    }

    // DELETE a file from public/
    if (req.method === "DELETE" && action === "delete") {
      const body = await req.json();
      const { filename, sha, message } = body;

      if (!filename || !sha) {
        return jsonResponse({ error: "filename and sha required" }, 400);
      }

      await ghFetch(`public/${filename}`, {
        method: "DELETE",
        body: JSON.stringify({
          message: message || `Delete ${filename}`,
          sha,
          branch: "main",
        }),
      });

      return jsonResponse({ success: true });
    }

    // RENAME a file in public/ (copy + delete)
    if (req.method === "POST" && action === "rename") {
      const body = await req.json();
      const { oldFilename, newFilename, sha, message } = body;

      if (!oldFilename || !newFilename || !sha) {
        return jsonResponse({ error: "oldFilename, newFilename, and sha required" }, 400);
      }

      // Get the file content
      const existing = await ghFetch(`public/${oldFilename}`);
      const fileContent = (existing as any).content;

      // Create new file
      await ghFetch(`public/${newFilename}`, {
        method: "PUT",
        body: JSON.stringify({
          message: message || `Rename ${oldFilename} to ${newFilename}`,
          content: fileContent,
          branch: "main",
        }),
      });

      // Delete old file
      await ghFetch(`public/${oldFilename}`, {
        method: "DELETE",
        body: JSON.stringify({
          message: `Remove old file ${oldFilename} (renamed to ${newFilename})`,
          sha: (existing as any).sha,
          branch: "main",
        }),
      });

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Invalid action. Use ?action=list|upload|delete|rename" }, 400);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Unknown error" },
      500
    );
  }
});
