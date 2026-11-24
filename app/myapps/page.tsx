'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import BottomNav from '@/components/BottomNav';
import AppIcon from '@/components/AppIcon';
import Toast, { showToast } from '@/components/Toast';

interface InstalledApp {
  id:number; name:string; icon_emoji:string; icon_color:string;
  size_mb:number; installed_at:string; category:string;
}

const TABS = ['Updates','Installed','Library'];

// Demo pending updates
const PENDING = [
  {id:4,name:'YouTube',    icon_emoji:'▶️',icon_color:'#FF0000',size_mb:28},
];

export default function MyAppsPage() {
  const router = useRouter();
  const [tab, setTab]       = useState(0);
  const [apps, setApps]     = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/installs');
        if (r.ok) { const d = await r.json(); setApps(d.installs||[]); }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  function ago(s:string) {
    const h = Math.floor((Date.now()-new Date(s).getTime())/3600000);
    return h<24 ? `${h}h ago` : `${Math.floor(h/24)}d ago`;
  }

  return (
    <div style={{display:'flex',flexDirection:'column',flex:1,background:'#fff',position:'relative'}} className="animate-in">
      <StatusBar />

      {/* App bar */}
      <div style={{display:'flex',alignItems:'center',padding:'4px 8px'}}>
        <button onClick={()=>router.back()} style={{background:'none',border:'none',cursor:'pointer',padding:8,borderRadius:20,display:'flex'}}>
          <span className="material-icons-round" style={{fontSize:22,color:'#202124'}}>arrow_back</span>
        </button>
        <h1 style={{flex:1,fontSize:20,fontWeight:400,color:'#202124',margin:'0 0 0 4px',fontFamily:'inherit'}}>My apps &amp; games</h1>
        <button style={{background:'none',border:'none',cursor:'pointer',padding:8,borderRadius:20,display:'flex'}}>
          <span className="material-icons-round" style={{fontSize:22,color:'#202124'}}>more_vert</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',borderBottom:'1px solid #E8EAED',padding:'0 16px',flexShrink:0}}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)}
            style={{padding:'11px 16px',fontSize:14,fontWeight:500,border:'none',background:'none',
              cursor:'pointer',color:tab===i?'#1A73E8':'#5F6368',fontFamily:'inherit',position:'relative'}}>
            {t}
            {tab===i && <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:'#1A73E8',borderRadius:'2px 2px 0 0'}}/>}
          </button>
        ))}
      </div>

      <div style={{flex:1,overflowY:'auto'}} className="no-scrollbar">

        {/* UPDATES */}
        {tab===0 && <>
          {/* Auto-update banner */}
          <div style={{margin:'12px 16px',padding:'12px 14px',background:'#E8F0FE',borderRadius:8,
            display:'flex',alignItems:'center',gap:12}}>
            <span className="material-icons-round" style={{fontSize:24,color:'#1A73E8',flexShrink:0}}>verified_user</span>
            <p style={{flex:1,fontSize:13,color:'#202124',lineHeight:1.5,margin:0}}>
              Turn on auto-updates<br/>to keep your apps up to date
            </p>
            <button onClick={()=>showToast('Auto-update enabled')}
              style={{background:'none',border:'none',color:'#1A73E8',fontWeight:500,fontSize:14,
                cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>Turn on</button>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 16px 6px'}}>
            <span style={{fontSize:14,fontWeight:500,color:'#202124'}}>Updates pending ({PENDING.length})</span>
            <button onClick={()=>showToast('Updating all...')}
              style={{background:'#1A73E8',color:'#fff',border:'none',borderRadius:20,
                padding:'8px 16px',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Update all</button>
          </div>

          {PENDING.map(a=>(
            <div key={a.id}
              style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',
                borderBottom:'1px solid #E8EAED',cursor:'pointer'}}
              onClick={()=>router.push(`/apps/${a.id}`)}>
              <AppIcon emoji={a.icon_emoji} color={a.icon_color} size={48} radius={12} appName={a.name}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,color:'#202124'}}>{a.name}</div>
                <div style={{fontSize:12,color:'#5F6368',display:'flex',alignItems:'center',gap:3}}>
                  {a.size_mb} MB
                  <span className="material-icons-round" style={{fontSize:14,color:'#5F6368'}}>keyboard_arrow_down</span>
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();showToast(`Updating ${a.name}...`);}}
                style={{background:'#1A73E8',color:'#fff',border:'none',borderRadius:20,
                  padding:'8px 20px',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Update</button>
            </div>
          ))}

          {/* Recently updated */}
          <div style={{padding:'12px 16px 6px',display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}
            onClick={()=>{}}>
            <span style={{fontSize:14,fontWeight:500,color:'#202124'}}>Recently updated</span>
            <span className="material-icons-round" style={{fontSize:18,color:'#5F6368'}}>keyboard_arrow_down</span>
          </div>

          {loading ? (
            <div style={{display:'flex',justifyContent:'center',padding:24}}>
              <div style={{width:24,height:24,border:'3px solid #E8EAED',borderTopColor:'#1A73E8',borderRadius:12}} className="spin"/>
            </div>
          ) : apps.length===0 ? (
            <div style={{textAlign:'center',padding:24,color:'#5F6368',fontSize:14}}>No recently updated apps</div>
          ) : apps.map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',
              borderBottom:'1px solid #E8EAED',cursor:'pointer'}}
              onClick={()=>router.push(`/apps/${a.id}`)}>
              <AppIcon emoji={a.icon_emoji} color={a.icon_color} size={48} radius={12} appName={a.name}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,color:'#202124'}}>{a.name}</div>
                <div style={{fontSize:12,color:'#5F6368'}}>Updated {ago(a.installed_at)}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();showToast(`Opening ${a.name}`);}}
                style={{border:'1.5px solid #DADCE0',borderRadius:20,padding:'7px 20px',fontSize:13,
                  color:'#202124',background:'#fff',cursor:'pointer',fontFamily:'inherit'}}>Open</button>
            </div>
          ))}
        </>}

        {/* INSTALLED */}
        {tab===1 && (
          loading ? (
            <div style={{display:'flex',justifyContent:'center',padding:32}}>
              <div style={{width:24,height:24,border:'3px solid #E8EAED',borderTopColor:'#1A73E8',borderRadius:12}} className="spin"/>
            </div>
          ) : apps.length===0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:64,gap:12}}>
              <span className="material-icons-round" style={{fontSize:48,color:'#9AA0A6'}}>apps</span>
              <p style={{fontSize:14,color:'#5F6368',margin:0}}>No installed apps yet</p>
              <button onClick={()=>router.push('/home')}
                style={{marginTop:8,background:'#1A73E8',color:'#fff',border:'none',borderRadius:20,
                  padding:'10px 24px',fontSize:14,cursor:'pointer',fontFamily:'inherit'}}>Explore apps</button>
            </div>
          ) : apps.map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',
              borderBottom:'1px solid #E8EAED',cursor:'pointer'}}
              onClick={()=>router.push(`/apps/${a.id}`)}>
              <AppIcon emoji={a.icon_emoji} color={a.icon_color} size={48} radius={12} appName={a.name}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,color:'#202124'}}>{a.name}</div>
                <div style={{fontSize:12,color:'#5F6368'}}>{a.size_mb} MB · {a.category}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();showToast(`Opening ${a.name}`);}}
                style={{border:'1.5px solid #DADCE0',borderRadius:20,padding:'7px 20px',fontSize:13,
                  color:'#202124',background:'#fff',cursor:'pointer',fontFamily:'inherit'}}>Open</button>
            </div>
          ))
        )}

        {/* LIBRARY */}
        {tab===2 && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:64,gap:12}}>
            <span className="material-icons-round" style={{fontSize:48,color:'#9AA0A6'}}>library_books</span>
            <p style={{fontSize:14,color:'#5F6368',margin:0}}>Your library is empty</p>
          </div>
        )}

      </div>

      <BottomNav active="Books" />
      <Toast />
    </div>
  );
}
