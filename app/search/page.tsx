'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import AppIcon from '@/components/AppIcon';
import Toast, { showToast } from '@/components/Toast';

interface App {
  id: number; name: string; developer: string;
  icon_emoji: string; icon_color: string;
  rating: number; category: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/apps?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.apps || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <div className="flex flex-col h-full min-h-screen bg-white animate-in relative">
      <StatusBar />

      {/* Search input bar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-[#E8EAED]">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-[#F8F9FA]">
          <span className="material-icons-round text-[#202124]">arrow_back</span>
        </button>
        <div className="flex-1 flex items-center bg-[#F8F9FA] rounded-full px-4 py-[10px] gap-2">
          <span className="material-icons-round text-[20px] text-[#5F6368]">search</span>
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#202124] placeholder:text-[#9AA0A6]"
            placeholder="Search apps & games"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="border-none bg-transparent cursor-pointer">
              <span className="material-icons-round text-[18px] text-[#5F6368]">close</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-4 border-[#E8EAED] border-t-[#1A73E8] rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="px-4">
            {results.map(app => (
              <div
                key={app.id}
                className="flex items-center gap-3 py-3 border-b border-[#E8EAED] cursor-pointer"
                onClick={() => router.push(`/apps/${app.id}`)}
              >
                <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={48} radius={12} />
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-[#202124]">{app.name}</div>
                  <div className="text-[12px] text-[#5F6368]">{app.developer}</div>
                  <div className="text-[12px] text-[#5F6368] flex items-center gap-1 mt-[2px]">
                    <span className="material-icons-round text-[10px] text-[#FBBC04]">star</span>
                    {app.rating} · {app.category}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); showToast(`Installing ${app.name}...`); }}
                  className="bg-[#E8F0FE] text-[#1A73E8] rounded-full px-5 py-2 text-[13px] font-medium border-none cursor-pointer"
                >
                  Install
                </button>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-icons-round text-[48px] text-[#9AA0A6]">search_off</span>
            <p className="text-[14px] text-[#5F6368]">No results for &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-icons-round text-[48px] text-[#9AA0A6]">search</span>
            <p className="text-[14px] text-[#5F6368]">Search for apps, games &amp; more</p>
          </div>
        )}
      </div>

      <Toast />
    </div>
  );
}
