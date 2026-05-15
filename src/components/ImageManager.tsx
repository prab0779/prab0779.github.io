import React, { useState, useMemo } from 'react';
import { Search, Image as ImageIcon, CheckCircle, Copy } from 'lucide-react';
import { publicImages } from '../data/publicImages';

interface ImageFile {
  name: string;
  publicUrl: string;
}

interface ImageManagerProps {
  onSelectImage?: (filename: string) => void;
  selectionMode?: boolean;
  selectedImage?: string;
}

export const ImageManager: React.FC<ImageManagerProps> = ({ onSelectImage, selectionMode = false, selectedImage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const files: ImageFile[] = useMemo(() =>
    publicImages.map((name) => ({
      name,
      publicUrl: `/${name}`,
    })),
  []);

  const filteredFiles = useMemo(() =>
    files.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase())),
  [files, searchTerm]);

  const copyFilename = (name: string) => {
    navigator.clipboard.writeText(`/${name}`).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="relative">
      {/* Header */}
      {!selectionMode && (
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white mb-1">Image Manager</h1>
          <p className="text-white/40 text-sm">Browse and select images from the public folder</p>
        </div>
      )}

      {/* Search */}
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
      </div>

      {/* Stat row */}
      <div className="flex items-center gap-3 mb-4 text-xs text-white/30">
        <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" />{filteredFiles.length} images</span>
        {searchTerm && <span>matching "{searchTerm}"</span>}
      </div>

      {/* Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No images match your search</p>
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

                {/* Copy action */}
                {!selectionMode && (
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyFilename(file.name); }}
                      className="p-1 rounded bg-black/70 text-white/50 hover:text-white transition-colors"
                      title="Copy path"
                    >
                      {copied === file.name
                        ? <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        : <Copy className="w-2.5 h-2.5" />}
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
