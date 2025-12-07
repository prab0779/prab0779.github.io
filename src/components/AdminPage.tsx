import React, { useState, useMemo } from 'react';
import { useContext } from "react";
import { PresenceContext } from "../components/OnlinePresenceProvider";
import { Plus, CreditCard as Edit, Trash2, Save, X, LogOut, AlertCircle, CheckCircle, History, TrendingUp, TrendingDown, Minus, Search, Filter, ArrowUpDown, Users, Eye, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { useValueChanges } from '../hooks/useValueChanges';
import { useOnlineUsers } from '../hooks/useOnlineUsers';
import { useScamLogs } from '../hooks/useScamLogs';
import { useScamLogsAdmin } from '../hooks/useScamLogsAdmin';
import { Item } from '../types/Item';

interface AdminPageProps {
  maintenanceMode: boolean;
  onMaintenanceModeChange: (enabled: boolean) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ maintenanceMode, onMaintenanceModeChange }) => {
  const { user, signOut } = useAuth();
  const { items, loading, error, createItem, updateItem, deleteItem } = useItems();
  const { valueChanges, loading: changesLoading, deleteValueChange } = useValueChanges();
  const { onlineCount, loading: usersLoading } = useContext(PresenceContext);
  const { scamLogs, loading: scamLogsLoading } = useScamLogs();
  const { createScamLog, deleteScamLog } = useScamLogsAdmin();
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showScamLogForm, setShowScamLogForm] = useState(false);
  const [currentView, setCurrentView] = useState<'items' | 'changes' | 'scam-logs'>('items');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Search and filter states for items
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortField, setSortField] = useState<'name' | 'value' | 'demand' | 'prestige' | 'category'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Scam logs form state
  const [scamLogForm, setScamLogForm] = useState({
    robloxId: '',
    discordId: '',
    reason: '',
    evidenceUrl: '',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Get unique categories in alphabetical order
  const categories = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category))).sort();
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [items, searchTerm, selectedCategory, sortField, sortOrder]);

  const handleCreateItem = async (itemData: Omit<Item, 'id'>) => {
    const { error } = await createItem(itemData);
    if (error) {
      showNotification('error', error);
    } else {
      showNotification('success', 'Item created successfully!');
      setShowCreateForm(false);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<Item>) => {
    const { error } = await updateItem(id, updates);
    if (error) {
      showNotification('error', error);
    } else {
      showNotification('success', 'Item updated successfully!');
      setEditingItem(null);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const { error } = await deleteItem(id);
      if (error) {
        showNotification('error', error);
      } else {
        showNotification('success', 'Item deleted successfully!');
      }
    }
  };

  const handleDeleteValueChange = async (id: string, itemName: string) => {
    if (window.confirm(`Are you sure you want to delete the value change for "${itemName}"?`)) {
      const { error } = await deleteValueChange(id);
      if (error) {
        showNotification('error', error);
      } else {
        showNotification('success', 'Value change deleted successfully!');
      }
    }
  };

  const handleCreateScamLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scamLogForm.robloxId.trim()) {
      showNotification('error', 'Roblox ID is required');
      return;
    }
    if (!scamLogForm.reason.trim()) {
      showNotification('error', 'Reason is required');
      return;
    }

    const { error } = await createScamLog({
      robloxId: scamLogForm.robloxId.trim(),
      discordId: scamLogForm.discordId.trim() || undefined,
      reason: scamLogForm.reason.trim(),
      evidenceUrl: scamLogForm.evidenceUrl.trim() || undefined,
    });

    if (error) {
      showNotification('error', error);
    } else {
      showNotification('success', 'Scam log created successfully!');
      setScamLogForm({ robloxId: '', discordId: '', reason: '', evidenceUrl: '' });
      setShowScamLogForm(false);
    }
  };

  const handleDeleteScamLog = async (id: string, robloxId: string) => {
    if (window.confirm(`Are you sure you want to delete the scam log for "${robloxId}"?`)) {
      const { error } = await deleteScamLog(id);
      if (error) {
        showNotification('error', error);
      } else {
        showNotification('success', 'Scam log deleted successfully!');
      }
    }
  };

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== 'string') {
      return <span className="text-xl sm:text-2xl">👹</span>;
    }
    
    if (emoji.startsWith('/') || emoji.startsWith('./')) {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
          <img 
            src={emoji.startsWith('./') ? emoji.slice(2) : emoji.slice(1)} 
            alt={itemName}
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="text-xl sm:text-2xl hidden">👹</span>
        </div>
      );
    }
    return <span className="text-xl sm:text-2xl">{emoji}</span>;
  };

  const getRateIcon = (rate: string) => {
    switch (rate) {
      case 'Rising':
        return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />;
      case 'Falling':
        return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
    }
  };

  const getChangeDescription = (change: any) => {
    const changes = [];
    
    // Check value change
    if (change.oldValue !== change.newValue) {
      if (change.newValue > change.oldValue) {
        changes.push(`📈 Value increased from 🔑${change.oldValue} to 🔑${change.newValue}`);
      } else {
        changes.push(`📉 Value decreased from 🔑${change.oldValue} to 🔑${change.newValue}`);
      }
    }
    
    // Check demand change
    if (change.oldDemand !== change.newDemand) {
      if (change.newDemand > change.oldDemand) {
        changes.push(`📊 Demand increased from ${change.oldDemand}/10 to ${change.newDemand}/10`);
      } else {
        changes.push(`📊 Demand decreased from ${change.oldDemand}/10 to ${change.newDemand}/10`);
      }
    }
    
    // Check rate change
    if (change.oldRateOfChange !== change.newRateOfChange) {
      changes.push(`📈 Rate changed from ${change.oldRateOfChange} to ${change.newRateOfChange}`);
    }
    
    return changes.length > 0 ? changes : ['➡️ Item properties updated'];
  };

  const ItemForm: React.FC<{
    item?: Item;
    onSubmit: (data: Omit<Item, 'id'>) => void;
    onCancel: () => void;
  }> = ({ item, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Item, 'id'>>({
      name: item?.name || '',
      value: item?.value || 0,
      demand: item?.demand || 5,
      rateOfChange: item?.rateOfChange || 'Stable',
      prestige: item?.prestige || 0,
      status: item?.status || 'Obtainable',
      obtainedFrom: item?.obtainedFrom || '',
      gemTax: item?.gemTax || null,
      goldTax: item?.goldTax || null,
      category: item?.category || '',
      rarity: item?.rarity || null,
      emoji: item?.emoji || '👹',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              {item ? 'Edit Item' : 'Create New Item'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Value *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Demand (1-10) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.demand}
                  onChange={(e) => setFormData({ ...formData, demand: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rate of Change *
                </label>
                <select
                  value={formData.rateOfChange}
                  onChange={(e) => setFormData({ ...formData, rateOfChange: e.target.value as Item['rateOfChange'] })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="Rising">Rising</option>
                  <option value="Falling">Falling</option>
                  <option value="Stable">Stable</option>
                  <option value="Overpriced">Overpriced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prestige *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.prestige}
                  onChange={(e) => setFormData({ ...formData, prestige: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Item['status'] })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="Obtainable">Obtainable</option>
                  <option value="Unobtainable">Unobtainable</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emoji/Image *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="🎯 or /image.png"
                  />
                  <div className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                    {renderItemIcon(formData.emoji, formData.name)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gem Tax
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.gemTax || ''}
                  onChange={(e) => setFormData({ ...formData, gemTax: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gold Tax
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.goldTax || ''}
                  onChange={(e) => setFormData({ ...formData, goldTax: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rarity (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.rarity || ''}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Obtained From *
              </label>
              <textarea
                required
                value={formData.obtainedFrom}
                onChange={(e) => setFormData({ ...formData, obtainedFrom: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 sm:px-6 py-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                <Save className="w-4 h-4" />
                <span>{item ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">⚔️</span>
              <span className="text-lg sm:text-xl font-bold text-white">AOT:R Admin</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Online Users Count */}
              <div className="flex items-center space-x-2 bg-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium text-sm sm:text-base">
                  {usersLoading ? '...' : onlineCount}
                </span>
                <span className="text-gray-400 text-xs sm:text-sm hidden sm:inline">online</span>
              </div>
              
              <div className="hidden sm:block">
                <span className="text-gray-400 text-sm">
                  {user?.email}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8">
            <button
              onClick={() => setCurrentView('items')}
              className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                currentView === 'items'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Items ({items.length})
            </button>
            <button
              onClick={() => setCurrentView('changes')}
              className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors flex items-center space-x-2 ${
                currentView === 'changes'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Value Changes</span>
              <span className="sm:hidden">Changes</span>
            </button>
            <button
              onClick={() => setCurrentView('scam-logs')}
              className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors flex items-center space-x-2 ${
                currentView === 'scam-logs'
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Scam Logs</span>
              <span className="sm:hidden">Scams</span>
              <span className="ml-1 text-xs bg-red-900 px-2 py-0.5 rounded-full">({scamLogs.length})</span>
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                currentView === 'settings'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-3 sm:p-4 rounded-lg border flex items-center space-x-2 animate-fade-in max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-900 border-green-700 text-green-300' 
            : 'bg-red-900 border-red-700 text-red-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          )}
          <span className="text-sm sm:text-base">{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {currentView === 'settings' ? (
          /* Settings View */
          <div>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Site Settings</h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage site-wide settings and maintenance mode</p>
            </div>

            {/* Maintenance Mode Setting */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Maintenance Mode</h3>
                  <p className="text-gray-400 text-sm">
                    When enabled, shows a maintenance popup to all users except admins. 
                    Users cannot interact with the site during maintenance.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${maintenanceMode ? 'text-red-400' : 'text-green-400'}`}>
                    {maintenanceMode ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => onMaintenanceModeChange(!maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                      maintenanceMode ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {maintenanceMode && (
                <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-300 text-sm font-medium">Maintenance Mode Active</span>
                  </div>
                  <p className="text-red-200 text-sm mt-1">
                    All users (except admins) will see the maintenance popup and cannot access the site.
                  </p>
                </div>
              )}
            </div>

            {/* Site Statistics */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Site Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Total Items</span>
                    <span className="text-white font-bold text-lg">{items.length}</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Value Changes</span>
                    <span className="text-white font-bold text-lg">{valueChanges.length}</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Online Users</span>
                    <span className="text-green-400 font-bold text-lg">{usersLoading ? '...' : onlineCount}</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Categories</span>
                    <span className="text-white font-bold text-lg">{categories.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'items' ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Item Management</h1>
                <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Manage AOT:R item values and properties</p>
              </div>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Item</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm sm:text-base">{error}</span>
              </div>
            )}

            {/* Search and Filter Controls */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700 mb-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Filters and Sort */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Category Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Field */}
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as any)}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="value">Sort by Value</option>
                    <option value="demand">Sort by Demand</option>
                    <option value="prestige">Sort by Prestige</option>
                    <option value="category">Sort by Category</option>
                  </select>

                  {/* Sort Order */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center justify-center space-x-2 bg-gray-800 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                    <span className="sm:hidden">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
                  </button>

                  {/* Results Count */}
                  <div className="flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-gray-300 text-sm sm:text-base">
                    <Eye className="w-4 h-4 mr-2" />
                    <span>{filteredAndSortedItems.length} items</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table - Mobile Responsive */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Demand
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredAndSortedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {renderItemIcon(item.emoji, item.name)}
                            <div>
                              <div className="text-sm font-medium text-white">{item.name}</div>
                              <div className="text-sm text-gray-400">Prestige {item.prestige}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-blue-400 font-medium">🔑 {item.value}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white">{item.demand}/10</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            {getRateIcon(item.rateOfChange)}
                            <span className="text-white text-sm">{item.rateOfChange}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Obtainable' ? 'bg-green-900 text-green-200' :
                            item.status === 'Limited' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-red-900 text-red-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 hover:bg-opacity-30 rounded-lg transition-colors"
                              title="Edit Item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredAndSortedItems.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {renderItemIcon(item.emoji, item.name)}
                        <div>
                          <h3 className="text-white font-medium text-sm">{item.name}</h3>
                          <p className="text-gray-400 text-xs">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 hover:bg-opacity-30 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Value:</span>
                        <span className="text-blue-400 font-medium ml-2">🔑 {item.value}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Demand:</span>
                        <span className="text-white ml-2">{item.demand}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rate:</span>
                        <div className="flex items-center space-x-1 ml-2">
                          {getRateIcon(item.rateOfChange)}
                          <span className="text-white text-xs">{item.rateOfChange}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Obtainable' ? 'bg-green-900 text-green-200' :
                          item.status === 'Limited' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-red-900 text-red-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredAndSortedItems.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-4xl sm:text-6xl mb-4">📦</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No items found</h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  {searchTerm || selectedCategory ? 'Try adjusting your search or filters' : 'Create your first item to get started'}
                </p>
              </div>
            )}
          </>
        ) : currentView === 'changes' ? (
          /* Value Changes View */
          <div>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Value Changes History</h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Track all item value, demand, and rate changes - Delete test entries</p>
            </div>

            {changesLoading ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm sm:text-base">Loading changes...</p>
              </div>
            ) : valueChanges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl sm:text-6xl mb-4">📊</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No changes recorded yet</h3>
                <p className="text-gray-500 text-sm sm:text-base">Value changes will appear here when items are updated</p>
              </div>
            ) : (
              <div className="space-y-4">
                {valueChanges.map((change) => {
                  const changeDescriptions = getChangeDescription(change);
                  
                  return (
                    <div key={change.id} className="bg-gray-900 rounded-lg border border-gray-700 p-4 sm:p-6 hover:border-gray-600 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          {renderItemIcon(change.emoji, change.itemName)}
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">{change.itemName}</h3>
                            <p className="text-xs sm:text-sm text-gray-400">
                              {new Date(change.changeDate).toLocaleDateString()} at {new Date(change.changeDate).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end space-x-2">
                          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            change.changeType === 'increase' ? 'bg-green-900 text-green-200' :
                            change.changeType === 'decrease' ? 'bg-red-900 text-red-200' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {change.changeType === 'increase' ? '📈 Increased' :
                             change.changeType === 'decrease' ? '📉 Decreased' : '➡️ Updated'}
                          </div>
                          
                          <button
                            onClick={() => handleDeleteValueChange(change.id, change.itemName)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors"
                            title="Delete Value Change"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* What Changed Section */}
                      <div className="mt-4 bg-gray-800 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-400 mb-2">What Changed:</p>
                        <div className="space-y-1">
                          {changeDescriptions.map((description, index) => (
                            <p key={index} className="text-xs sm:text-sm text-white">{description}</p>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-xs sm:text-sm text-gray-400 mb-1">Value Change</p>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-blue-400 text-sm">🔑 {change.oldValue}</span>
                            <span className="text-gray-400 text-sm">→</span>
                            <span className="text-blue-400 font-medium text-sm">🔑 {change.newValue}</span>
                            {change.oldValue !== change.newValue && (
                              <span className={`text-xs ${change.newValue > change.oldValue ? 'text-green-400' : 'text-red-400'}`}>
                                ({change.newValue > change.oldValue ? '+' : ''}{change.newValue - change.oldValue})
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-xs sm:text-sm text-gray-400 mb-1">Demand Change</p>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-white text-sm">{change.oldDemand}/10</span>
                            <span className="text-gray-400 text-sm">→</span>
                            <span className="text-white font-medium text-sm">{change.newDemand}/10</span>
                            {change.oldDemand !== change.newDemand && (
                              <span className={`text-xs ${change.newDemand > change.oldDemand ? 'text-green-400' : 'text-red-400'}`}>
                                ({change.newDemand > change.oldDemand ? '+' : ''}{change.newDemand - change.oldDemand})
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-3 sm:col-span-2 lg:col-span-1">
                          <p className="text-xs sm:text-sm text-gray-400 mb-1">Rate Change</p>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <div className="flex items-center space-x-1">
                              {getRateIcon(change.oldRateOfChange)}
                              <span className="text-white text-xs sm:text-sm">{change.oldRateOfChange}</span>
                            </div>
                            <span className="text-gray-400 text-sm">→</span>
                            <div className="flex items-center space-x-1">
                              {getRateIcon(change.newRateOfChange)}
                              <span className="text-white font-medium text-xs sm:text-sm">{change.newRateOfChange}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {change.percentageChange !== 0 && (
                        <div className="mt-3 text-center">
                          <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            (change.percentageChange || 0) > 0 ? 'bg-green-900 bg-opacity-30 text-green-400' : 'bg-red-900 bg-opacity-30 text-red-400'
                          }`}>
                            {(change.percentageChange || 0) > 0 ? '+' : ''}{(change.percentageChange || 0).toFixed(1)}% value change
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : currentView === 'scam-logs' ? (
          /* Scam Logs View */
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Scam Logs Management</h1>
                <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Report and manage scammer accounts</p>
              </div>

              <button
                onClick={() => setShowScamLogForm(true)}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Report Scammer</span>
              </button>
            </div>

            {scamLogsLoading ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm sm:text-base">Loading scam logs...</p>
              </div>
            ) : scamLogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl sm:text-6xl mb-4">📋</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No scam reports yet</h3>
                <p className="text-gray-500 text-sm sm:text-base">Create the first scam report to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scamLogs.map((log) => (
                  <div key={log.id} className="bg-gray-900 rounded-lg border border-red-900 p-4 sm:p-6 hover:border-red-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <h3 className="text-lg font-semibold text-white">Roblox ID: {log.robloxId}</h3>
                        </div>

                        {log.discordId && (
                          <p className="text-gray-400 text-sm mb-2">Discord ID: {log.discordId}</p>
                        )}

                        <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-3 mb-3">
                          <p className="text-sm text-red-200">{log.reason}</p>
                        </div>

                        {log.evidenceUrl && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1">Evidence:</p>
                            <a
                              href={log.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm truncate"
                            >
                              {log.evidenceUrl}
                            </a>
                          </div>
                        )}

                        <p className="text-xs text-gray-500">
                          Reported on {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteScamLog(log.id, log.robloxId)}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors mt-3 sm:mt-0 w-full sm:w-auto justify-center"
                        title="Delete Scam Log"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Forms */}
      {showCreateForm && (
        <ItemForm
          onSubmit={handleCreateItem}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingItem && (
        <ItemForm
          item={editingItem}
          onSubmit={(data) => handleUpdateItem(editingItem.id, data)}
          onCancel={() => setEditingItem(null)}
        />
      )}

      {showScamLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-white">Report Scammer</h3>
              </div>
              <button
                onClick={() => setShowScamLogForm(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateScamLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Roblox ID *
                </label>
                <input
                  type="text"
                  required
                  value={scamLogForm.robloxId}
                  onChange={(e) => setScamLogForm({ ...scamLogForm, robloxId: e.target.value })}
                  placeholder="Enter Roblox username or ID"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discord ID (Optional)
                </label>
                <input
                  type="text"
                  value={scamLogForm.discordId}
                  onChange={(e) => setScamLogForm({ ...scamLogForm, discordId: e.target.value })}
                  placeholder="Enter Discord username or ID"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for Report *
                </label>
                <textarea
                  required
                  value={scamLogForm.reason}
                  onChange={(e) => setScamLogForm({ ...scamLogForm, reason: e.target.value })}
                  placeholder="Describe the scam or fraudulent activity in detail"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Evidence URL (Optional)
                </label>
                <input
                  type="url"
                  value={scamLogForm.evidenceUrl}
                  onChange={(e) => setScamLogForm({ ...scamLogForm, evidenceUrl: e.target.value })}
                  placeholder="Link to screenshot, video, or other evidence"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-400 mt-1">Supports images and external links</p>
              </div>

              <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-3">
                <p className="text-blue-300 text-sm">
                  This report will be visible to all users on the Scam Logs page. Ensure all information is accurate.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScamLogForm(false)}
                  className="px-4 sm:px-6 py-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Report Scammer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const StockRotationAdmin = () => {
  const [slots, setSlots] = useState(["", "", "", ""]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current rotation from DB
  const loadStock = async () => {
    const { data, error } = await supabase
      .from("stock_rotation")
      .select("slot1, slot2, slot3, slot4")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setSlots([data.slot1 || "", data.slot2 || "", data.slot3 || "", data.slot4 || ""]);
    }
    setLoading(false);
  };

  // Save updated stock
  const saveStock = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("stock_rotation")
      .update({
        slot1: slots[0] || null,
        slot2: slots[1] || null,
        slot3: slots[2] || null,
        slot4: slots[3] || null,
      })
      .eq("id", 1);

    setSaving(false);

    if (error) {
      alert("Failed to save stock rotation");
    } else {
      alert("Stock rotation updated!");
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Loading stock rotation...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Stock Rotation
      </h1>

      <p className="text-gray-400 mb-6">
        Update the 4 cosmetic items shown in the Cosmetic Market.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {slots.map((slot, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <label className="block text-gray-300 text-sm mb-2">
              Slot {i + 1}
            </label>
            <input
              type="text"
              value={slot}
              onChange={(e) => {
                const newSlots = [...slots];
                newSlots[i] = e.target.value;
                setSlots(newSlots);
              }}
              placeholder="Cosmetic Name"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg"
            />
          </div>
        ))}
      </div>

      <button
        onClick={saveStock}
        disabled={saving}
        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium"
      >
        {saving ? "Saving..." : "Save Rotation"}
      </button>
    </div>
  );
};

};
