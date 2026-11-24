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
  id:number; name:string; developer:string; description:string;
  icon_emoji:string; icon_color:string; category:string;
  rating:number; review_count:number; download_count:string;
  age_rating:string; size_mb:number; tags:string[]; is_featured:boolean;
}

const TABS = ['For you','Top charts','Kids','Categories'];
const CATS = [
  {name:'Action',    color:'#EA4335', icon:'sports_esports'},
  {name:'Puzzle',    color:'#1A73E8', icon:'extension'},
  {name:'Education', color:'#34A853', icon:'school'},
  {name:'Music',     color:'#FBBC04', icon:'music_note'},
  {name:'Social',    color:'#AB47BC', icon:'people'},
  {name:'Tools',     color:'#00897B', icon:'build'},
  {name:'Travel',    color:'#F4511E', icon:'flight'},
  {name:'Sports',    color:'#039BE5', icon:'sports_soccer'},
  {name:'Food',      color:'#E91E63', icon:'restaurant'},
  {name:'Finance',   color:'#43A047', icon:'account_balance'},
];

// Fallback demo apps if DB not ready
const DEMO: App[] = [
  {id:1,name:'TikTok',    developer:'TikTok Pte. Ltd.',  description:'Discover videos you love.',icon_emoji:'🎵',icon_color:'#010101',category:'Social',      rating:4.1,review_count:62000000,download_count:'1B+', age_rating:'12+',size_mb:28, tags:['Social','Video'],      is_featured:true},
  {id:2,name:'Instagram', developer:'Meta Platforms',    description:'Share photos & stories.',  icon_emoji:'📸',icon_color:'#C13584',category:'Social',      rating:4.3,review_count:50000000,download_count:'5B+', age_rating:'13+',size_mb:45, tags:['Social','Photo'],      is_featured:true},
  {id:3,name:'WhatsApp',  developer:'WhatsApp LLC',      description:'Simple. Secure. Messaging.',icon_emoji:'💬',icon_color:'#25D366',category:'Communication',rating:4.3,review_count:80000000,download_count:'5B+', age_rating:'4+', size_mb:36, tags:['Messaging'],           is_featured:true},
  {id:4,name:'YouTube',   developer:'Google LLC',        description:'Watch videos anywhere.',   icon_emoji:'▶️',icon_color:'#FF0000',category:'Video',       rating:4.2,review_count:71000000,download_count:'10B+',age_rating:'4+', size_mb:28, tags:['Video','Music'],        is_featured:false},
  {id:5,name:'Maps',      developer:'Google LLC',        description:'GPS & navigation.',        icon_emoji:'🗺️',icon_color:'#4285F4',category:'Travel',      rating:4.4,review_count:45000000,download_count:'10B+',age_rating:'4+', size_mb:15, tags:['Navigation'],          is_featured:false},
  {id:6,name:'Spotify',   developer:'Spotify AB',        description:'Music & podcasts.',        icon_emoji:'🎧',icon_color:'#1DB954',category:'Music',       rating:4.3,review_count:30000000,download_count:'1B+', age_rating:'4+', size_mb:50, tags:['Music','Podcast'],      is_featured:false},
  {id:7,name:'Netflix',   developer:'Netflix Inc.',      description:'Watch TV shows & movies.', icon_emoji:'🎬',icon_color:'#E50914',category:'Entertainment',rating:4.1,review_count:28000000,download_count:'1B+', age_rating:'12+',size_mb:70, tags:['Video','Movies'],       is_featured:false},
  {id:8,name:'Snapchat',  developer:'Snap Inc.',         description:'Chat and Snap.',           icon_emoji:'👻',icon_color:'#FFFC00',category:'Social',      rating:4.0,review_count:20000000,download_count:'1B+', age_rating:'13+',size_mb:55, tags:['Social','Messaging'],  is_featured:false},
];

