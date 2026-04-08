import React, { useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  Calendar,
  User,
  MessageCircle,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { useScamLogs } from "../hooks/useScamLogs";

export const ScamLogsPage: React.FC = () => {
  const { scamLogs, loading, error } = useScamLogs();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return scamLogs;

    const term = searchTerm.toLowerCase();
    return scamLogs.filter(
      (log) =>
        log.robloxId.toLowerCase().includes(term) ||
        (log.discordId && log.discordId.toLowerCase().includes(term))
    );
  }, [scamLogs, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isImageUrl = (url: string | null) => {
    if (!url) return false;
    const exts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    return exts.some((e) => url.toLowerCase().endsWith(e));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-400">Loading scam reports...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 mt-16 space-y-10">
      {/* HEADER */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <h1
            className="text-4xl font-extrabold"
            style={{
              color: "var(--gold-bright)",
              textShadow: "0 0 12px rgba(255,180,0,0.4)",
            }}
          >
            Scam Logs
          </h1>
        </div>

        <p className="text-zinc-400 text-lg mb-2">
          Community-reported scammers and fraudulent activity
        </p>
        <p className="text-zinc-500 text-sm">
          Stay safe and verify users before trading
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-[#0c0c0c] rounded-xl p-6 border border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search Roblox ID or Discord ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            Showing {filteredLogs.length} of {scamLogs.length} reports
          </span>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* LIST */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No scam reports found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-[#0c0c0c] rounded-xl border border-red-900/40 p-6 hover:border-red-700/60 transition"
            >
              {/* TAG */}
              <div className="flex justify-between mb-4">
                <span className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded border border-red-700/40">
                  REPORTED
                </span>
              </div>

              {/* IDS */}
              <div className="space-y-3 mb-4">
                <div className="bg-[#111] p-3 rounded border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <User className="w-4 h-4 text-yellow-400" />
                    Roblox ID
                  </div>
                  <p className="text-white text-sm break-all">{log.robloxId}</p>
                </div>

                {log.discordId && (
                  <div className="bg-[#111] p-3 rounded border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <MessageCircle className="w-4 h-4 text-yellow-400" />
                      Discord ID
                    </div>
                    <p className="text-white text-sm break-all">{log.discordId}</p>
                  </div>
                )}
              </div>

              {/* REASON */}
              <div className="mb-4">
                <p className="text-zinc-400 text-xs mb-2">Reason</p>
                <div className="bg-red-900/20 border border-red-800/40 p-3 rounded">
                  <p className="text-white text-sm">{log.reason}</p>
                </div>
              </div>

              {/* EVIDENCE */}
              {log.evidenceUrl && (
                <div className="mb-4">
                  <p className="text-zinc-400 text-xs mb-2">Evidence</p>

                  <div className="bg-[#111] p-3 rounded border border-white/5">
                    {isImageUrl(log.evidenceUrl) ? (
                      <a href={log.evidenceUrl} target="_blank">
                        <img
                          src={log.evidenceUrl}
                          className="w-full h-40 object-cover rounded hover:scale-105 transition"
                        />
                      </a>
                    ) : (
                      <a
                        href={log.evidenceUrl}
                        target="_blank"
                        className="text-yellow-400 text-sm underline"
                      >
                        View Evidence
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* DATE */}
              <div className="pt-4 border-t border-white/5 text-xs text-zinc-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(log.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WARNING */}
      <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
          <div className="text-sm text-yellow-200 space-y-1">
            <p className="font-semibold text-yellow-300">Important Notice</p>
            <p>These reports are community submitted.</p>
            <ul className="list-disc ml-4">
              <li>Use middleman services</li>
              <li>Verify users</li>
              <li>Never share personal info</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
