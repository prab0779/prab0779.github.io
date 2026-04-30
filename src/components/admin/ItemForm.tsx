import React, { useState, useCallback } from 'react';
import { Save, X } from 'lucide-react';
import { Item } from '../../types/Item';
import { Field, ItemIcon, inputCls, selectCls } from './AdminShared';

interface ItemFormProps {
  item?: Item;
  onSubmit: (data: Omit<Item, 'id'>) => void;
  onCancel: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    name: item?.name ?? '',
    value: item?.value ?? 0,
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
  const set = useCallback(
    <K extends keyof typeof formData>(key: K, val: (typeof formData)[K]) =>
      setFormData((p) => ({ ...p, [key]: val })),
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#0d0d10] rounded-2xl border border-[#6f572c]/60 shadow-[0_0_60px_rgba(196,160,74,0.08)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d0d10] z-10">
            <h3 className="text-base font-semibold text-white">{item ? 'Edit Item' : 'New Item'}</h3>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <Field label="Value" required>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.value}
                  onChange={(e) => set('value', parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
              </Field>

              <Field label="Demand (1–10)" required>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.demand}
                  onChange={(e) => set('demand', parseInt(e.target.value) || 5)}
                  className={inputCls}
                />
              </Field>

              <Field label="Rate of Change" required>
                <select
                  value={formData.rateOfChange}
                  onChange={(e) => set('rateOfChange', e.target.value as Item['rateOfChange'])}
                  className={selectCls}
                >
                  <option value="Rising">Rising</option>
                  <option value="Falling">Falling</option>
                  <option value="Stable">Stable</option>
                  <option value="Overpriced">Overpriced</option>
                </select>
              </Field>

              <Field label="Prestige" required>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.prestige}
                  onChange={(e) => set('prestige', parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
              </Field>

              <Field label="Status" required>
                <select
                  value={formData.status}
                  onChange={(e) => set('status', e.target.value as Item['status'])}
                  className={selectCls}
                >
                  <option value="Obtainable">Obtainable</option>
                  <option value="Unobtainable">Unobtainable</option>
                  <option value="Limited">Limited</option>
                </select>
              </Field>

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

              <Field label="Rarity (%)">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.rarity ?? ''}
                  onChange={(e) => set('rarity', e.target.value ? parseFloat(e.target.value) : null)}
                  className={inputCls}
                  placeholder="0.00"
                />
              </Field>

              <Field label="Gem Tax">
                <input
                  type="number"
                  min="0"
                  value={formData.gemTax ?? ''}
                  onChange={(e) => set('gemTax', e.target.value ? parseInt(e.target.value) : null)}
                  className={inputCls}
                />
              </Field>

              <Field label="Gold Tax">
                <input
                  type="number"
                  min="0"
                  value={formData.goldTax ?? ''}
                  onChange={(e) => set('goldTax', e.target.value ? parseInt(e.target.value) : null)}
                  className={inputCls}
                />
              </Field>

              <Field label="Image / Emoji" span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => set('emoji', e.target.value)}
                    className={`${inputCls} flex-1 font-mono text-xs`}
                    placeholder="🎯 or /image.png"
                  />
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <ItemIcon emoji={formData.emoji} name={formData.name} />
                  </div>
                </div>
              </Field>

              <Field label="Obtained From" required span>
                <textarea
                  required
                  value={formData.obtainedFrom}
                  onChange={(e) => set('obtainedFrom', e.target.value)}
                  className={`${inputCls} resize-none`}
                  rows={2}
                  placeholder="Source description"
                />
              </Field>
            </div>

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
    </div>
  );
};
