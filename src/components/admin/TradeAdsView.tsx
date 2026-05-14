import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Ban, Search, AlertCircle, UserX, Undo2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getItemImageUrl } from '../../lib/supabase';

interface TradeAdRow {
  id: number;
  user_id: string | null;
  author_name: string;
  author_avatar: string | null;
  items_offering: any[];
  items_wanted: any[];
  status: string;
  created_at: string;
}

interface BannedUser {
  id: string;
  user_id: string;
  author_name: string;
  reason: string;
  created_at: string;
}

export const TradeAdsView: React.FC = () => {
  const [ads, setAds] = useState<TradeAdRow[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ads' | 'banned'>('ads');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [banReason, setBanReason] = useState('');
  const [banningUserId, setBanningUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const pageSize = 20;

  const notify = useCallback((type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('trade_ads')
      .select('id, user_id, author_name, author_avatar, items_offering, items_wanted, status, created_at', { count: 'estimated' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (searchTerm) {
      query = query.ilike('author_name', `%${searchTerm}%`);
    }

    const { data, error, count } = await query;
    if (error) {
      notify('error', error.message);
    } else {
      setAds(data || []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [page, searchTerm, notify]);

  const fetchBannedUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('banned_trade_users')
      .select('id, user_id, author_name, reason, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      notify('error', error.message);
    } else {
      setBannedUsers(data || []);
    }
  }, [notify]);

  useEffect(() => {
    if (tab === 'ads') fetchAds();
    else fetchBannedUsers();
  }, [tab, fetchAds, fetchBannedUsers]);

  const handleDeleteAd = async (id: number) => {
    if (!window.confirm('Delete this trade ad?')) return;
    const { error } = await supabase.from('trade_ads').delete().eq('id', id);
    if (error) notify('error', error.message);
    else {
      notify('success', 'Ad deleted');
      setAds(prev => prev.filter(a => a.id !== id));
      setTotal(t => Math.max(0, t - 1));
    }
  };

  const handleBanUser = async (userId: string, authorName: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return;

    const { error } = await supabase.from('banned_trade_users').insert({
      user_id: userId,
      banned_by: session.session.user.id,
      reason: banReason,
      author_name: authorName,
    });

    if (error) {
      if (error.message.includes('duplicate key')) {
        notify('error', 'User is already banned');
      } else {
        notify('error', error.message);
      }
    } else {
      notify('success', `${authorName} banned from posting ads`);
      setBanningUserId(null);
      setBanReason('');
    }
  };

  const handleUnbanUser = async (id: string, name: string) => {
    if (!window.confirm(`Unban ${name}?`)) return;
    const { error } = await supabase.from('banned_trade_users').delete().eq('id', id);
    if (error) notify('error', error.message);
    else {
      notify('success', `${name} unbanned`);
      setBannedUsers(prev => prev.filter(b => b.id !== id));
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const renderItemIcon = (emoji: string, name: string) => {
    if (!emoji) return <span className="text-sm">👹</span>;
    if (emoji.startsWith('/') || emoji.startsWith('./') || emoji.startsWith('http')) {
      return (
        <img
          src={getItemImageUrl(emoji)}
          alt={name}
          className="w-5 h-5 object-contain"
          loading="lazy"
        />
      );
    }
    return <span className="text-sm">{emoji}</span>;
  };

  return (
    <div className="space-y-5">
      {notification && (
        <div className={`fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl animate-fade-in max-w-xs text-sm ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-800/60 text-emerald-300'
            : 'bg-red-950/90 border-red-800/60 text-red-300'
        }`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {notification.msg}
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-white mb-1">Trade Ads Management</h1>
        <p className="text-white/40 text-sm">View, delete ads and ban users from posting</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] pb-0">
        <button
          onClick={() => setTab('ads')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
            tab === 'ads' ? 'text-[#c4a04a] bg-white/[0.04] border border-white/[0.06] border-b-transparent' : 'text-white/40 hover:text-white/70'
          }`}
        >
          All Ads ({total})
        </button>
        <button
          onClick={() => setTab('banned')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-1.5 ${
            tab === 'banned' ? 'text-[#c4a04a] bg-white/[0.04] border border-white/[0.06] border-b-transparent' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <UserX className="w-3.5 h-3.5" />
          Banned ({bannedUsers.length})
        </button>
      </div>

      {/* ADS TAB */}
      {tab === 'ads' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by author name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50 transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin" />
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <p>No trade ads found</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {ads.map((ad) => (
                  <div key={ad.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#6f572c]/40 transition-colors p-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Author info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {ad.author_avatar && (
                          <img src={ad.author_avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{ad.author_name || 'Unknown'}</p>
                          <p className="text-[11px] text-white/30">
                            {new Date(ad.created_at).toLocaleString()} - <span className={
                              ad.status === 'active' ? 'text-emerald-400' :
                              ad.status === 'completed' ? 'text-blue-400' : 'text-red-400'
                            }>{ad.status}</span>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {ad.user_id && (
                          <button
                            onClick={() => setBanningUserId(banningUserId === ad.user_id ? null : ad.user_id)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-orange-400 hover:bg-orange-900/20 transition-colors"
                            title="Ban user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                          title="Delete ad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ban form inline */}
                    {banningUserId === ad.user_id && (
                      <div className="mt-3 p-3 rounded-lg border border-orange-800/40 bg-orange-950/20 space-y-2">
                        <p className="text-xs text-orange-300 font-medium">Ban {ad.author_name} from posting ads</p>
                        <input
                          type="text"
                          placeholder="Reason (optional)"
                          value={banReason}
                          onChange={(e) => setBanReason(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 placeholder-white/20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBanUser(ad.user_id!, ad.author_name)}
                            className="px-3 py-1.5 rounded-lg bg-orange-700 hover:bg-orange-600 text-white text-xs font-medium transition-colors"
                          >
                            Confirm Ban
                          </button>
                          <button
                            onClick={() => { setBanningUserId(null); setBanReason(''); }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Items preview */}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1.5">Offering</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(ad.items_offering || []).slice(0, 4).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                              {renderItemIcon(item.emoji, item.itemName)}
                              <span className="text-[11px] text-white/70 max-w-[80px] truncate">{item.itemName}</span>
                              {item.quantity > 1 && <span className="text-[10px] text-[#c4a04a]">x{item.quantity}</span>}
                            </div>
                          ))}
                          {(ad.items_offering || []).length > 4 && (
                            <span className="text-[10px] text-white/30 self-center">+{ad.items_offering.length - 4} more</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1.5">Wants</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(ad.items_wanted || []).slice(0, 4).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                              {renderItemIcon(item.emoji, item.itemName)}
                              <span className="text-[11px] text-white/70 max-w-[80px] truncate">{item.itemName}</span>
                              {item.quantity > 1 && <span className="text-[10px] text-[#c4a04a]">x{item.quantity}</span>}
                            </div>
                          ))}
                          {(ad.items_wanted || []).length > 4 && (
                            <span className="text-[10px] text-white/30 self-center">+{ad.items_wanted.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-white/40">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* BANNED TAB */}
      {tab === 'banned' && (
        <div className="space-y-3">
          {bannedUsers.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <UserX className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No banned users</p>
            </div>
          ) : (
            bannedUsers.map((banned) => (
              <div key={banned.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{banned.author_name || 'Unknown User'}</p>
                  <p className="text-[11px] text-white/30">
                    Banned {new Date(banned.created_at).toLocaleDateString()}
                    {banned.reason && <span className="text-white/40 ml-2">- {banned.reason}</span>}
                  </p>
                </div>
                <button
                  onClick={() => handleUnbanUser(banned.id, banned.author_name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-800/50 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 transition-colors text-xs font-medium shrink-0"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Unban
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
