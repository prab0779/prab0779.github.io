import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the caller is an admin or moderator
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: adminRow } = await supabaseAdmin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", caller.id)
      .maybeSingle();

    if (!adminRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse pagination params from URL
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("per_page") || "50", 10)));
    const search = (url.searchParams.get("search") || "").toLowerCase().trim();

    // Fetch admin roles
    const { data: adminUsers } = await supabaseAdmin
      .from("admin_users")
      .select("user_id, role");

    const adminMap = new Map(
      (adminUsers || []).map((a: any) => [a.user_id, a.role])
    );

    // If searching, we need to fetch all and filter server-side
    // Otherwise, use Supabase pagination
    if (search) {
      // Fetch all users in batches for search
      const allUsers: any[] = [];
      let fetchPage = 1;
      while (true) {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
          page: fetchPage,
          perPage: 1000,
        });
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (!users || users.length === 0) break;
        allUsers.push(...users);
        if (users.length < 1000) break;
        fetchPage++;
      }

      // Filter
      const filtered = allUsers.filter((u: any) => {
        const email = (u.email || "").toLowerCase();
        const name = (u.user_metadata?.full_name || u.user_metadata?.preferred_username || u.user_metadata?.name || "").toLowerCase();
        const id = u.id.toLowerCase();
        return email.includes(search) || name.includes(search) || id.includes(search);
      });

      const total = filtered.length;
      const start = (page - 1) * perPage;
      const pageUsers = filtered.slice(start, start + perPage);

      const mapped = pageUsers.map((u: any) => ({
        id: u.id,
        email: u.email,
        displayName:
          u.user_metadata?.full_name ||
          u.user_metadata?.preferred_username ||
          u.user_metadata?.name ||
          null,
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at,
        role: adminMap.get(u.id) || null,
      }));

      return new Response(JSON.stringify({ users: mapped, total, page, perPage }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No search -- paginated fetch directly
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get total count (one extra lightweight call for page 1)
    let total = page * perPage;
    if (page === 1) {
      // Fetch a count by requesting page 1 with perPage=1 (just to get total from a full fetch)
      // Actually Supabase doesn't return total, so we estimate:
      // If we got a full page, there's likely more
      // For accurate count, do a separate scan
      const allCounts: number[] = [];
      let countPage = 1;
      while (true) {
        const { data: { users: countUsers } } = await supabaseAdmin.auth.admin.listUsers({
          page: countPage,
          perPage: 1000,
        });
        if (!countUsers || countUsers.length === 0) break;
        allCounts.push(countUsers.length);
        if (countUsers.length < 1000) break;
        countPage++;
      }
      total = allCounts.reduce((a, b) => a + b, 0);
    } else if ((users || []).length < perPage) {
      // We're on the last page
      total = (page - 1) * perPage + (users || []).length;
    }

    const mapped = (users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      displayName:
        u.user_metadata?.full_name ||
        u.user_metadata?.preferred_username ||
        u.user_metadata?.name ||
        null,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
      role: adminMap.get(u.id) || null,
    }));

    return new Response(JSON.stringify({ users: mapped, total, page, perPage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