function formatCount(n: number) {
  if (n >= 1e9) return (n/1e9).toFixed(0)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(0)+'M';
  return n.toLocaleString();
}

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [apps, setApps] = useState<App[]>(DEMO);
  const [user, setUser] = useState<{name:string;email:string}|null>(null);
  const [drawer, setDrawer] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/apps'); if (!r.ok) return;
      const d = await r.json(); if (d.apps?.length) setApps(d.apps);
    } catch {}
    try {
      const r = await fetch('/api/auth/me'); if (!r.ok) return;
      const d = await r.json(); if (d.user) setUser(d.user);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const initials = user?.name?.split(' ').map((w:string)=>w[0]).join('').slice(0,2).toUpperCase() || 'N';

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:'#fff', position:'relative' }} className="animate-in">
      <StatusBar />

      {/* Search bar */}
      <div style={{ padding:'4px 16px 8px' }}>
        <div onClick={() => router.push('/search')}
          style={{ display:'flex', alignItems:'center', background:'#F1F3F4', borderRadius:24,
            padding:'10px 16px', gap:10, cursor:'pointer' }}>
          <span className="material-icons-round" style={{ fontSize:20, color:'#5F6368' }}>search</span>
          <span style={{ flex:1, fontSize:14, color:'#5F6368' }}>Search apps &amp; games</span>
          <div onClick={e=>{e.stopPropagation();setDrawer(true)}}
            style={{ width:32, height:32, borderRadius:16, background:'linear-gradient(135deg,#667eea,#764ba2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
            {initials}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid #E8EAED', flexShrink:0 }}>
        {TABS.map((t,i) => (
          <button key={t} onClick={()=>setTab(i)}
            style={{ flex:1, padding:'11px 4px', fontSize:13, fontWeight:500, border:'none',
              background:'none', cursor:'pointer', color: tab===i?'#1A73E8':'#5F6368',
              position:'relative', fontFamily:'inherit' }}>
            {t}
            {tab===i && <div style={{ position:'absolute', bottom:0, left:0, right:0,
              height:3, background:'#1A73E8', borderRadius:'2px 2px 0 0' }} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto' }} className="no-scrollbar">

        {/* ── FOR YOU ── */}
        {tab===0 && <>
          {/* Banner */}
          <div style={{ margin:'12px 16px', borderRadius:12, overflow:'hidden',
            background:'linear-gradient(135deg,#1565C0 0%,#1976D2 50%,#42A5F5 100%)',
            padding:'20px 20px', position:'relative', minHeight:144, display:'flex', alignItems:'center' }}>
            <div style={{ color:'#fff', zIndex:1 }}>
              <div style={{ fontSize:21, fontWeight:700, lineHeight:1.2, marginBottom:4 }}>New look.<br/>Same great apps.</div>
              <div style={{ fontSize:12, opacity:.85, marginBottom:14 }}>Explore what's new on Google Play</div>
              <button style={{ background:'#fff', color:'#1A73E8', border:'none', borderRadius:20,
                padding:'8px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Explore
              </button>
            </div>
            <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', opacity:.9 }}>
              <PlayLogo size={68} />
            </div>
          </div>

          {/* Recommended */}
          <SectionHeader title="Recommended for you" onMore={() => setTab(1)} />
          <div style={{ display:'flex', overflowX:'auto', padding:'0 8px 4px' }} className="no-scrollbar">
            {apps.slice(0,6).map(a => (
              <AppCard key={a.id} app={a} onClick={() => router.push(`/apps/${a.id}`)} />
            ))}
          </div>

          {/* Top charts preview */}
          <SectionHeader title="Top charts" onMore={() => setTab(1)} />
          <div style={{ padding:'0 16px' }}>
            {apps.slice(0,3).map((a,i) => (
              <ChartRow key={a.id} app={a} rank={i+1}
                onClick={() => router.push(`/apps/${a.id}`)}
                onInstall={() => showToast(`Installing ${a.name}...`)} />
            ))}
          </div>

          {/* Top games row */}
          <SectionHeader title="Top free games" onMore={() => {}} />
          <div style={{ display:'flex', overflowX:'auto', padding:'0 8px 12px' }} className="no-scrollbar">
            {apps.slice(3,8).map(a => (
              <AppCard key={a.id} app={a} onClick={() => router.push(`/apps/${a.id}`)} />
            ))}
          </div>
        </>}

        {/* ── TOP CHARTS ── */}
        {tab===1 && (
          <div style={{ padding:'0 16px' }}>
            {apps.map((a,i) => (
              <ChartRow key={a.id} app={a} rank={i+1}
                onClick={() => router.push(`/apps/${a.id}`)}
                onInstall={() => showToast(`Installing ${a.name}...`)} />
            ))}
          </div>
        )}

        {/* ── KIDS ── */}
        {tab===2 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 24px', gap:12 }}>
            <span className="material-icons-round" style={{ fontSize:64, color:'#FBBC04' }}>child_care</span>
            <div style={{ fontSize:20, fontWeight:500, color:'#202124' }}>Kids section</div>
            <div style={{ fontSize:14, color:'#5F6368', textAlign:'center' }}>Safe apps and games curated for children</div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {tab===3 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, padding:16 }}>
            {CATS.map(c => (
              <div key={c.name} onClick={() => showToast(c.name)}
                style={{ background:c.color, borderRadius:12, padding:'18px 16px',
                  display:'flex', alignItems:'center', gap:10, cursor:'pointer', color:'#fff' }}>
                <span className="material-icons-round" style={{ fontSize:26 }}>{c.icon}</span>
                <span style={{ fontWeight:500, fontSize:14 }}>{c.name}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      <BottomNav active="Apps" />
      <Toast />

      {/* ── Profile drawer ── */}
      {drawer && (
        <div style={{ position:'absolute', inset:0, zIndex:50 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)' }}
            onClick={() => setDrawer(false)} />
          <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'82%',
            background:'#fff', display:'flex', flexDirection:'column' }} className="slide-in">
            <StatusBar />
            {/* Drawer header */}
            <div style={{ background:'#F8F9FA', borderBottom:'1px solid #E8EAED', padding:'16px 20px 14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:22, flexShrink:0,
                  background:'linear-gradient(135deg,#667eea,#764ba2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', fontSize:17, fontWeight:600 }}>
                  {initials}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:500, color:'#202124' }}>{user?.name || 'Nadia Husnayain'}</div>
                  <div style={{ fontSize:13, color:'#5F6368' }}>{user?.email || 'nadia@gmail.com'}</div>
                </div>
                <span className="material-icons-round" style={{ fontSize:20, color:'#5F6368' }}>keyboard_arrow_down</span>
              </div>
              <button style={{ border:'1px solid #DADCE0', borderRadius:20, padding:'8px 16px',
                fontSize:13, background:'#fff', cursor:'pointer', fontFamily:'inherit', color:'#202124' }}
                onClick={() => showToast('Opening Google Account')}>
                Manage your Google Account
              </button>
            </div>

            {/* Menu */}
            <div style={{ flex:1, overflowY:'auto' }} className="no-scrollbar">
              <DrawerItem icon="military_tech" label="Play Points" extra="✦ 1,250" extraColor="#FBBC04" />
              <div style={{ height:1, background:'#E8EAED', margin:'4px 0' }} />
              <DrawerItem icon="settings"        label="Settings" />
              <DrawerItem icon="help_outline"     label="Help & feedback" />
              <DrawerItem icon="get_app"          label="Downloads" onClick={() => { setDrawer(false); router.push('/myapps'); }} />
              <DrawerItem icon="bookmark_border"  label="Wishlist" />
              <DrawerItem icon="verified_user"    label="Play Protect" />
              <div style={{ height:1, background:'#E8EAED', margin:'4px 0' }} />
              <DrawerItem icon="info_outline"     label="About Google Play" />
              <DrawerItem icon="logout"           label="Sign out"
                onClick={async () => { await fetch('/api/auth/logout',{method:'POST'}); router.push('/signin'); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, onMore }: { title:string; onMore:()=>void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 6px' }}>
      <span style={{ fontSize:16, fontWeight:500, color:'#202124' }}>{title}</span>
      <span onClick={onMore} style={{ color:'#1A73E8', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center' }}>
        More <span className="material-icons-round" style={{ fontSize:16 }}>chevron_right</span>
      </span>
    </div>
  );
}

function AppCard({ app, onClick }: { app:App; onClick:()=>void }) {
  return (
    <div onClick={onClick}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'8px 10px',
        cursor:'pointer', borderRadius:8, minWidth:88, flexShrink:0 }}>
      <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={56} appName={app.name} />
      <span style={{ fontSize:12, color:'#202124', textAlign:'center', lineHeight:1.3,
        maxWidth:76, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {app.name}
      </span>
      <span style={{ fontSize:11, color:'#5F6368', display:'flex', alignItems:'center', gap:2 }}>
        <span className="material-icons-round" style={{ fontSize:11, color:'#FBBC04' }}>star</span>
        {app.rating}
      </span>
    </div>
  );
}

function ChartRow({ app, rank, onClick, onInstall }:
  { app:App; rank:number; onClick:()=>void; onInstall:()=>void }) {
  return (
    <div onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0',
        borderBottom:'1px solid #E8EAED', cursor:'pointer' }}>
      <span style={{ fontSize:14, fontWeight:500, color:'#5F6368', minWidth:22, textAlign:'right' }}>{rank}</span>
      <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={46} appName={app.name} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:500, color:'#202124', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.name}</div>
        <div style={{ fontSize:12, color:'#5F6368', display:'flex', alignItems:'center', gap:3 }}>
          <span className="material-icons-round" style={{ fontSize:11, color:'#FBBC04' }}>star</span>
          {app.rating} · {app.category}
        </div>
      </div>
      <button onClick={e=>{e.stopPropagation();onInstall();}}
        style={{ background:'#E8F0FE', color:'#1A73E8', border:'none', borderRadius:20,
          padding:'8px 20px', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>
        Install
      </button>
    </div>
  );
}

function DrawerItem({ icon, label, extra, extraColor, onClick }:
  { icon:string; label:string; extra?:string; extraColor?:string; onClick?:()=>void }) {
  return (
    <button onClick={onClick ?? (() => showToast(label))}
      style={{ display:'flex', alignItems:'center', gap:16, padding:'13px 20px', width:'100%',
        border:'none', background:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
      <span className="material-icons-round" style={{ fontSize:22, color:'#5F6368' }}>{icon}</span>
      <span style={{ flex:1, fontSize:14, color:'#202124' }}>{label}</span>
      {extra && <span style={{ fontSize:14, fontWeight:600, color: extraColor||'#202124' }}>{extra}</span>}
    </button>
  );
}
