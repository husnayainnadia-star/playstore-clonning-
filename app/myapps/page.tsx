'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import BottomNav from '@/components/BottomNav';
import AppIcon from '@/components/AppIcon';
import Toast, { showToast } from '@/components/Toast';

interface InstalledApp {
  id: number; name: string; icon_emoji: string; icon_color: string;
  size_mb: number; installed_at: string; category: string;
}

const TABS = ['Updates', 'Installed', 'Library'];

export default function MyAppsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [installs, setInstalls] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstalls() {
      try {
        const res = await fetch('/api/installs');
        if (res.ok) {
          const data = await res.json();
          setInstalls(data.installs || []);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    fetchInstalls();
  }, []);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-white animate-in relative">
      <StatusBar />

      {/* App Bar */}
      <div className="flex items-center px-4 py-2 flex-shrink-0">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-[#F8F9FA]">
          <span className="material-icons-round text-[#202124]">arrow_back</span>
        </button>
        <h1 className="flex-1 text-[20px] font-medium text-[#202124] ml-2">My apps &amp; games</h1>
        <button className="p-2 rounded-full hover:bg-[#F8F9FA]">
          <span className="material-icons-round text-[#202124]">more_vert</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-[#E8EAED] flex-shrink-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="px-4 py-3 text-[14px] font-medium border-none bg-transparent cursor-pointer relative"
            style={{ color: activeTab === i ? '#1A73E8' : '#5F6368' }}
          >
            {tab}
            {activeTab === i && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1A73E8] rounded-t" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">

        {/* UPDATES tab */}
        {activeTab === 0 && (
          <>
            {/* Auto-update card */}
            <div className="mx-4 my-3 p-4 bg-[#E8F0FE] rounded-lg flex items-center gap-3">
              <span className="material-icons-round text-[24px] text-[#1A73E8]">verified_user</span>
              <p className="flex-1 text-[13px] text-[#202124] leading-relaxed">
                Turn on auto-updates<br />to keep your apps up to date
              </p>
              <button
                onClick={() => showToast('Auto-update enabled!')}
                className="text-[#1A73E8] font-medium text-[14px] border-none bg-transparent cursor-pointer"
              >
                Turn on
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[14px] font-medium text-[#202124]">
                Updates pending ({Math.max(0, 3 - installs.length)})
              </span>
              <button
                onClick={() => showToast('Updating all apps...')}
                className="bg-[#1A73E8] text-white rounded-full px-4 py-2 text-[13px] font-medium border-none cursor-pointer"
              >
                Update all
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-4 border-[#E8EAED] border-t-[#1A73E8] rounded-full animate-spin" />
              </div>
            ) : installs.length === 0 ? (
              <div className="text-center py-12 text-[#5F6368] text-[14px]">
                All apps are up to date ✓
              </div>
            ) : (
              installs.map(app => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 px-4 py-[10px] border-b border-[#E8EAED] cursor-pointer"
                  onClick={() => router.push(`/apps/${app.id}`)}
                >
                  <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={48} radius={12} />
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-[#202124]">{app.name}</div>
                    <div className="text-[12px] text-[#5F6368]">Updated {timeAgo(app.installed_at)}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); showToast(`Opening ${app.name}`); }}
                    className="border border-[#E8EAED] rounded-full px-5 py-2 text-[13px] text-[#202124] bg-white cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* INSTALLED tab */}
        {activeTab === 1 && (
          loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-[#E8EAED] border-t-[#1A73E8] rounded-full animate-spin" />
            </div>
          ) : installs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="material-icons-round text-[48px] text-[#9AA0A6]">apps</span>
              <p className="text-[14px] text-[#5F6368]">No installed apps yet</p>
              <button
                onClick={() => router.push('/home')}
                className="mt-2 bg-[#1A73E8] text-white rounded-full px-6 py-2 text-[14px] border-none cursor-pointer"
              >
                Explore apps
              </button>
            </div>
          ) : (
            installs.map(app => (
              <div
                key={app.id}
                className="flex items-center gap-3 px-4 py-[10px] border-b border-[#E8EAED] cursor-pointer"
                onClick={() => router.push(`/apps/${app.id}`)}
              >
                <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={48} radius={12} />
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-[#202124]">{app.name}</div>
                  <div className="text-[12px] text-[#5F6368]">{app.size_mb} MB · {app.category}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); showToast(`Opening ${app.name}`); }}
                  className="border border-[#E8EAED] rounded-full px-5 py-2 text-[13px] text-[#202124] bg-white cursor-pointer"
                >
                  Open
                </button>
              </div>
            ))
          )
        )}

        {/* LIBRARY tab */}
        {activeTab === 2 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-icons-round text-[48px] text-[#9AA0A6]">library_books</span>
            <p className="text-[14px] text-[#5F6368]">Your library is empty</p>
          </div>
        )}
      </div>

      <BottomNav active="Books" />
      <Toast />
    </div>
  );
}
