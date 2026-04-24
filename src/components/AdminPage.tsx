import React, { useState, useMemo, useCallback, useContext, memo } from 'react';
import { PresenceContext } from '../components/OnlinePresenceProvider';
import {
  Plus, Trash2, Save, X, LogOut, AlertCircle, CheckCircle,
  History, TrendingUp, TrendingDown, Minus, Search, Filter,
  ArrowUpDown, Users, Eye, ImageIcon, FolderOpen, LayoutGrid,
  Settings, Package, CreditCard as EditIcon, ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { useItemsContext } from '../contexts/ItemsContext';
import { useValueChanges } from '../hooks/useValueChanges';
import { StockRotationAdmin } from './StockRotationAdmin';
import { ImageManager } from './ImageManager';
import { getItemImageUrl } from '../lib/supabase';
import { Item } from '../types/Item';

interface AdminPageProps {
  maintenanceMode: boolean;
  onMaintenanceModeChange: (enabled: boolean) => void;
}

type View = 'items' | 'changes' | 'images' | 'settings' | 'stock';

// ─── tiny reusable primitives ───────────────────────────────────────────────

const GoldBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#6f572c] bg-[#4b3a1d]/60 text-[#c4a04a] ${className}`}>
    {children}
  </span>
);

const StatusBadge: React.FC<{ status: Item['status'] }> = ({ status }) => {
  const map: Record<Item['status'], string> = {
    Obtainable: 'border-emerald-700/60 bg-emerald-900/30 text-emerald-400',
    Limited: 'border-amber-700/60 bg-amber-900/30 text-amber-400',
    Unobtainable: 'border-red-800/60 bg-red-900/30 text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      {status}
    </span>
  );
};

const RateIcon: React.FC<{ rate: string }> = ({ rate }) => {
  if (rate === 'Rising') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (rate === 'Falling') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-white/30" />;
};

// ─── item icon renderer ──────────────────────────────────────────────────────

const ItemIcon = memo(({ emoji, name, size = 'md' }: { emoji: string; name: string; size?: 'sm' | 'md' }) => {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  if (!emoji || typeof emoji !== 'string') return <span className="text-xl">⚔️</span>;
  if (emoji.startsWith('/') || emoji.startsWith('./') || emoji.startsWith('http')) {
    return (
      <div className={`${dim} flex items-center justify-center flex-shrink-0`}>
        <img
          src={getItemImageUrl(emoji)}
          alt={name}
          className={`${dim} object-contain pixelated`}
          loading="lazy"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.style.display = 'none';
            const s = t.nextElementSibling as HTMLElement;
            if (s) s.style.display = 'inline';
          }}
        />
        <span className="text-xl hidden">⚔️</span>
      </div>
    );
  }
  return <span className="text-xl leading-none">{emoji}</span>;
});

