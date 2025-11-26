import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Calendar, User, MessageCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useScamLogs } from '../hooks/useScamLogs';

export const ScamLogsPage: React.FC = () => {
  const { scamLogs, loading, error } = useScamLogs();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return scamLogs;

    const term = searchTerm.toLowerCase();
    return scamLogs.filter(log =>
      log.robloxId.toLowerCase().includes(term) ||
      (log.discordId && log.discordId.toLowerCase().includes(term))
    );
  }, [scamLogs, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isImageUrl = (url: string | null) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading scam reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-in">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">Scam Logs</h1>
        </div>
        <p className="text-xl text-gray-400 mb-2">
          Community-reported scammers and fraudulent activity
        </p>
        <p className="text-sm text-gray-500">
          Stay safe and verify users before trading
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Roblox ID or Discord ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {filteredLogs.length} of {scamLogs.length} reports
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Scam Logs Grid */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {searchTerm ? 'No results found' : 'No scam reports yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Scam reports will appear here when submitted'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-900 rounded-lg border border-red-900 p-6 hover:border-red-700 transition-all duration-200 hover:shadow-lg hover:shadow-red-900/20"
            >
              {/* Header with Warning Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="px-2 py-1 bg-red-900 bg-opacity-30 text-red-300 rounded-full text-xs font-bold border border-red-700">
                    REPORTED
                  </span>
                </div>
              </div>

              {/* User IDs */}
              <div className="space-y-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400 text-xs font-medium">Roblox ID</span>
                  </div>
                  <p className="text-white font-mono text-sm break-all">{log.robloxId}</p>
                </div>

                {log.discordId && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-indigo-400" />
                      <span className="text-gray-400 text-xs font-medium">Discord ID</span>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{log.discordId}</p>
                  </div>
                )}
              </div>

              {/* Reason */}
              <div className="mb-4">
                <h4 className="text-gray-400 text-xs font-medium mb-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  Reason
                </h4>
                <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-3">
                  <p className="text-white text-sm leading-relaxed">{log.reason}</p>
                </div>
              </div>

              {/* Evidence */}
              {log.evidenceUrl && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-xs font-medium mb-2 flex items-center">
                    <span className="mr-1">📎</span>
                    Evidence
                  </h4>
                  <div className="bg-gray-800 rounded-lg p-3">
                    {isImageUrl(log.evidenceUrl) ? (
                      <a
                        href={log.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="relative overflow-hidden rounded-lg mb-2">
                          <img
                            src={log.evidenceUrl}
                            alt="Evidence"
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement?.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center space-x-2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                    </svg>
                                    <span class="text-sm">Failed to load image</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-center space-x-1 text-blue-400 group-hover:text-blue-300 transition-colors">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-xs">View full image</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </a>
                    ) : (
                      <a
                        href={log.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm underline break-all">View evidence link</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Reported Date */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <Calendar className="w-4 h-4" />
                  <span>Reported on {formatDate(log.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning Footer */}
      <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-6 border border-yellow-700">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-yellow-300 font-bold text-lg mb-2">Important Notice</h3>
            <div className="text-yellow-200 text-sm space-y-2">
              <p>
                These reports are community-submitted and may not be verified. Always exercise caution when trading:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Use middleman services for high-value trades</li>
                <li>Verify user identities through multiple channels</li>
                <li>Never share personal or payment information</li>
                <li>Report suspicious activity to moderators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
