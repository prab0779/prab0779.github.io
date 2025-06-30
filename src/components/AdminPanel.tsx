import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Search, Edit3, AlertTriangle, ExternalLink, User, Shield } from 'lucide-react';
import { Item } from '../types/Item';

interface AdminPanelProps {
  items: Item[];
  onUpdateItem: (itemId: string, updates: Partial<Item>) => void;
  isAuthenticated: boolean;
  onAuthenticate: (userData: any) => void;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  global_name?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  items, 
  onUpdateItem, 
  isAuthenticated, 
  onAuthenticate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Item>>({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<DiscordUser | null>(null);

  // Discord OAuth2 configuration
  const DISCORD_CLIENT_ID = '1234567890123456789'; // You'll need to replace this with your actual Discord app client ID
  const REDIRECT_URI = encodeURIComponent(window.location.origin + '/admin');
  const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`;

  useEffect(() => {
    // Check for OAuth code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !isAuthenticated) {
      handleDiscordCallback(code);
    }

    // Check for stored user data
    const storedUser = localStorage.getItem('discordUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      if (userData.username === 'los1zoro') {
        onAuthenticate(userData);
      }
    }
  }, []);

  const handleDiscordCallback = async (code: string) => {
    setIsLoading(true);
    setAuthError('');

    try {
      // In a real implementation, you'd send this code to your backend
      // For demo purposes, we'll simulate the Discord API response
      
      // This is a mock response - in production, your backend would handle the OAuth flow
      const mockDiscordUser: DiscordUser = {
        id: '123456789',
        username: 'los1zoro', // This would come from Discord API
        discriminator: '0001',
        avatar: 'avatar_hash',
        global_name: 'Los1Zoro'
      };

      // Store user data
      localStorage.setItem('discordUser', JSON.stringify(mockDiscordUser));
      setUser(mockDiscordUser);

      // Check if user is authorized
      if (mockDiscordUser.username === 'los1zoro') {
        onAuthenticate(mockDiscordUser);
        setAuthError('');
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setAuthError('Access denied. Only los1zoro is authorized to access this panel.');
        localStorage.removeItem('discordUser');
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
      console.error('Discord OAuth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = DISCORD_OAUTH_URL;
  };

  const handleLogout = () => {
    localStorage.removeItem('discordUser');
    setUser(null);
    onAuthenticate(null);
    setAuthError('');
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item.id);
    setEditForm({ ...item });
  };

  const handleSaveItem = () => {
    if (editingItem && editForm) {
      onUpdateItem(editingItem, editForm);
      setEditingItem(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItemIcon = (emoji: string, itemName: string) => {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
              <p className="text-gray-400">Authenticate with Discord to access admin panel</p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Authenticating...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleDiscordLogin}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Login with Discord</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                {authError && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-900 bg-opacity-30 p-3 rounded-lg border border-red-700">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="mt-6 p-4 bg-yellow-900 bg-opacity-30 rounded-lg border border-yellow-700">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ <strong>Restricted Access:</strong> Only authorized Discord users can access this admin panel.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
                  <p className="text-blue-300 text-sm">
                    💡 <strong>Note:</strong> This demo uses a mock Discord OAuth flow. In production, you'd need to set up a proper Discord application and backend.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Header with User Info */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-red-400" />
                Admin Panel
              </h1>
              <p className="text-gray-400">Manage item values, demand, and properties</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-2">
                  <User className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">{user.global_name || user.username}</p>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items to edit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-lg border border-gray-700 p-4">
              {editingItem === item.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {renderItemIcon(item.emoji, item.name)}
                      <h3 className="text-lg font-semibold text-white">Editing: {item.name}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveItem}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Value</label>
                      <input
                        type="number"
                        value={editForm.value || 0}
                        onChange={(e) => setEditForm({ ...editForm, value: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Demand (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editForm.demand || 1}
                        onChange={(e) => setEditForm({ ...editForm, demand: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Rate of Change</label>
                      <select
                        value={editForm.rateOfChange || 'Stable'}
                        onChange={(e) => setEditForm({ ...editForm, rateOfChange: e.target.value as any })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Rising">Rising</option>
                        <option value="Falling">Falling</option>
                        <option value="Stable">Stable</option>
                        <option value="Overpriced">Overpriced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <select
                        value={editForm.status || 'Obtainable'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Obtainable">Obtainable</option>
                        <option value="Unobtainable">Unobtainable</option>
                        <option value="Limited">Limited</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Tax (Gems)</label>
                      <input
                        type="number"
                        value={editForm.taxGem || 0}
                        onChange={(e) => setEditForm({ ...editForm, taxGem: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Rarity (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.rarity || 0}
                        onChange={(e) => setEditForm({ ...editForm, rarity: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {renderItemIcon(item.emoji, item.name)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Value</p>
                      <p className="text-blue-400 font-semibold">🔑 {item.value}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-400">Demand</p>
                      <p className="text-yellow-400 font-semibold">{item.demand}/10</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-400">Rate</p>
                      <p className="text-purple-400 font-semibold">{item.rateOfChange}</p>
                    </div>

                    <button
                      onClick={() => handleEditItem(item)}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};