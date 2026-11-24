'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import BottomNav from '@/components/BottomNav';
import AppIcon from '@/components/AppIcon';
import Toast, { showToast } from '@/components/Toast';
import PlayLogo from '@/components/PlayLogo';

interface App {
  id: number; name: string; developer: string; description: string;
  icon_emoji: string; icon_color: string; category: string;
  rating: number; review_count: number; download_count: string;
  age_rating: string; size_mb: number; tags: string[]; is_featured: boolean;
}

const TABS = ['For you', 'Top charts', 'Kids', 'Categories'];
const CATEGORIES = [
  { name: 'Action',      color: '#EA4335', icon: 'sports_esports' },
  { name: 'Puzzle',      color: '#1A73E8', icon: 'extension' },
  { name: 'Education',   color: '#34A853', icon: 'school' },
  { name: 'Music',       color: '#FBBC04', icon: 'music_note' },
  { name: 'Social',      color: '#AB47BC', icon: 'people' },
  { name: 'Tools',       color: '#00897B', icon: 'build' },
  { name: 'Travel',      color: '#F4511E', icon: 'flight' },
  { name: 'Sports',      color: '#039BE5', icon: 'sports_soccer' },
  { name: 'Food',        color: '#E91E63', icon: 'restaurant' },
  { name: 'Finance',     color: '#43A047', icon: 'account_balance' },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [apps, setApps] = useState<App[]>([]);
  const [featured, setFeatured] = useState<App[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [playPoints] = useState(1250);

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      setApps(data.apps || []);
      setFeatured((data.apps || []).filter((a: App) => a.is_featured));
    } catch {
      // fallback: will use empty array
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch { /* not logged in */ }
  }, []);

  useEffect(() => {
    fetchApps();
    fetchUser();
  }, [fetchApps, fetchUser]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/signin');
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'N';

  return (
    <div className="flex flex-col h-full min-h-screen bg-white animate-in relative">
      <StatusBar />

      {/* Search Bar */}
      <div
        className="flex items-center bg-[#F8F9FA] rounded-full mx-4 my-2 px-4 py-[10px] gap-2 cursor-pointer flex-shrink-0"
        onClick={() => router.push('/search')}
      >
        <span className="material-icons-round text-[20px] text-[#5F6368]">search</span>
        <span className="flex-1 text-[14px] text-[#5F6368]">Search apps &amp; games</span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}
          onClick={e => { e.stopPropagation(); setShowProfile(true); }}
        >
          {initials}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-[#E8EAED] flex-shrink-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="flex-1 py-3 text-[13px] font-medium border-none bg-transparent cursor-pointer relative"
            style={{ color: activeTab === i ? '#1A73E8' : '#5F6368' }}
          >
            {tab}
            {activeTab === i && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1A73E8] rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">

        {/* FOR YOU */}
        {activeTab === 0 && (
          <>
            {/* Banner */}
            <div
              className="mx-4 mt-4 rounded-xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#1565C0,#42A5F5)', minHeight: 150 }}
            >
              <div className="text-white">
                <h2 className="text-[22px] font-bold leading-tight">New look.<br/>Same great apps.</h2>
                <p className="text-[13px] mt-1 mb-4 opacity-85">Explore what&apos;s new on Google Play</p>
                <button className="bg-white text-[#1A73E8] px-5 py-2 rounded-full text-[13px] font-semibold">Explore</button>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90">
                <PlayLogo size={72} />
              </div>
            </div>

            {/* Recommended */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-[16px] font-medium text-[#202124]">Recommended for you</h3>
              <span className="text-[#1A73E8] text-[13px] flex items-center cursor-pointer">
                More <span className="material-icons-round text-[16px]">chevron_right</span>
              </span>
            </div>
            <div className="flex gap-0 px-2 overflow-x-auto no-scrollbar">
              {apps.slice(0, 6).map(a => (
                <div
                  key={a.id}
                  className="flex flex-col items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-[#F8F9FA] min-w-[90px] flex-shrink-0"
                  onClick={() => router.push(`/apps/${a.id}`)}
                >
                  <AppIcon emoji={a.icon_emoji} color={a.icon_color} size={56} />
                  <span className="text-[12px] text-[#202124] text-center leading-tight">{a.name}</span>
                  <span className="text-[11px] text-[#5F6368] flex items-center gap-[2px]">
                    <span className="material-icons-round text-[10px] text-[#FBBC04]">star</span>
                    {a.rating}
                  </span>
                </div>
              ))}
            </div>

            {/* Top charts preview */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-[16px] font-medium text-[#202124]">Top charts</h3>
              <span className="text-[#1A73E8] text-[13px] flex items-center cursor-pointer" onClick={() => setActiveTab(1)}>
                More <span className="material-icons-round text-[16px]">chevron_right</span>
              </span>
            </div>
            <div className="px-4">
              {apps.slice(0, 3).map((a, i) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 py-[10px] border-b border-[#E8EAED] cursor-pointer"
                  onClick={() => router.push(`/apps/${a.id}`)}
                >
                  <span className="text-[15px] font-medium text-[#5F6368] min-w-[20px]">{i + 1}</span>
                  <AppIcon emoji={a.icon_emoji} color={a.icon_color} size={44} />
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-[#202124]">{a.name}</div>
                    <div className="text-[12px] text-[#5F6368] flex items-center gap-1">
                      <span className="material-icons-round text-[10px] text-[#FBBC04]">star</span>
                      {a.rating} · {a.category}
                    </div>
                  </div>
                  <button
                    className="bg-[#E8F0FE] text-[#1A73E8] rounded-full px-5 py-2 text-[13px] font-medium border-none cursor-pointer"
                    onClick={e => { e.stopPropagation(); showToast(`Installing ${a.name}...`); }}
                  >
                    Install
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TOP CHARTS */}
        {activeTab === 1 && (
          <div className="px-4">
            {apps.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center gap-3 py-[10px] border-b border-[#E8EAED] cursor-pointer"
                onClick={() => router.push(`/apps/${a.id}`)}
              >
                <span className="text-[15px] font-medium text-[#5F6368] min-w-[24px]">{i + 1}</span>
                <AppIcon emoji={a.icon_emoji} color={a.icon_color} size={48} />
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-[#202124]">{a.name}</div>
                  <div className="text-[12px] text-[#5F6368]">{a.developer}</div>
                  <div className="text-[12px] text-[#5F6368] flex items-center gap-1 mt-[2px]">
                    <span className="material-icons-round text-[10px] text-[#FBBC04]">star</span>
                    {a.rating} · {a.category}
                  </div>
                </div>
                <button
                  className="bg-[#E8F0FE] text-[#1A73E8] rounded-full px-5 py-2 text-[13px] font-medium border-none cursor-pointer"
                  onClick={e => { e.stopPropagation(); showToast(`Installing ${a.name}...`); }}
                >
                  Install
                </button>
              </div>
            ))}
          </div>
        )}

        {/* KIDS */}
        {activeTab === 2 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <span className="material-icons-round text-[64px] text-[#FBBC04]">child_care</span>
            <h3 className="text-[20px] font-medium text-[#202124]">Kids section</h3>
            <p className="text-[14px] text-[#5F6368]">Safe apps and games for children</p>
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === 3 && (
          <div className="grid grid-cols-2 gap-3 p-4">
            {CATEGORIES.map(cat => (
              <div
                key={cat.name}
                onClick={() => showToast(`${cat.name} category`)}
                className="flex items-center gap-3 p-5 rounded-xl cursor-pointer text-white"
                style={{ background: cat.color }}
              >
                <span className="material-icons-round text-[28px]">{cat.icon}</span>
                <span className="font-medium text-[14px]">{cat.name}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      <BottomNav active="Apps" />
      <Toast />

      {/* Profile Drawer */}
      {showProfile && (
        <div
          className="absolute inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowProfile(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[85%] bg-white flex flex-col"
            style={{ animation: 'fadeSlideIn .2s ease' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="bg-[#F8F9FA] border-b border-[#E8EAED] px-5 pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[18px] font-semibold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}
                >
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="text-[16px] font-medium text-[#202124]">{user?.name || 'Guest User'}</div>
                  <div className="text-[13px] text-[#5F6368]">{user?.email || ''}</div>
                </div>
                <span className="material-icons-round text-[#5F6368]">keyboard_arrow_down</span>
              </div>
              <button className="border border-[#E8EAED] rounded-full px-4 py-2 text-[13px] text-[#202124] bg-white cursor-pointer">
                Manage your Google Account
              </button>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto">
              {[
                { icon: 'military_tech', label: 'Play Points', extra: `✦ ${playPoints.toLocaleString()}`, extraColor: '#FBBC04' },
                null,
                { icon: 'settings',      label: 'Settings' },
                { icon: 'help_outline',  label: 'Help & feedback' },
                { icon: 'get_app',       label: 'Downloads', action: () => { setShowProfile(false); router.push('/myapps'); } },
                { icon: 'bookmark_border', label: 'Wishlist' },
                { icon: 'verified_user', label: 'Play Protect' },
                null,
                { icon: 'info_outline',  label: 'About Google Play' },
                { icon: 'logout',        label: 'Sign out', action: handleLogout },
              ].map((item, i) =>
                item === null
                  ? <div key={i} className="h-px bg-[#E8EAED] my-1" />
                  : (
                    <button
                      key={i}
                      onClick={item.action ?? (() => showToast(item.label))}
                      className="flex items-center gap-4 px-5 py-[14px] w-full border-none bg-transparent text-left cursor-pointer hover:bg-[#F8F9FA]"
                    >
                      <span className="material-icons-round text-[22px] text-[#5F6368]">{item.icon}</span>
                      <span className="flex-1 text-[14px] text-[#202124]">{item.label}</span>
                      {item.extra && (
                        <span className="text-[14px] font-semibold flex items-center gap-1" style={{ color: item.extraColor }}>
                          {item.extra}
                        </span>
                      )}
                    </button>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
