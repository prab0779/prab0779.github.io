import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, RefreshCw, Search, Image, AlertCircle, CheckCircle, CreditCard as Edit2, X, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BUCKET = 'Item Images';

interface StorageFile {
  name: string;
  publicUrl: string;
  size?: number;
  createdAt?: string;
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

      const mapped: StorageFile[] = (data || [])
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => {
          const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
          return {
            name: f.name,
            publicUrl: urlData.publicUrl,
            size: f.metadata?.size,
            createdAt: f.created_at,
          };
        });

      setFiles(mapped);
    } catch (err: any) {
      showNotification('error', `Failed to load images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of Array.from(selected)) {
      const cleanName = file.name.replace(/\s+/g, '_');
      const { error } = await supabase.storage.from(BUCKET).upload(cleanName, file, { upsert: true });
      if (error) {
        errorCount++;
      } else {
        successCount++;
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) showNotification('success', `${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully`);
    if (errorCount > 0) showNotification('error', `${errorCount} image${errorCount > 1 ? 's' : ''} failed to upload`);

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
      setFiles((prev) => prev.filter((f) => f.name !== file.name));
    }
  };

  const startRename = (file: StorageFile) => {
    setRenamingFile(file);
    const ext = file.name.includes('.') ? '.' + file.name.split('.').pop() : '';
    const base = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
    setNewName(base);
  };

  const handleRename = async () => {
    if (!renamingFile || !newName.trim()) return;

    const ext = renamingFile.name.includes('.') ? '.' + renamingFile.name.split('.').pop() : '';
    const finalName = newName.trim().replace(/\s+/g, '_') + ext;

    if (finalName === renamingFile.name) {
      setRenamingFile(null);
      return;
    }

    // Download then re-upload with new name
    const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(renamingFile.name);
    if (dlErr || !blob) {
      showNotification('error', `Rename failed: ${dlErr?.message}`);
      return;
    }

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(finalName, blob, { upsert: true });
    if (upErr) {
      showNotification('error', `Rename failed: ${upErr.message}`);
      return;
    }

    await supabase.storage.from(BUCKET).remove([renamingFile.name]);
    showNotification('success', `Renamed to "${finalName}"`);
    setRenamingFile(null);
    await loadFiles();
  };

  const copyFilename = (name: string) => {
    navigator.clipboard.writeText(`/${name}`).then(() => {
      showNotification('success', `Copied "/${name}" to clipboard`);
    });
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 p-3 rounded-lg border flex items-center space-x-2 max-w-sm shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-900 border-green-700 text-green-300'
              : 'bg-red-900 border-red-700 text-red-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="text-sm">{notification.message}</span>
        </div>
      )}

      {/* Rename Modal */}
      {renamingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">Rename Image</h3>
              <button onClick={() => setRenamingFile(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Current: <span className="text-gray-200 font-mono">{renamingFile.name}</span>
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenamingFile(null); }}
                autoFocus
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              />
              <span className="text-gray-400 text-sm">{renamingFile.name.includes('.') ? '.' + renamingFile.name.split('.').pop() : ''}</span>
            </div>
            <div className="flex justify-end space-x-3 mt-5">
              <button onClick={() => setRenamingFile(null)} className="px-4 py-2 text-gray-300 hover:text-white text-sm">
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Rename</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header controls */}
      {!selectionMode && (
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Image Storage</h1>
          <p className="text-gray-400 mt-1 text-sm">Upload, rename, and manage item images in Supabase Storage</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <button
          onClick={loadFiles}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer text-sm transition-colors">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 mb-5 text-sm text-gray-400">
        <span className="flex items-center space-x-1">
          <Image className="w-4 h-4" />
          <span>{files.length} total images</span>
        </span>
        {searchTerm && (
          <span>{filteredFiles.length} matching</span>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg">{searchTerm ? 'No images match your search' : 'No images uploaded yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredFiles.map((file) => {
            const isSelected = selectedImage === `/${file.name}` || selectedImage === file.name;
            return (
              <div
                key={file.name}
                className={`group relative bg-gray-800 rounded-xl border overflow-hidden transition-all duration-200 ${
                  selectionMode
                    ? 'cursor-pointer hover:border-blue-500 ' + (isSelected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700')
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                onClick={selectionMode ? () => onSelectImage?.(`/${file.name}`) : undefined}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-900 flex items-center justify-center p-2 relative">
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: 'pixelated' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="p-2">
                  <p className="text-xs text-gray-300 truncate font-mono" title={file.name}>
                    {file.name}
                  </p>
                </div>

                {/* Actions overlay */}
                {!selectionMode && (
                  <div className="absolute top-1 right-1 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyFilename(file.name); }}
                      className="p-1 bg-gray-900 bg-opacity-80 rounded text-gray-300 hover:text-white"
                      title="Copy path"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); startRename(file); }}
                      className="p-1 bg-gray-900 bg-opacity-80 rounded text-blue-400 hover:text-blue-300"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${file.name}"?`)) handleDelete(file);
                      }}
                      disabled={deletingFile === file.name}
                      className="p-1 bg-gray-900 bg-opacity-80 rounded text-red-400 hover:text-red-300 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingFile === file.name ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
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
