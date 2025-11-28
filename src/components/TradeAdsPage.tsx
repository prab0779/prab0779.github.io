import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Clock, User, MessageCircle, Tag, X, Save, ArrowLeftRight, Eye } from 'lucide-react';
import { useTradeAds } from '../hooks/useTradeAds';
import { TradeAd, CreateTradeAdData, TradeAdItem } from '../types/TradeAd';
import { Item } from '../types/Item';

interface TradeAdsPageProps {
  items: Item[];
}

const AVAILABLE_TAGS = [
  'Upgrade', 'Downgrade', 'GP', 'Fair Trade', 'Quick Trade', 
  'Bulk Trade', 'Rare Items', 'Limited Items', 'New Player Friendly',
  'High Value', 'Collection', 'Overpay', 'Underpay'
];

export const TradeAdsPage: React.FC<TradeAdsPageProps> = ({ items }) => {
  const { tradeAds, loading, error, createTradeAd, updateTradeAdStatus } = useTradeAds();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredTradeAds = useMemo(() => {
    return tradeAds.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || ad.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [tradeAds, searchTerm, selectedTag]);

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== 'string') {
      return <span className="text-xl">👹</span>;
    }
    
    if (emoji.startsWith('/') || emoji.startsWith('./')) {
      return (
        <div className="w-6 h-6 flex items-center justify-center">
          <img 
            src={emoji.startsWith('./') ? emoji.slice(2) : emoji.slice(1)} 
            alt={itemName}
            className="w-6 h-6 object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="text-xl hidden">👹</span>
        </div>
      );
    }
    return <span className="text-xl">{emoji}</span>;
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const CreateTradeAdForm: React.FC<{
    onSubmit: (data: CreateTradeAdData) => void;
    onCancel: () => void;
  }> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<CreateTradeAdData>({
      title: '',
      description: '',
      itemsWanted: [],
      itemsOffering: [],
      tags: [],
      authorName: '',
      contactInfo: '',
    });
    const [showItemModal, setShowItemModal] = useState<'wanted' | 'offering' | null>(null);

    const addItem = (item: Item, type: 'wanted' | 'offering') => {
      const tradeItem: TradeAdItem = {
        itemId: item.id,
        itemName: item.name,
        emoji: item.emoji,
        value: item.value,
        quantity: 1,
      };
      
      if (type === 'wanted') {
        setFormData(prev => ({ ...prev, itemsWanted: [...prev.itemsWanted, tradeItem] }));
      } else {
        setFormData(prev => ({ ...prev, itemsOffering: [...prev.itemsOffering, tradeItem] }));
      }
      setShowItemModal(null);
    };

    const removeItem = (index: number, type: 'wanted' | 'offering') => {
      if (type === 'wanted') {
        setFormData(prev => ({ ...prev, itemsWanted: prev.itemsWanted.filter((_, i) => i !== index) }));
      } else {
        setFormData(prev => ({ ...prev, itemsOffering: prev.itemsOffering.filter((_, i) => i !== index) }));
      }
    };

    const updateQuantity = (index: number, quantity: number, type: 'wanted' | 'offering') => {
      if (type === 'wanted') {
        setFormData(prev => ({
          ...prev,
          itemsWanted: prev.itemsWanted.map((item, i) => 
            i === index ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          itemsOffering: prev.itemsOffering.map((item, i) => 
            i === index ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        }));
      }
    };

    const toggleTag = (tag: string) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.includes(tag) 
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.itemsWanted.length === 0 && formData.itemsOffering.length === 0) {
        showNotification('error', 'Please add at least one item to your trade');
        return;
      }
      onSubmit(formData);
    };

    const ItemModal: React.FC<{ 
      isOpen: boolean; 
      onClose: () => void; 
      onSelect: (item: Item) => void; 
      title: string 
    }> = ({ isOpen, onClose, onSelect, title }) => {
      const [searchTerm, setSearchTerm] = useState('');
      
      if (!isOpen) return null;

      const filteredItems = items
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.value - a.value);

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3"
                >
                  {renderItemIcon(item.emoji, item.name)}
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Create Trade Ad</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trade Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Looking for rare items..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your display name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Info (Discord, etc.) *
              </label>
              <input
                type="text"
                required
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Discord: username#1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional details about your trade..."
              />
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Items Wanted */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-white">Items Wanted</h4>
                  <button
                    type="button"
                    onClick={() => setShowItemModal('wanted')}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-2 min-h-[100px] bg-gray-800 rounded-lg p-3">
                  {formData.itemsWanted.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        {renderItemIcon(item.emoji, item.itemName)}
                        <span className="text-white text-sm">{item.itemName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1, 'wanted')}
                          className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index, 'wanted')}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.itemsWanted.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No items added yet</p>
                  )}
                </div>
              </div>

              {/* Items Offering */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-white">Items Offering</h4>
                  <button
                    type="button"
                    onClick={() => setShowItemModal('offering')}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-2 min-h-[100px] bg-gray-800 rounded-lg p-3">
                  {formData.itemsOffering.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        {renderItemIcon(item.emoji, item.itemName)}
                        <span className="text-white text-sm">{item.itemName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1, 'offering')}
                          className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index, 'offering')}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.itemsOffering.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No items added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Trade Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
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
                <span>Post Trade</span>
              </button>
            </div>
          </form>

          {/* Item Modals */}
          <ItemModal
            isOpen={showItemModal === 'wanted'}
            onClose={() => setShowItemModal(null)}
            onSelect={(item) => addItem(item, 'wanted')}
            title="Select Item You Want"
          />

          <ItemModal
            isOpen={showItemModal === 'offering'}
            onClose={() => setShowItemModal(null)}
            onSelect={(item) => addItem(item, 'offering')}
            title="Select Item You're Offering"
          />
        </div>
      </div>
    );
  };

  const handleCreateTradeAd = async (adData: CreateTradeAdData) => {
    const { error } = await createTradeAd(adData);
    if (error) {
      showNotification('error', error);
    } else {
      showNotification('success', 'Trade ad posted successfully!');
      setShowCreateForm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading trade ads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-in">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border flex items-center space-x-2 animate-fade-in ${
          notification.type === 'success' 
            ? 'bg-green-900 border-green-700 text-green-300' 
            : 'bg-red-900 border-red-700 text-red-300'
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trade Ads
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Post and browse community trade offers
        </p>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Post Trade Ad</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search trade ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {AVAILABLE_TAGS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2">
            <Eye className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-white">{filteredTradeAds.length} ads</span>
          </div>
        </div>
      </div>

      {/* Trade Ads List */}
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 text-red-300">
          Error loading trade ads: {error}
        </div>
      )}

      {filteredTradeAds.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No trade ads found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedTag ? 'Try adjusting your search or filters' : 'Be the first to post a trade ad!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTradeAds.map((ad) => (
            <div key={ad.id} className="bg-gray-900 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{ad.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{ad.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{getRelativeTime(ad.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">{ad.contactInfo}</span>
                </div>
              </div>

              {/* Description */}
              {ad.description && (
                <p className="text-gray-300 text-sm mb-4">{ad.description}</p>
              )}

              {/* Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Offering */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <h4 className="text-blue-400 font-medium mb-2 text-sm">💎 Offering</h4>
                  <div className="space-y-1">
                    {ad.itemsOffering.length === 0 ? (
                      <p className="text-gray-500 text-xs">Open to offers</p>
                    ) : (
                      ad.itemsOffering.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {renderItemIcon(item.emoji, item.itemName)}
                          <span className="text-white text-xs">{item.itemName}</span>
                          {item.quantity > 1 && (
                            <span className="text-gray-400 text-xs">x{item.quantity}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Wanting */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <h4 className="text-green-400 font-medium mb-2 text-sm">🔍 Looking For</h4>
                  <div className="space-y-1">
                    {ad.itemsWanted.length === 0 ? (
                      <p className="text-gray-500 text-xs">Open to offers</p>
                    ) : (
                      ad.itemsWanted.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {renderItemIcon(item.emoji, item.itemName)}
                          <span className="text-white text-xs">{item.itemName}</span>
                          {item.quantity > 1 && (
                            <span className="text-gray-400 text-xs">x{item.quantity}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {ad.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {ad.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-300 rounded-full text-xs font-medium border border-blue-700"
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            
            </div>
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateTradeAdForm
          onSubmit={handleCreateTradeAd}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};
