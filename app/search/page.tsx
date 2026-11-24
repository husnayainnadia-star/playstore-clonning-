'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import AppIcon from '@/components/AppIcon';
import Toast, { showToast } from '@/components/Toast';

interface App { id:number; name:string; developer:string; icon_emoji:string; icon_color:string; rating:number; category:string; }

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ]            = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (v: string) => {
    if (!v.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/apps?search=${encodeURIComponent(v)}`);
      const d = await r.json();
      setResults(d.apps || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(q), 350);
    return () => clearTimeout(t);
  }, [q, search]);

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:'#fff', position:'relative' }} className="animate-in">
      <StatusBar />

      {/* Search input bar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 12px 8px', borderBottom:'1px solid #E8EAED' }}>
        <button onClick={() => router.back()}
          style={{ background:'none', border:'none', cursor:'pointer', padding:8, borderRadius:20, display:'flex' }}>
          <span className="material-icons-round" style={{ fontSize:22, color:'#202124' }}>arrow_back</span>
        </button>
        <div style={{ flex:1, display:'flex', alignItems:'center', background:'#F1F3F4',
          borderRadius:24, padding:'9px 14px', gap:8 }}>
          <span className="material-icons-round" style={{ fontSize:20, color:'#5F6368' }}>search</span>
          <input
            autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search apps &amp; games"
            style={{ flex:1, background:'none', border:'none', outline:'none',
              fontSize:14, color:'#202124', fontFamily:'inherit' }}
          />
          {q && (
            <button onClick={() => setQ('')}
              style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:0 }}>
              <span className="material-icons-round" style={{ fontSize:18, color:'#5F6368' }}>close</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto' }} className="no-scrollbar">
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
            <div style={{ width:28, height:28, border:'3px solid #E8EAED',
              borderTopColor:'#1A73E8', borderRadius:14 }} className="spin" />
          </div>
        ) : results.length > 0 ? (
          <div style={{ padding:'0 16px' }}>
            {results.map(a => (
              <div key={a.id} onClick={() => router.push(`/apps/${a.id}`)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0',
                  borderBottom:'1px solid #E8EAED', cursor:'pointer' }}>
                <AppIcon emoji={a.icon_emoji} color={a.icon_color} size={50} radius={12} appName={a.name} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:500, color:'#202124',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</div>
                  <div style={{ fontSize:12, color:'#5F6368',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.developer}</div>
                  <div style={{ fontSize:12, color:'#5F6368', display:'flex', alignItems:'center', gap:3, marginTop:1 }}>
                    <span className="material-icons-round" style={{ fontSize:11, color:'#FBBC04' }}>star</span>
                    {a.rating} · {a.category}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); showToast(`Installing ${a.name}...`); }}
                  style={{ background:'#E8F0FE', color:'#1A73E8', border:'none', borderRadius:20,
                    padding:'8px 20px', fontSize:13, fontWeight:500, cursor:'pointer',
                    fontFamily:'inherit', flexShrink:0 }}>
                  Install
                </button>
              </div>
            ))}
          </div>
        ) : q ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', padding:'64px 24px', gap:12 }}>
            <span className="material-icons-round" style={{ fontSize:48, color:'#9AA0A6' }}>search_off</span>
            <p style={{ fontSize:14, color:'#5F6368', margin:0, textAlign:'center' }}>
              No results for &ldquo;{q}&rdquo;
            </p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', padding:'64px 24px', gap:12 }}>
            <span className="material-icons-round" style={{ fontSize:48, color:'#9AA0A6' }}>search</span>
            <p style={{ fontSize:14, color:'#5F6368', margin:0 }}>Search for apps, games &amp; more</p>
          </div>
        )}
      </div>
      <Toast />
    </div>
  );
}
