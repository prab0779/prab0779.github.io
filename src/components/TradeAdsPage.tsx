import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Clock,
  User,
  MessageCircle,
  Tag,
  X,
  Save,
  Eye
} from "lucide-react";

import { useTradeAds } from "../hooks/useTradeAds";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

import {
  CreateTradeAdData,
  TradeAdItem
} from "../types/TradeAd";
import { Item } from "../types/Item";

interface TradeAdsPageProps {
  items: Item[];
}

const AVAILABLE_TAGS = [
  "Upgrade",
  "Downgrade",
  "GP",
  "Fair Trade",
  "Quick Trade",
  "Bulk Trade",
  "Rare Items",
  "Limited Items",
  "New Player Friendly",
  "High Value",
  "Collection",
  "Overpay",
  "Underpay"
];

export const TradeAdsPage: React.FC<TradeAdsPageProps> = ({ items }) => {
  const { user, signInWithDiscord } = useAuth();
  const { tradeAds, loading, error, createTradeAd } = useTradeAds();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredTradeAds = useMemo(() => {
    return tradeAds.filter((ad) => {
      const matchesSearch =
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.authorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = !selectedTag || ad.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [tradeAds, searchTerm, selectedTag]);

  const renderItemIcon = (emoji: string, itemName: string) => {
  if (!emoji || typeof emoji !== "string") {
    return <span className="text-xl">👹</span>;
  }

  // Image file support: /file.png or ./file.png
  if (emoji.startsWith("/") || emoji.startsWith("./")) {
    return (
      <img
        src={emoji}
        alt={itemName}
        className="w-6 h-6 object-contain inline-block rounded-sm"
      />
    );
  }

  // Unicode emoji support
  return <span className="text-xl">{emoji}</span>;
};


  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  // ---------------------------
  // Create Trade Form Component
  // ---------------------------

  const CreateTradeAdForm: React.FC<{
    onSubmit: (data: CreateTradeAdData) => void;
    onCancel: () => void;
  }> = ({ onSubmit, onCancel }) => {
    const discordName =
      user?.user_metadata?.preferred_username ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email ||
      "Unknown User";

    const getDiscordAvatarUrl = () => {
      if (!user?.user_metadata) return null;

      const avatarHash = user.user_metadata.avatar_url;
      const providerId = user.user_metadata.provider_id || user.user_metadata.sub;

      if (!avatarHash || !providerId) return null;

      if (avatarHash.startsWith('http')) {
        return avatarHash;
      }

      return `https://cdn.discordapp.com/avatars/${providerId}/${avatarHash}.png`;
    };

    const discordAvatar = getDiscordAvatarUrl();
    console.log("Discord metadata:", user?.user_metadata);
    console.log("Constructed avatar URL:", discordAvatar);

    const [formData, setFormData] = useState<CreateTradeAdData>({
      title: "",
      itemsWanted: [],
      itemsOffering: [],
      tags: [],
      authorAvatar: discordAvatar,
      authorName: discordName,
      contactInfo: discordName,
      description: ""
    });

    const [showItemModal, setShowItemModal] = useState<"wanted" | "offering" | null>(null);

    const addItem = (item: Item, type: "wanted" | "offering") => {
      const tradeItem: TradeAdItem = {
        itemId: item.id,
        itemName: item.name,
        emoji: item.emoji,
        value: item.value,
        quantity: 1
      };

      setFormData((prev) => ({
        ...prev,
        [type === "wanted" ? "itemsWanted" : "itemsOffering"]: [
          ...(type === "wanted" ? prev.itemsWanted : prev.itemsOffering),
          tradeItem
        ]
      }));

      setShowItemModal(null);
    };

    const removeItem = (index: number, type: "wanted" | "offering") => {
      setFormData((prev) => ({
        ...prev,
        [type === "wanted" ? "itemsWanted" : "itemsOffering"]: (
          type === "wanted" ? prev.itemsWanted : prev.itemsOffering
        ).filter((_, i) => i !== index)
      }));
    };

    const updateQuantity = (index: number, q: number, type: "wanted" | "offering") => {
      const quantity = Math.max(1, q);
      setFormData((prev) => ({
        ...prev,
        [type === "wanted" ? "itemsWanted" : "itemsOffering"]: (
          type === "wanted" ? prev.itemsWanted : prev.itemsOffering
        ).map((item, i) => (i === index ? { ...item, quantity } : item))
      }));
    };

    const toggleTag = (tag: string) => {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag]
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (formData.itemsWanted.length === 0 && formData.itemsOffering.length === 0) {
        showNotification("error", "Please add at least one item");
        return;
      }

      onSubmit({
        ...formData,
        authorName: discordName,
        authorAvatar: discordAvatar,
        contactInfo: discordName,
        description: ""
      });
    };

    const ItemModal = ({
      isOpen,
      onClose,
      onSelect,
      title
    }: {
      isOpen: boolean;
      onClose: () => void;
      onSelect: (item: Item) => void;
      title: string;
    }) => {
      const [searchTerm, setSearchTerm] = useState("");
      if (!isOpen) return null;

      const filteredItems = items.filter((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between mb-4">
              <h3 className="text-white font-semibold">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-gray-800 border border-gray-600 rounded text-white"
            />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded flex items-center space-x-3"
                >
                  {renderItemIcon(item.emoji, item.name)}
                  <span className="text-white">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl text-white font-semibold">Create Trade Ad</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}
            <div>
              <label className="text-sm text-gray-300">Trade Title *</label>
              <input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                placeholder="Looking for Vizard Mask..."
              />
            </div>

            {/* AUTO-FILLED DISCORD USERNAME */}
            <div>
              <label className="text-sm text-gray-300">Discord Username</label>
              <input
                value={discordName}
                disabled
                className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded border border-gray-600"
              />
            </div>

            {/* ITEMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wanted */}
              <div>
                <div className="flex justify-between mb-2">
                  <h4 className="text-white font-medium">Items Wanted</h4>
                  <button
                    type="button"
                    onClick={() => setShowItemModal("wanted")}
                    className="px-3 py-1 bg-green-600 rounded text-white text-sm"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2 bg-gray-800 p-3 rounded">
                  {formData.itemsWanted.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                      No items yet
                    </p>
                  ) : (
                    formData.itemsWanted.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between bg-gray-700 p-2 rounded"
                      >
                        <div className="flex space-x-2 items-center">
                          {renderItemIcon(item.emoji, item.itemName)}
                          <span className="text-white text-sm">
                            {item.itemName}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(i, parseInt(e.target.value), "wanted")
                            }
                            className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(i, "wanted")}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Offering */}
              <div>
                <div className="flex justify-between mb-2">
                  <h4 className="text-white font-medium">Items Offering</h4>
                  <button
                    type="button"
                    onClick={() => setShowItemModal("offering")}
                    className="px-3 py-1 bg-blue-600 rounded text-white text-sm"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2 bg-gray-800 p-3 rounded">
                  {formData.itemsOffering.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                      No items yet
                    </p>
                  ) : (
                    formData.itemsOffering.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between bg-gray-700 p-2 rounded"
                      >
                        <div className="flex space-x-2 items-center">
                          {renderItemIcon(item.emoji, item.itemName)}
                          <span className="text-white text-sm">
                            {item.itemName}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(i, parseInt(e.target.value), "offering")
                            }
                            className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(i, "offering")}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* TAGS */}
            <div>
              <label className="text-sm text-gray-300 mb-2">Trade Tags</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.tags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Post Trade</span>
              </button>
            </div>
          </form>

          <ItemModal
            isOpen={showItemModal === "wanted"}
            onClose={() => setShowItemModal(null)}
            onSelect={(item) => addItem(item, "wanted")}
            title="Select Item You Want"
          />

          <ItemModal
            isOpen={showItemModal === "offering"}
            onClose={() => setShowItemModal(null)}
            onSelect={(item) => addItem(item, "offering")}
            title="Select Item You're Offering"
          />
        </div>
      </div>
    );
  };

  // ---------------------------
  // MAIN PAGE
  // ---------------------------

  const handleCreateTradeAd = async (adData: CreateTradeAdData) => {
    const { error } = await createTradeAd(adData);
    if (error) showNotification("error", error);
    else {
      showNotification("success", "Trade posted!");
      setShowCreateForm(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12 text-gray-400">
        Loading trade ads...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* NOTIFICATION */}
      {notification && (
        <div
          className={`fixed top-20 right-4 p-4 rounded border ${
            notification.type === "success"
              ? "bg-green-900 border-green-700 text-green-300"
              : "bg-red-900 border-red-700 text-red-300"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* HEADER */}
      <div className="text-center py-8">
        <h1 className="text-3xl text-white font-bold mb-4">Trade Ads</h1>
        <p className="text-gray-400 text-lg mb-6">
          Post and browse trade offers
        </p>

        {/* LOGIN / POST BUTTON */}
        <button
          onClick={() => {
            if (!user) {
              signInWithDiscord();
              return;
            }
            setShowCreateForm(true);
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center space-x-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          <span>{user ? "Post Trade Ad" : "Login with Discord"}</span>
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="bg-gray-900 p-6 rounded border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">All Tags</option>
              {AVAILABLE_TAGS.map((tag) => (
                <option key={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center px-3 py-2 bg-gray-800 border border-gray-600 rounded">
            <Eye className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-white">{filteredTradeAds.length} ads</span>
          </div>
        </div>
      </div>

      {/* LIST */}
      {filteredTradeAds.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No ads found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTradeAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-gray-900 rounded border border-gray-700 p-6"
            >
              <h3 className="text-lg text-white font-semibold">{ad.title}</h3>

             <div className="flex items-center space-x-3 mt-2 mb-4">
  <img
    src={ad.authorAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
    alt={`${ad.authorName}'s avatar`}
    className="w-8 h-8 rounded-full border border-gray-700 bg-gray-800"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = "https://cdn.discordapp.com/embed/avatars/0.png";
    }}
  />
  <div>
    <p className="text-white text-sm font-semibold">{ad.authorName}</p>
    <p className="text-gray-500 text-xs">{getRelativeTime(ad.createdAt)}</p>
  </div>
</div>


              {/* ITEMS */}
              <div className="grid grid-cols-2 gap-4">
                {/* OFFERING */}
                <div className="bg-gray-800 p-3 rounded">
                  <h4 className="text-blue-400 font-medium text-sm mb-2">
                    💎 Offering
                  </h4>

                  {ad.itemsOffering.length === 0 ? (
                    <p className="text-gray-500 text-xs">Open to offers</p>
                  ) : (
                    ad.itemsOffering.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-xs"
                      >
                        {renderItemIcon(item.emoji, item.itemName)}
                        <span className="text-white">{item.itemName}</span>
                        {item.quantity > 1 && (
                          <span className="text-gray-400">x{item.quantity}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* WANTING */}
                <div className="bg-gray-800 p-3 rounded">
                  <h4 className="text-green-400 font-medium text-sm mb-2">
                    🔍 Looking For
                  </h4>

                  {ad.itemsWanted.length === 0 ? (
                    <p className="text-gray-500 text-xs">Open to offers</p>
                  ) : (
                    ad.itemsWanted.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-xs"
                      >
                        {renderItemIcon(item.emoji, item.itemName)}
                        <span className="text-white">{item.itemName}</span>
                        {item.quantity > 1 && (
                          <span className="text-gray-400">x{item.quantity}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* TAGS */}
              {ad.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {ad.tags.map((tag, i) => (
                    <span
                      key={i}
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

      {/* FORM MODAL */}
      {showCreateForm && (
        <CreateTradeAdForm
          onSubmit={handleCreateTradeAd}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};
