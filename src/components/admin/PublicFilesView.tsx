import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Upload, Trash2, Search, RefreshCw, AlertCircle, CheckCircle, Image as ImageIcon, X, Pencil } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GitHubFile {
  name: string;
  sha: string;
  size: number;
  download_url: string;
}

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-files`;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ''}`,
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
}

export const PublicFilesView: React.FC = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<GitHubFile | null>(null);
  const [newName, setNewName] = useState('');

  const notify = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE}?action=list`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch files');
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const filteredFiles = useMemo(() =>
    files.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase())),
  [files, searchTerm]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const headers = await getHeaders();
    let successCount = 0;
    let failCount = 0;

    for (const file of Array.from(fileList)) {
      try {
        const base64 = await fileToBase64(file);
        const res = await fetch(`${API_BASE}?action=upload`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            filename: file.name.replace(/\s+/g, '-'),
            content: base64,
            message: `Upload ${file.name}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        successCount++;
      } catch {
        failCount++;
      }
    }

    setUploading(false);
    e.target.value = '';

    if (successCount > 0) notify('success', `Uploaded ${successCount} file${successCount > 1 ? 's' : ''}`);
    if (failCount > 0) notify('error', `Failed to upload ${failCount} file${failCount > 1 ? 's' : ''}`);

    fetchFiles();
  }, [fetchFiles, notify]);

  const handleDelete = useCallback(async (file: GitHubFile) => {
    if (!window.confirm(`Delete "${file.name}" from the repository? This will trigger a new deploy.`)) return;

    setDeleting(file.name);
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE}?action=delete`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ filename: file.name, sha: file.sha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      notify('success', `Deleted "${file.name}"`);
      setFiles((prev) => prev.filter((f) => f.name !== file.name));
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }, [notify]);

  const handleRename = useCallback(async () => {
    if (!renaming || !newName.trim()) return;
    const cleanName = newName.trim().replace(/\s+/g, '-');
    if (cleanName === renaming.name) { setRenaming(null); return; }

    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE}?action=rename`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          oldFilename: renaming.name,
          newFilename: cleanName,
          sha: renaming.sha,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      notify('success', `Renamed to "${cleanName}"`);
      setRenaming(null);
      fetchFiles();
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Rename failed');
    }
  }, [renaming, newName, notify, fetchFiles]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Public Files</h1>
          <p className="text-white/40 text-sm">Manage images in the GitHub repository's public folder</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFiles}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 hover:border-[#6f572c]/60 text-white/60 hover:text-[#c4a04a] font-medium text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c4a04a] hover:bg-[#d4b05a] text-black font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(196,160,74,0.2)] cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm animate-fade-in ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-800/60 text-emerald-300'
            : 'bg-red-950/90 border-red-800/60 text-red-300'
        }`}>
          {notification.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-800/50 bg-red-950/40 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-white/30">
          <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" />{filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}</span>
          {searchTerm && <span>matching "{searchTerm}"</span>}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>{searchTerm ? 'No files match your search' : 'No images in public folder'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredFiles.map((file) => (
            <div
              key={file.name}
              className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#6f572c]/50 transition-all overflow-hidden"
            >
              {/* Image preview */}
              <div className="aspect-square bg-white/[0.03] flex items-center justify-center p-2 relative">
                <img
                  src={file.download_url}
                  alt={file.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => { setRenaming(file); setNewName(file.name); }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Rename"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    disabled={deleting === file.name}
                    className="p-2 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-red-300 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === file.name
                      ? <RefreshCw className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* File info */}
              <div className="px-2 py-1.5 bg-black/20">
                <p className="text-[10px] text-white/50 truncate font-mono" title={file.name}>{file.name}</p>
                <p className="text-[9px] text-white/25">{formatSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rename modal */}
      {renaming && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d10] rounded-2xl border border-[#6f572c]/60 shadow-[0_0_60px_rgba(196,160,74,0.08)] w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Rename File</h3>
              <button onClick={() => setRenaming(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <img
                  src={renaming.download_url}
                  alt={renaming.name}
                  className="w-10 h-10 object-contain rounded"
                />
                <p className="text-xs text-white/40 font-mono truncate">{renaming.name}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  New filename
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); }}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/60 transition-colors placeholder-white/20"
                  autoFocus
                />
                <p className="text-[10px] text-white/30 mt-1.5">Spaces will be replaced with dashes. This will trigger a new deploy.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRenaming(null)}
                  className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  disabled={!newName.trim() || newName.trim().replace(/\s+/g, '-') === renaming.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c4a04a] hover:bg-[#d4b05a] text-black font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Rename
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
