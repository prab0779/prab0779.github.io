import React, { useState, useCallback, useMemo } from 'react';
import { Save, X, FolderOpen, Search, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { ImageManager } from '../ImageManager';
import { Item } from '../../types/Item';
import { Field, ItemIcon, inputCls, selectCls } from './AdminShared';
import { publicImages } from '../../data/publicImages';

interface ItemFormProps {
  item?: Item;
  onSubmit: (data: Omit<Item, 'id'>) => void;
  onCancel: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  item,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<any>({
    name: item?.name ?? '',
    demand: item?.demand ?? 5,
    rateOfChange: item?.rateOfChange ?? 'Stable',
    prestige: item?.prestige ?? 0,
    status: item?.status ?? 'Obtainable',
    obtainedFrom: item?.obtainedFrom ?? '',
    gemTax: item?.gemTax ?? null,
    goldTax: item?.goldTax ?? null,
    category: item?.category ?? '',
    rarity: item?.rarity ?? null,
    emoji: item?.emoji ?? '⚔️',
  });

  // separate state for value input
  const [valueInput, setValueInput] = useState(
    item?.value?.toString() ?? ''
  );

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTab, setImagePickerTab] = useState<'public' | 'storage'>('public');
  const [imageSearch, setImageSearch] = useState('');

  const filteredPublicImages = useMemo(() => {
    if (!imageSearch) return publicImages;
    const q = imageSearch.toLowerCase();
    return publicImages.filter(f => f.toLowerCase().includes(q));
  }, [imageSearch]);

  const set = useCallback(
    (key: string, val: any) =>
      setFormData((p: any) => ({ ...p, [key]: val })),
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      value: valueInput,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {showImagePicker ? (
        <div className="bg-[#0d0d10] rounded-2xl border border-[#6f572c]/60 shadow-[0_0_60px_rgba(196,160,74,0.08)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0d0d10] z-10 shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-white/80">Choose Image</span>
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setImagePickerTab('public')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    imagePickerTab === 'public'
                      ? 'bg-[#c4a04a]/20 text-[#c4a04a] border-r border-white/10'
                      : 'text-white/40 hover:text-white/70 border-r border-white/10'
                  }`}
                >
                  Public Files
                </button>
                <button
                  type="button"
                  onClick={() => setImagePickerTab('storage')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    imagePickerTab === 'storage'
                      ? 'bg-[#c4a04a]/20 text-[#c4a04a]'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  Storage
                </button>
              </div>
            </div>
            <button
              onClick={() => { setShowImagePicker(false); setImageSearch(''); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1">
            {imagePickerTab === 'public' ? (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search public images..."
                    value={imageSearch}
                    onChange={(e) => setImageSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4 text-xs text-white/30">
                  <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" />{filteredPublicImages.length} images</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {filteredPublicImages.map((filename) => {
                    const path = `/${filename}`;
                    const isSelected = formData.emoji === path || formData.emoji === filename;
                    return (
                      <div
                        key={filename}
                        onClick={() => { set('emoji', path); setShowImagePicker(false); setImageSearch(''); }}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'border-[#c4a04a] ring-1 ring-[#c4a04a]/50'
                            : 'border-white/[0.06] hover:border-[#6f572c]/60'
                        }`}
                      >
                        <div className="aspect-square bg-white/[0.03] flex items-center justify-center p-1.5 relative">
                          <img
                            src={path}
                            alt={filename}
                            className="w-full h-full object-contain"
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
                          <p className="text-[10px] text-white/40 truncate font-mono" title={filename}>{filename}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <ImageManager
                selectionMode
                selectedImage={formData.emoji}
                onSelectImage={(f) => {
                  set('emoji', f);
                  setShowImagePicker(false);
                  setImageSearch('');
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#0d0d10] rounded-2xl border border-[#6f572c]/60 shadow-[0_0_60px_rgba(196,160,74,0.08)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d0d10] z-10">
            <h3 className="text-base font-semibold text-white">
              {item ? 'Edit Item' : 'New Item'}
            </h3>

            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* NAME */}
              <Field label="Name" required span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls}
                  placeholder="Item name"
                />
              </Field>

              {/* VALUE */}
              <Field label="Value (Viz)" required>
                <input
                  type="text"
                  inputMode="decimal"
                  required
                  min="0"
                  step="any"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className={inputCls}
                  placeholder="0.00"
                />
              </Field>

              {/* DEMAND */}
              <Field label="Demand (1–10)" required>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.demand}
                  onChange={(e) =>
                    set('demand', parseInt(e.target.value) || 5)
                  }
                  className={inputCls}
                />
              </Field>

              {/* RATE */}
              <Field label="Rate of Change" required>
                <select
                  value={formData.rateOfChange}
                  onChange={(e) =>
                    set(
                      'rateOfChange',
                      e.target.value as Item['rateOfChange']
                    )
                  }
                  className={selectCls}
                >
                  <option value="Rising">Rising</option>
                  <option value="Falling">Falling</option>
                  <option value="Stable">Stable</option>
                  <option value="Overpriced">Overpriced</option>
                </select>
              </Field>

              {/* PRESTIGE */}
              <Field label="Prestige" required>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.prestige}
                  onChange={(e) =>
                    set('prestige', parseInt(e.target.value) || 0)
                  }
                  className={inputCls}
                />
              </Field>

              {/* STATUS */}
              <Field label="Status" required>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    set('status', e.target.value as Item['status'])
                  }
                  className={selectCls}
                >
                  <option value="Obtainable">Obtainable</option>
                  <option value="Unobtainable">Unobtainable</option>
                  <option value="Limited">Limited</option>
                </select>
              </Field>

              {/* CATEGORY */}
              <Field label="Category" required>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Swords"
                />
              </Field>

              {/* RARITY */}
              <Field label="Rarity (%)">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.rarity ?? ''}
                  onChange={(e) =>
                    set(
                      'rarity',
                      e.target.value
                        ? parseFloat(e.target.value)
                        : null
                    )
                  }
                  className={inputCls}
                  placeholder="0.00"
                />
              </Field>

              {/* GEM TAX */}
              <Field label="Gem Tax">
                <input
                  type="number"
                  min="0"
                  value={formData.gemTax ?? ''}
                  onChange={(e) =>
                    set(
                      'gemTax',
                      e.target.value
                        ? parseInt(e.target.value)
                        : null
                    )
                  }
                  className={inputCls}
                />
              </Field>

              {/* GOLD TAX */}
              <Field label="Gold Tax">
                <input
                  type="number"
                  min="0"
                  value={formData.goldTax ?? ''}
                  onChange={(e) =>
                    set(
                      'goldTax',
                      e.target.value
                        ? parseInt(e.target.value)
                        : null
                    )
                  }
                  className={inputCls}
                />
              </Field>

              {/* IMAGE */}
              <Field label="Image / Emoji" span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => set('emoji', e.target.value)}
                    className={`${inputCls} flex-1 font-mono text-xs`}
                    placeholder="🎯 or /image.png"
                  />

                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#6f572c]/60 bg-[#4b3a1d]/30 text-[#c4a04a] hover:bg-[#4b3a1d]/60 transition-colors text-xs font-medium whitespace-nowrap"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    Browse
                  </button>

                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <ItemIcon
                      emoji={formData.emoji}
                      name={formData.name}
                    />
                  </div>
                </div>
              </Field>

              {/* OBTAINED FROM */}
              <Field label="Obtained From" required span>
                <textarea
                  required
                  value={formData.obtainedFrom}
                  onChange={(e) =>
                    set('obtainedFrom', e.target.value)
                  }
                  className={`${inputCls} resize-none`}
                  rows={2}
                  placeholder="Source description"
                />
              </Field>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#c4a04a] hover:bg-[#d4b05a] text-black font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(196,160,74,0.2)]"
              >
                <Save className="w-3.5 h-3.5" />
                {item ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}; 