// ─── field component for the form ───────────────────────────────────────────

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; span?: boolean }> = ({
  label, required, children, span,
}) => (
  <div className={span ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
      {label}{required && <span className="text-[#c4a04a] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/60 focus:border-[#c4a04a]/60 transition-colors placeholder-white/20';
const selectCls = `${inputCls} appearance-none`;

// ─── item form modal ─────────────────────────────────────────────────────────

const ItemForm: React.FC<{
  item?: Item;
  onSubmit: (data: Omit<Item, 'id'>) => void;
  onCancel: () => void;
  renderIcon: (emoji: string, name: string) => React.ReactNode;
}> = ({ item, onSubmit, onCancel, renderIcon }) => {
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
  const [showImagePicker, setShowImagePicker] = useState(false);

  const set = useCallback(<K extends keyof typeof formData>(key: K, val: (typeof formData)[K]) =>
    setFormData((p) => ({ ...p, [key]: val })), []);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {showImagePicker ? (
        <div className="bg-[#0d0d10] rounded-2xl border border-[#6f572c]/60 shadow-[0_0_60px_rgba(196,160,74,0.08)] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d0d10] z-10">
            <span className="text-sm font-semibold text-white/80">Choose from Storage</span>
            <button onClick={() => setShowImagePicker(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5">
            <ImageManager selectionMode selectedImage={formData.emoji} onSelectImage={(f) => { set('emoji', f); setShowImagePicker(false); }} />
          </div>
        </div>
      ) : (
        <div className="bg-[#0d0d10] rounded-2xl border border-[#6f572c]/60 shadow-[0_0_60px_rgba(196,160,74,0.08)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d0d10] z-10">
            <h3 className="text-base font-semibold text-white">{item ? 'Edit Item' : 'New Item'}</h3>
            <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name" required span>
                <input type="text" required value={formData.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="Item name" />
              </Field>

              <Field label="Value" required>
                <input type="number" required min="0" value={formData.value} onChange={(e) => set('value', parseInt(e.target.value) || 0)} className={inputCls} />
              </Field>

              <Field label="Demand (1–10)" required>
                <input type="number" required min="1" max="10" value={formData.demand} onChange={(e) => set('demand', parseInt(e.target.value) || 5)} className={inputCls} />
              </Field>

              <Field label="Rate of Change" required>
                <select value={formData.rateOfChange} onChange={(e) => set('rateOfChange', e.target.value as Item['rateOfChange'])} className={selectCls}>
                  <option value="Rising">Rising</option>
                  <option value="Falling">Falling</option>
                  <option value="Stable">Stable</option>
                  <option value="Overpriced">Overpriced</option>
                </select>
              </Field>

              <Field label="Prestige" required>
                <input type="number" required min="0" value={formData.prestige} onChange={(e) => set('prestige', parseInt(e.target.value) || 0)} className={inputCls} />
              </Field>

              <Field label="Status" required>
                <select value={formData.status} onChange={(e) => set('status', e.target.value as Item['status'])} className={selectCls}>
                  <option value="Obtainable">Obtainable</option>
                  <option value="Unobtainable">Unobtainable</option>
                  <option value="Limited">Limited</option>
                </select>
              </Field>

              <Field label="Category" required>
                <input type="text" required value={formData.category} onChange={(e) => set('category', e.target.value)} className={inputCls} placeholder="e.g. Swords" />
              </Field>

              <Field label="Rarity (%)">
                <input type="number" min="0" max="100" step="0.01" value={formData.rarity ?? ''} onChange={(e) => set('rarity', e.target.value ? parseFloat(e.target.value) : null)} className={inputCls} placeholder="0.00" />
              </Field>

              <Field label="Gem Tax">
                <input type="number" min="0" value={formData.gemTax ?? ''} onChange={(e) => set('gemTax', e.target.value ? parseInt(e.target.value) : null)} className={inputCls} />
              </Field>

              <Field label="Gold Tax">
                <input type="number" min="0" value={formData.goldTax ?? ''} onChange={(e) => set('goldTax', e.target.value ? parseInt(e.target.value) : null)} className={inputCls} />
              </Field>

              {/* Image / Emoji picker */}
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
                    {renderIcon(formData.emoji, formData.name)}
                  </div>
                </div>
              </Field>

              <Field label="Obtained From" required span>
                <textarea required value={formData.obtainedFrom} onChange={(e) => set('obtainedFrom', e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="Source description" />
              </Field>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
              <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors">Cancel</button>
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

// ─── main admin page ──────────────────────────────────────────────────────────

export const AdminPage: React.FC<AdminPageProps> = ({ maintenanceMode, onMaintenanceModeChange }) => {
  const { user, signOut } = useAuth();
  const { items, loading, error } = useItemsContext();
  const { createItem, updateItem, deleteItem } = useItems() as any;
  const { valueChanges, loading: changesLoading, deleteValueChange } = useValueChanges();
  const { onlineCount } = useContext(PresenceContext);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentView, setCurrentView] = useState<View>('items');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortField, setSortField] = useState<'name' | 'value' | 'demand' | 'prestige' | 'category'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))).sort(), [items]);

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return items
      .filter((i) => i.name.toLowerCase().includes(q) && (!selectedCategory || i.category === selectedCategory))
      .sort((a, b) => {
        let av: any = a[sortField];
        let bv: any = b[sortField];
        if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv as string).toLowerCase(); }
        if (sortOrder === 'asc') return av < bv ? -1 : av > bv ? 1 : 0;
        return av > bv ? -1 : av < bv ? 1 : 0;
      });
  }, [items, searchTerm, selectedCategory, sortField, sortOrder]);

  const handleCreateItem = async (data: Omit<Item, 'id'>) => {
    const { error } = await createItem(data);
    if (error) showNotification('error', error);
    else { showNotification('success', 'Item created'); setShowCreateForm(false); }
  };

  const handleUpdateItem = async (id: string, data: Partial<Item>) => {
    const { error } = await updateItem(id, data);
    if (error) showNotification('error', error);
    else { showNotification('success', 'Item updated'); setEditingItem(null); }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const { error } = await deleteItem(id);
    if (error) showNotification('error', error);
    else showNotification('success', 'Item deleted');
  };

  const handleDeleteChange = async (id: string, name: string) => {
    if (!window.confirm(`Delete change for "${name}"?`)) return;
    const { error } = await deleteValueChange(id);
    if (error) showNotification('error', error);
    else showNotification('success', 'Entry deleted');
  };

  const renderIcon = useCallback((emoji: string, name: string) => (
    <ItemIcon emoji={emoji} name={name} />
  ), []);

  const navItems: { id: View; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'items', label: 'Items', icon: <Package className="w-4 h-4" />, count: items.length },
    { id: 'changes', label: 'Changes', icon: <History className="w-4 h-4" />, count: valueChanges.length },
    { id: 'images', label: 'Images', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'stock', label: 'Stock', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen aotr-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen aotr-background text-white">
      {/* ── top bar ── */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/80 backdrop-blur-xl border-b border-[#6f572c]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* brand */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg">⚔️</span>
            <span className="font-bold text-sm sm:text-base gold-letter whitespace-nowrap">AOT:R Admin</span>
          </div>

          {/* right side */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-800/50 bg-emerald-900/20">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-sm">{onlineCount}</span>
              <span className="text-white/30 text-xs hidden sm:inline">online</span>
            </div>

            <span className="hidden md:block text-xs text-white/30 max-w-[140px] truncate">
              {user?.user_metadata?.preferred_username ?? user?.email ?? 'Admin'}
            </span>

            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-700/50 hover:bg-red-900/20 text-white/40 hover:text-red-400 transition-all text-xs font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── nav tabs ── */}
      <nav className="sticky top-14 z-30 bg-[#090a0f]/80 backdrop-blur-xl border-b border-[#6f572c]/30 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1">
            {navItems.map((n) => {
              const active = currentView === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setCurrentView(n.id)}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-3.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'text-[#c4a04a]' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {n.icon}
                  <span>{n.label}</span>
                  {n.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-[#4b3a1d] text-[#c4a04a]' : 'bg-white/[0.06] text-white/30'}`}>
                      {n.count}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-t bg-[#c4a04a] shadow-[0_0_8px_rgba(196,160,74,0.6)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── notification toast ── */}
      {notification && (
        <div className={`fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl animate-fade-in max-w-xs text-sm ${
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

      {/* ── main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* STOCK */}
        {currentView === 'stock' && <StockRotationAdmin />}

        {/* IMAGES */}
        {currentView === 'images' && <ImageManager />}

        {/* SETTINGS */}
        {currentView === 'settings' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Site Settings</h1>
              <p className="text-white/40 text-sm">Manage site-wide configuration</p>
            </div>

            {/* Maintenance */}
            <div className="rounded-2xl border border-[#6f572c]/40 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className="w-4 h-4 text-[#c4a04a]" />
                    <h3 className="font-semibold text-white text-sm">Maintenance Mode</h3>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed max-w-xs">
                    Shows a maintenance popup to all non-admin users and blocks site interaction.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs font-semibold ${maintenanceMode ? 'text-red-400' : 'text-emerald-400'}`}>
                    {maintenanceMode ? 'Active' : 'Off'}
                  </span>
                  <button
                    onClick={() => onMaintenanceModeChange(!maintenanceMode)}
                    className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none ${maintenanceMode ? 'bg-red-600' : 'bg-emerald-700'}`}
                  >
                    <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              {maintenanceMode && (
                <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-900/20 border border-red-800/40 text-red-300 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  Maintenance active — public users are blocked.
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Items', value: items.length, color: 'text-[#c4a04a]' },
                { label: 'Value Changes', value: valueChanges.length, color: 'text-white' },
                { label: 'Online Users', value: onlineCount, color: 'text-emerald-400' },
                { label: 'Categories', value: categories.length, color: 'text-white' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VALUE CHANGES */}
        {currentView === 'changes' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Value Changes</h1>
              <p className="text-white/40 text-sm">History of all item value, demand, and rate updates</p>
            </div>

            {changesLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin" />
              </div>
            ) : valueChanges.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No changes recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {valueChanges.map((ch) => {
                  const up = ch.newValue > ch.oldValue;
                  const same = ch.newValue === ch.oldValue;
                  return (
                    <div key={ch.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#6f572c]/50 transition-colors overflow-hidden">
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <ItemIcon emoji={ch.emoji} name={ch.itemName} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{ch.itemName}</p>
                            <p className="text-xs text-white/30">{new Date(ch.changeDate).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                            same ? 'border-white/10 text-white/40'
                            : up ? 'border-emerald-800/50 text-emerald-400 bg-emerald-900/20'
                            : 'border-red-800/50 text-red-400 bg-red-900/20'
                          }`}>
                            {same ? 'Updated' : up ? `+${ch.newValue - ch.oldValue}` : `${ch.newValue - ch.oldValue}`}
                          </span>
                          <button
                            onClick={() => handleDeleteChange(ch.id, ch.itemName)}
                            className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
                        {[
                          { label: 'Value', old: `🔑 ${ch.oldValue}`, new: `🔑 ${ch.newValue}` },
                          { label: 'Demand', old: `${ch.oldDemand}/10`, new: `${ch.newDemand}/10` },
                          { label: 'Rate', old: ch.oldRateOfChange, new: ch.newRateOfChange },
                        ].map((row) => (
                          <div key={row.label} className="bg-white/[0.03] rounded-lg p-2.5">
                            <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wide">{row.label}</p>
                            <p className="text-xs text-white/40 line-through">{row.old}</p>
                            <p className="text-xs text-white font-medium">{row.new}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ITEMS */}
        {currentView === 'items' && (
          <div className="space-y-5">
            {/* page header */}
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

            {/* table — desktop */}
            <div className="hidden lg:block rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Item', 'Value', 'Demand', 'Rate', 'Status', 'Category', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider last:text-right">
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
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
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
                            onClick={() => handleDeleteItem(item.id, item.name)}
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

            {/* cards — mobile */}
            <div className="lg:hidden space-y-2">
              {filteredItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ItemIcon emoji={item.emoji} name={item.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium text-white text-sm truncate">{item.name}</p>
                        <p className="text-[11px] text-white/30">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingItem(item)} className="p-1.5 rounded-lg text-white/30 hover:text-[#c4a04a] hover:bg-[#4b3a1d]/40 transition-colors">
                        <EditIcon className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id, item.name)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-900/20 transition-colors">
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
                <p>{searchTerm || selectedCategory ? 'No items match your filters' : 'No items yet — create one above'}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── forms ── */}
      {showCreateForm && (
        <ItemForm onSubmit={handleCreateItem} onCancel={() => setShowCreateForm(false)} renderIcon={renderIcon} />
      )}
      {editingItem && (
        <ItemForm item={editingItem} onSubmit={(d) => handleUpdateItem(editingItem.id, d)} onCancel={() => setEditingItem(null)} renderIcon={renderIcon} />
      )}
    </div>
  );
};
