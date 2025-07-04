import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, LogOut, AlertCircle, CheckCircle, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { useValueChanges } from '../hooks/useValueChanges';
import { Item } from '../types/Item';

export const AdminPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { items, loading, error, createItem, updateItem, deleteItem } = useItems();
  const { valueChanges, loading: changesLoading } = useValueChanges();
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentView, setCurrentView] = useState<'items' | 'changes'>('items');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
  };

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

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== 'string') {
      return <span className="text-2xl">👹</span>;
    }
    
    if (emoji.startsWith('/')) {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src={emoji} 
            alt={itemName}
            className="w-8 h-8 object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="text-2xl hidden">👹</span>
        </div>
      );
    }
    return <span className="text-2xl">{emoji}</span>;
  };

  const getRateIcon = (rate: string) => {
    switch (rate) {
      case 'Rising':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'Falling':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
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
        <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">
              {item ? 'Edit Item' : 'Create New Item'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rate of Change *
                </label>
                <select
                  value={formData.rateOfChange}
                  onChange={(e) => setFormData({ ...formData, rateOfChange: e.target.value as Item['rateOfChange'] })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Item['status'] })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emoji/Image *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
              <span className="text-2xl">⚔️</span>
              <span className="text-xl font-bold text-white">AOT:R Admin Panel</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('items')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'items'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Item Management
            </button>
            <button
              onClick={() => setCurrentView('changes')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                currentView === 'changes'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Value Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border flex items-center space-x-2 animate-fade-in ${
          notification.type === 'success' 
            ? 'bg-green-900 border-green-700 text-green-300' 
            : 'bg-red-900 border-red-700 text-red-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'items' ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Item Management</h1>
                <p className="text-gray-400 mt-2">Manage AOT:R item values and properties</p>
              </div>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 mb-6 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {/* Items Table */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
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
                    {items.map((item) => (
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
            </div>

            {items.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No items found</h3>
                <p className="text-gray-500">Create your first item to get started</p>
              </div>
            )}
          </>
        ) : (
          /* Value Changes View */
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Value Changes History</h1>
              <p className="text-gray-400 mt-2">Track all item value, demand, and rate changes</p>
            </div>

            {changesLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading changes...</p>
              </div>
            ) : valueChanges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No changes recorded yet</h3>
                <p className="text-gray-500">Value changes will appear here when items are updated</p>
              </div>
            ) : (
              <div className="space-y-4">
                {valueChanges.map((change) => (
                  <div key={change.id} className="bg-gray-900 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        {renderItemIcon(change.emoji, change.itemName)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{change.itemName}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(change.changeDate).toLocaleDateString()} at {new Date(change.changeDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        change.changeType === 'increase' ? 'bg-green-900 text-green-200' :
                        change.changeType === 'decrease' ? 'bg-red-900 text-red-200' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {change.changeType === 'increase' ? '📈 Increased' :
                         change.changeType === 'decrease' ? '📉 Decreased' : '➡️ Updated'}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-1">Value Change</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-400">🔑 {change.oldValue}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-400 font-medium">🔑 {change.newValue}</span>
                          {change.oldValue !== change.newValue && (
                            <span className={`text-sm ${change.newValue > change.oldValue ? 'text-green-400' : 'text-red-400'}`}>
                              ({change.newValue > change.oldValue ? '+' : ''}{change.newValue - change.oldValue})
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-1">Demand Change</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{change.oldDemand}/10</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-white font-medium">{change.newDemand}/10</span>
                          {change.oldDemand !== change.newDemand && (
                            <span className={`text-sm ${change.newDemand > change.oldDemand ? 'text-green-400' : 'text-red-400'}`}>
                              ({change.newDemand > change.oldDemand ? '+' : ''}{change.newDemand - change.oldDemand})
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-1">Rate Change</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {getRateIcon(change.oldRateOfChange)}
                            <span className="text-white text-sm">{change.oldRateOfChange}</span>
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center space-x-1">
                            {getRateIcon(change.newRateOfChange)}
                            <span className="text-white font-medium text-sm">{change.newRateOfChange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {change.percentageChange !== 0 && (
                      <div className="mt-3 text-center">
                        <span className={`text-sm font-medium ${
                          change.percentageChange > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {change.percentageChange > 0 ? '+' : ''}{change.percentageChange.toFixed(1)}% value change
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
    </div>
  );
};