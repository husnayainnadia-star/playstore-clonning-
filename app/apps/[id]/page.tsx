'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import AppIcon from '@/components/AppIcon';
import Toast, { showToast } from '@/components/Toast';

interface App {
  id: number; name: string; developer: string; description: string;
  icon_emoji: string; icon_color: string; category: string;
  rating: number; review_count: number; download_count: string;
  age_rating: string; size_mb: number; tags: string[];
}

const SCREENSHOT_COLORS = ['#1a1a2e','#16213e','#0f3460','#533483','#e94560'];
const SCREENSHOT_EMOJIS = ['🎬','📱','🎯','✨','🚀'];

export default function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [app, setApp] = useState<App | null>(null);
  const [installed, setInstalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [starRating, setStarRating] = useState(0);

  useEffect(() => {
    async function fetchApp() {
      try {
        const res = await fetch(`/api/apps/${id}`);
        const data = await res.json();
        setApp(data.app);

        // Check if installed
        const installsRes = await fetch('/api/installs');
        if (installsRes.ok) {
          const installsData = await installsRes.json();
          setInstalled(installsData.installs?.some((i: App) => i.id === data.app?.id));
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    fetchApp();
  }, [id]);

  async function handleInstall() {
    setInstalling(true);
    setProgress(0);

    // Animate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    // After animation, record install
    setTimeout(async () => {
      clearInterval(interval);
      setProgress(100);
      await fetch(`/api/apps/${id}/install`, { method: 'POST' });
      setInstalled(true);
      setInstalling(false);
      showToast(`${app?.name} installed!`);
    }, 2600);
  }

  async function handleUninstall() {
    await fetch(`/api/apps/${id}/install`, { method: 'DELETE' });
    setInstalled(false);
    showToast(`${app?.name} uninstalled`);
  }

  async function handleRate(rating: number) {
    setStarRating(rating);
    await fetch(`/api/apps/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    showToast(`You rated ${app?.name} ${rating} star${rating > 1 ? 's' : ''}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="w-8 h-8 border-4 border-[#E8EAED] border-t-[#1A73E8] rounded-full animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen gap-4">
        <span className="material-icons-round text-[48px] text-[#9AA0A6]">error_outline</span>
        <p className="text-[#5F6368]">App not found</p>
        <button onClick={() => router.back()} className="text-[#1A73E8]">Go back</button>
      </div>
    );
  }

  const circumference = 408;
  const offset = circumference - (circumference * progress / 100);

  return (
    <div className="flex flex-col min-h-screen bg-white animate-in relative">
      <StatusBar />

      {/* App Bar */}
      <div className="flex items-center px-4 py-2 flex-shrink-0">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-[#F8F9FA]">
          <span className="material-icons-round text-[#202124]">arrow_back</span>
        </button>
        <div className="flex-1" />
        <button className="p-2 rounded-full hover:bg-[#F8F9FA]">
          <span className="material-icons-round text-[#202124]">search</span>
        </button>
        <button className="p-2 rounded-full hover:bg-[#F8F9FA]">
          <span className="material-icons-round text-[#202124]">more_vert</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex gap-4 px-4 pb-3">
          <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={72} radius={18} />
          <div className="flex-1">
            <h2 className="text-[20px] font-medium text-[#202124]">{app.name}</h2>
            <div className="text-[#1A73E8] text-[13px] my-1">{app.developer}</div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[11px] text-[#5F6368] border border-[#E8EAED] rounded px-2 py-[2px]">Contains ads</span>
              <span className="text-[11px] text-[#5F6368] border border-[#E8EAED] rounded px-2 py-[2px]">In-app purchases</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex border-t border-b border-[#E8EAED] py-3">
          <div className="flex-1 flex flex-col items-center gap-[2px] border-r border-[#E8EAED]">
            <div className="text-[14px] font-medium text-[#202124] flex items-center gap-[2px]">
              {app.rating}
              <span className="material-icons-round text-[14px] text-[#FBBC04]">star</span>
            </div>
            <div className="text-[11px] text-[#5F6368]">
              {app.review_count > 1000000
                ? `${(app.review_count / 1000000).toFixed(0)}M reviews`
                : `${app.review_count.toLocaleString()} reviews`}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-[2px] border-r border-[#E8EAED]">
            <div className="text-[14px] font-medium text-[#202124]">{app.download_count}</div>
            <div className="text-[11px] text-[#5F6368]">Downloads</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-[2px]">
            <div className="text-[14px] font-medium text-[#202124] flex items-center gap-[2px]">
              <span className="material-icons-round text-[16px] text-[#5F6368]">info_outline</span>
              {app.age_rating}
            </div>
            <div className="text-[11px] text-[#5F6368]">Rated for</div>
          </div>
        </div>

        {/* Install / Download progress */}
        <div className="px-4 py-3">
          {installing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-24 h-24">
                <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="44" fill="none" stroke="#E8EAED" strokeWidth="6"/>
                  <circle
                    cx="48" cy="48" r="44" fill="none" stroke="#1A73E8" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="276"
                    strokeDashoffset={276 - (276 * progress / 100)}
                    style={{ transition: 'stroke-dashoffset .1s' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={48} radius={12} />
                </div>
              </div>
              <div className="text-[13px] text-[#5F6368]">{progress}% of {app.size_mb} MB</div>
              <div className="flex items-center gap-1 text-[12px] text-[#5F6368]">
                <span className="material-icons-round text-[14px] text-[#34A853]">verified_user</span>
                Verified by Play Protect
              </div>
              <button
                onClick={() => setInstalling(false)}
                className="border border-[#E8EAED] rounded-full px-6 py-2 text-[13px] text-[#202124] bg-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : installed ? (
            <div className="flex gap-3">
              <button
                onClick={() => showToast(`Opening ${app.name}`)}
                className="flex-1 py-3 bg-[#34A853] text-white rounded-lg font-semibold text-[15px] cursor-pointer border-none"
              >
                Open
              </button>
              <button
                onClick={handleUninstall}
                className="flex-1 py-3 bg-white text-[#1A73E8] rounded-lg font-semibold text-[15px] cursor-pointer border border-[#E8EAED]"
              >
                Uninstall
              </button>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="w-full py-[14px] bg-[#1A73E8] text-white rounded-lg font-semibold text-[15px] cursor-pointer border-none"
            >
              Install
            </button>
          )}
        </div>

        {/* Screenshots */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          {SCREENSHOT_COLORS.map((c, i) => (
            <div
              key={i}
              className="w-[140px] h-[240px] rounded-lg flex-shrink-0 flex items-center justify-center text-[48px] border border-[#E8EAED]"
              style={{ background: c }}
            >
              {SCREENSHOT_EMOJIS[i]}
            </div>
          ))}
        </div>

        {/* About */}
        <div className="px-4 pb-4 border-t border-[#E8EAED]">
          <div className="flex items-center justify-between py-3">
            <h3 className="text-[16px] font-medium text-[#202124]">About this app</h3>
            <span className="material-icons-round text-[20px] text-[#5F6368] cursor-pointer">chevron_right</span>
          </div>
          <p className="text-[13px] text-[#5F6368] leading-relaxed">{app.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {app.tags?.map(tag => (
              <span key={tag} className="bg-[#F8F9FA] rounded-full px-4 py-1 text-[12px] text-[#5F6368]">{tag}</span>
            ))}
          </div>
        </div>

        {/* Rating bars */}
        <div className="px-4 py-4 border-t border-[#E8EAED]">
          <div className="flex items-center gap-4 mb-3">
            <div className="text-[36px] font-light text-[#202124]">{app.rating}</div>
            <div className="flex-1">
              {[5,4,3,2,1].map(n => (
                <div key={n} className="flex items-center gap-2 mb-[2px]">
                  <span className="text-[12px] text-[#5F6368] w-3">{n}</span>
                  <div className="flex-1 h-[4px] bg-[#E8EAED] rounded-full">
                    <div
                      className="h-full bg-[#FBBC04] rounded-full"
                      style={{ width: `${n===5?70:n===4?20:n===3?6:n===2?3:1}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate this app */}
        {installed && (
          <div className="px-4 py-4 border-t border-[#E8EAED]">
            <h3 className="text-[15px] font-medium text-[#202124] mb-1">Rate this app</h3>
            <p className="text-[12px] text-[#5F6368] mb-3">Tell others what you think</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => handleRate(n)}
                  className="material-icons-round text-[32px] border-none bg-transparent cursor-pointer"
                  style={{ color: n <= starRating ? '#FBBC04' : '#9AA0A6' }}
                >
                  {n <= starRating ? 'star' : 'star_border'}
                </button>
              ))}
            </div>
            <span
              onClick={() => showToast('Opening review form')}
              className="text-[#1A73E8] text-[13px] cursor-pointer hover:underline block mt-3"
            >
              Write a review
            </span>
          </div>
        )}

        {/* App support */}
        <div
          className="flex items-center justify-between px-4 py-4 border-t border-[#E8EAED] cursor-pointer"
          onClick={() => showToast('App support')}
        >
          <span className="text-[15px] font-medium text-[#202124]">App support</span>
          <span className="material-icons-round text-[#5F6368]">keyboard_arrow_down</span>
        </div>
      </div>

      <Toast />
    </div>
  );
}
