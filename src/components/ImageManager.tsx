import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, RefreshCw, Search, Image as ImageIcon, AlertCircle, CheckCircle, CreditCard as Edit2, X, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BUCKET = 'Item Images';

interface StorageFile {
  name: string;
  publicUrl: string;
  size?: number;
}

interface ImageManagerProps {
  onSelectImage?: (filename: string) => void;
  selectionMode?: boolean;
  selectedImage?: string;
}

export const ImageManager: React.FC<ImageManagerProps> = ({ onSelectImage, selectionMode = false, selectedImage }) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [renamingFile, setRenamingFile] = useState<StorageFile | null>(null);
  const [newName, setNewName] = useState('');
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (error) throw error;
      const mapped: StorageFile[] = (data ?? [])
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => {
          const { data: u } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
          return { name: f.name, publicUrl: u.publicUrl, size: f.metadata?.size };
        });
      setFiles(mapped);
    } catch (err: any) {
      showNotification('error', `Failed to load images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    setUploading(true);
    let ok = 0; let fail = 0;
    for (const file of Array.from(selected)) {
      const name = file.name.replace(/\s+/g, '_');
      const { error } = await supabase.storage.from(BUCKET).upload(name, file, { upsert: true });
      error ? fail++ : ok++;
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (ok) showNotification('success', `${ok} image${ok > 1 ? 's' : ''} uploaded`);
    if (fail) showNotification('error', `${fail} upload${fail > 1 ? 's' : ''} failed`);
    await loadFiles();
  };

  const handleDelete = async (file: StorageFile) => {
    setDeletingFile(file.name);
    const { error } = await supabase.storage.from(BUCKET).remove([file.name]);
    setDeletingFile(null);
    if (error) {
      showNotification('error', `Delete failed: ${error.message}`);
    } else {
      showNotification('success', `"${file.name}" deleted`);
      setFiles((p) => p.filter((f) => f.name !== file.name));
    }
  };

  const startRename = (file: StorageFile) => {
    setRenamingFile(file);
    const base = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
    setNewName(base);
  };

  const handleRename = async () => {
    if (!renamingFile || !newName.trim()) return;
    const ext = renamingFile.name.includes('.') ? '.' + renamingFile.name.split('.').pop() : '';
    const finalName = newName.trim().replace(/\s+/g, '_') + ext;
    if (finalName === renamingFile.name) { setRenamingFile(null); return; }

    const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(renamingFile.name);
    if (dlErr || !blob) { showNotification('error', `Rename failed: ${dlErr?.message}`); return; }

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(finalName, blob, { upsert: true });
    if (upErr) { showNotification('error', `Rename failed: ${upErr.message}`); return; }

    await supabase.storage.from(BUCKET).remove([renamingFile.name]);
    showNotification('success', `Renamed to "${finalName}"`);
    setRenamingFile(null);
    await loadFiles();
  };

  const copyFilename = (name: string) => {
    navigator.clipboard.writeText(`/${name}`).then(() => showNotification('success', `Copied "/${name}"`));
  };

  const filteredFiles = files.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const inputCls = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/60 focus:border-[#c4a04a]/60 transition-colors placeholder-white/20';

  return (
    <div className="relative">
      {/* Toast */}
      {notification && (
        <div className={`fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl text-sm animate-fade-in max-w-xs ${
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

      {/* Rename modal */}
      {renamingFile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d10] rounded-2xl border border-[#6f572c]/60 shadow-[0_0_60px_rgba(196,160,74,0.08)] w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Rename Image</h3>
              <button onClick={() => setRenamingFile(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/40 mb-3">
              Current: <span className="text-white/70 font-mono">{renamingFile.name}</span>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenamingFile(null); }}
                autoFocus
                className={`${inputCls} font-mono flex-1`}
                placeholder="new-name"
              />
              <span className="text-white/30 text-xs shrink-0">
                {renamingFile.name.includes('.') ? '.' + renamingFile.name.split('.').pop() : ''}
              </span>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRenamingFile(null)} className="px-3 py-1.5 text-sm text-white/40 hover:text-white transition-colors">Cancel</button>
              <button
                onClick={handleRename}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#c4a04a] hover:bg-[#d4b05a] text-black font-semibold text-sm transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {!selectionMode && (
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white mb-1">Image Storage</h1>
          <p className="text-white/40 text-sm">Upload, rename, and manage item images</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search images…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50 transition-colors"
          />
        </div>
        <button
          onClick={loadFiles}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c4a04a] hover:bg-[#d4b05a] text-black font-semibold text-sm cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading…' : 'Upload'}
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* stat row */}
      <div className="flex items-center gap-3 mb-4 text-xs text-white/30">
        <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" />{files.length} images</span>
        {searchTerm && <span>{filteredFiles.length} matching</span>}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>{searchTerm ? 'No images match your search' : 'No images uploaded yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {filteredFiles.map((file) => {
            const isSelected = selectedImage === `/${file.name}` || selectedImage === file.name;
            return (
              <div
                key={file.name}
                onClick={selectionMode ? () => onSelectImage?.(`/${file.name}`) : undefined}
                className={`group relative rounded-xl border overflow-hidden transition-all duration-150 ${
                  selectionMode
                    ? `cursor-pointer ${isSelected ? 'border-[#c4a04a] ring-1 ring-[#c4a04a]/50' : 'border-white/[0.06] hover:border-[#6f572c]/60'}`
                    : 'border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="aspect-square bg-white/[0.03] flex items-center justify-center p-1.5 relative">
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="w-full h-full object-contain pixelated"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#c4a04a]/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-[#c4a04a]" />
                    </div>
                  )}
                </div>
                <div className="px-1.5 py-1 bg-black/20">
                  <p className="text-[10px] text-white/40 truncate font-mono" title={file.name}>{file.name}</p>
                </div>

                {/* Actions — non-selection mode */}
                {!selectionMode && (
                  <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyFilename(file.name); }}
                      className="p-1 rounded bg-black/70 text-white/50 hover:text-white transition-colors"
                      title="Copy path"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); startRename(file); }}
                      className="p-1 rounded bg-black/70 text-[#c4a04a]/70 hover:text-[#c4a04a] transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete "${file.name}"?`)) handleDelete(file); }}
                      disabled={deletingFile === file.name}
                      className="p-1 rounded bg-black/70 text-red-500/70 hover:text-red-400 transition-colors disabled:opacity-40"
                      title="Delete"
                    >
                      {deletingFile === file.name
                        ? <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        : <Trash2 className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
