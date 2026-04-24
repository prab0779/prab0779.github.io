import React, { useState, useMemo } from 'react';
import {
  Plus, Trash2, AlertCircle, Search, Filter,
  ArrowUpDown, Eye, Package, CreditCard as EditIcon,
} from 'lucide-react';
import { Item } from '../../types/Item';
import { GoldBadge, StatusBadge, RateIcon, ItemIcon } from './AdminShared';
import { ItemForm } from './ItemForm';

interface ItemsViewProps {
  items: Item[];
  error: string | null;
  onCreate: (data: Omit<Item, 'id'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<Item>) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
}

export const ItemsView: React.FC<ItemsViewProps> = ({ items, error, onCreate, onUpdate, onDelete }) => {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortField, setSortField] = useState<'name' | 'value' | 'demand' | 'prestige' | 'category'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return items
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) &&
          (!selectedCategory || i.category === selectedCategory),
      )
      .sort((a, b) => {
        let av: any = a[sortField];
        let bv: any = b[sortField];
        if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv as string).toLowerCase(); }
        if (sortOrder === 'asc') return av < bv ? -1 : av > bv ? 1 : 0;
        return av > bv ? -1 : av < bv ? 1 : 0;
      });
  }, [items, searchTerm, selectedCategory, sortField, sortOrder]);

  const handleCreate = async (data: Omit<Item, 'id'>) => {
    await onCreate(data);
    setShowCreateForm(false);
  };

  const handleUpdate = async (data: Omit<Item, 'id'>) => {
    if (!editingItem) return;
    await onUpdate(editingItem.id, data);
    setEditingItem(null);
  };

  return (
    <>
      <div className="space-y-5">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Item Management</h1>
            <p className="text-white/40 text-sm">Manage AOT:R item values and properties</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c4a04a] hover:bg-[#d4b05a] text-black font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(196,160,74,0.2)] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-800/50 bg-red-950/40 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* filters */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search items…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Filter className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50"
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50"
            >
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="demand">Demand</option>
              <option value="prestige">Prestige</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-2 text-white/60 hover:text-white text-xs transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </button>
            <div className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-2 text-white/30 text-xs">
              <Eye className="w-3.5 h-3.5" />
              {filteredItems.length}
            </div>
          </div>
        </div>

        {/* desktop table */}
        <div className="hidden lg:block rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Item', 'Value', 'Demand', 'Rate', 'Status', 'Category', ''].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider last:text-right"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.025] transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <ItemIcon emoji={item.emoji} name={item.name} size="sm" />
                      <div>
                        <p className="font-medium text-white text-sm">{item.name}</p>
                        <p className="text-[11px] text-white/30">Prestige {item.prestige}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <GoldBadge>🔑 {item.value.toLocaleString()}</GoldBadge>
                  </td>
                  <td className="px-5 py-3 text-white/70">{item.demand}/10</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <RateIcon rate={item.rateOfChange} />
                      <span className="text-white/60 text-xs">{item.rateOfChange}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-3 text-white/40 text-xs">{item.category}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-[#c4a04a] hover:bg-[#4b3a1d]/40 transition-colors"
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id, item.name)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="lg:hidden space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ItemIcon emoji={item.emoji} name={item.name} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{item.name}</p>
                    <p className="text-[11px] text-white/30">{item.category}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-[#c4a04a] hover:bg-[#4b3a1d]/40 transition-colors"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.name)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <GoldBadge>🔑 {item.value.toLocaleString()}</GoldBadge>
                <span className="text-xs text-white/40">{item.demand}/10</span>
                <div className="flex items-center gap-1">
                  <RateIcon rate={item.rateOfChange} />
                  <span className="text-xs text-white/40">{item.rateOfChange}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>
              {searchTerm || selectedCategory
                ? 'No items match your filters'
                : 'No items yet — create one above'}
            </p>
          </div>
        )}
      </div>

      {showCreateForm && (
        <ItemForm onSubmit={handleCreate} onCancel={() => setShowCreateForm(false)} />
      )}
      {editingItem && (
        <ItemForm
          item={editingItem}
          onSubmit={handleUpdate}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </>
  );
};
