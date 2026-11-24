'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import AppIcon from '@/components/AppIcon';
import Toast, { showToast } from '@/components/Toast';

interface App {
  id:number; name:string; developer:string; description:string;
  icon_emoji:string; icon_color:string; category:string;
  rating:number; review_count:number; download_count:string;
  age_rating:string; size_mb:number; tags:string[];
}

const SS_COLORS = ['#0d1117','#161b22','#1c2128','#21262d','#30363d'];

export default function DetailPage({ params }: { params: Promise<{id:string}> }) {
  const router = useRouter();
  const { id } = use(params);
  const [app, setApp] = useState<App|null>(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/apps/${id}`); if (!r.ok) return;
        const d = await r.json(); setApp(d.app);
        const ir = await fetch('/api/installs'); if (!ir.ok) return;
        const id2 = await ir.json();
        setInstalled(id2.installs?.some((x:App) => x.id === d.app?.id));
      } catch {}
      finally { setLoading(false); }
    })();
  }, [id]);

  function doInstall() {
    setInstalling(true); setProgress(0);
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(t); return 100; }
        return p + 1.4;
      });
    }, 40);
    setTimeout(async () => {
      clearInterval(t); setProgress(100);
      await fetch(`/api/apps/${id}/install`, {method:'POST'});
      setInstalled(true); setInstalling(false);
      showToast(`${app?.name} installed!`);
    }, 3000);
  }

  async function doUninstall() {
    await fetch(`/api/apps/${id}/install`, {method:'DELETE'});
    setInstalled(false); showToast(`${app?.name} uninstalled`);
  }

  async function rateStar(n:number) {
    setStars(n);
    await fetch(`/api/apps/${id}/review`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({rating:n}),
    });
    showToast(`Rated ${n} ★`);
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',flex:1}}>
      <div style={{width:32,height:32,border:'3px solid #E8EAED',borderTopColor:'#1A73E8',borderRadius:16}} className="spin"/>
    </div>
  );
  if (!app) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flex:1,gap:12}}>
      <span className="material-icons-round" style={{fontSize:48,color:'#9AA0A6'}}>error_outline</span>
      <span style={{color:'#5F6368'}}>App not found</span>
      <button onClick={()=>router.back()} style={{color:'#1A73E8',background:'none',border:'none',cursor:'pointer',fontSize:14}}>Go back</button>
    </div>
  );

  const circ = 2 * Math.PI * 44; // r=44
  const offset = circ - (circ * Math.min(progress,100) / 100);

  return (
    <div style={{display:'flex',flexDirection:'column',flex:1,background:'#fff',position:'relative'}} className="animate-in">
      <StatusBar />

      {/* App bar */}
      <div style={{display:'flex',alignItems:'center',padding:'4px 8px'}}>
        <Btn icon="arrow_back" onClick={()=>router.back()} />
        <div style={{flex:1}}/>
        <Btn icon="search" onClick={()=>router.push('/search')} />
        <Btn icon="more_vert" onClick={()=>showToast('More options')} />
      </div>

      <div style={{flex:1,overflowY:'auto'}} className="no-scrollbar">

        {/* Header: icon + name */}
        <div style={{display:'flex',gap:14,padding:'8px 16px 12px'}}>
          <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={76} radius={16} />
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:21,fontWeight:500,color:'#202124',lineHeight:1.2}}>{app.name}</div>
            <div style={{color:'#1A73E8',fontSize:13,margin:'5px 0 6px'}}>{app.developer}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              <Chip>Contains ads</Chip>
              <Chip>In-app purchases</Chip>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:'flex',borderTop:'1px solid #E8EAED',borderBottom:'1px solid #E8EAED',padding:'10px 0'}}>
          <StatCol label={`${formatCount(app.review_count)} reviews`}>
            <span style={{display:'flex',alignItems:'center',gap:1,fontSize:14,fontWeight:500,color:'#202124'}}>
              {app.rating}<span className="material-icons-round" style={{fontSize:14,color:'#FBBC04'}}>star</span>
            </span>
          </StatCol>
          <div style={{width:1,background:'#E8EAED'}}/>
          <StatCol label="Downloads">
            <span style={{fontSize:14,fontWeight:500,color:'#202124'}}>{app.download_count}</span>
          </StatCol>
          <div style={{width:1,background:'#E8EAED'}}/>
          <StatCol label="Rated for">
            <span style={{display:'flex',alignItems:'center',gap:2,fontSize:14,fontWeight:500,color:'#202124'}}>
              <span className="material-icons-round" style={{fontSize:14,color:'#5F6368'}}>info_outline</span>
              {app.age_rating}
            </span>
          </StatCol>
        </div>

        {/* Install button / progress */}
        <div style={{padding:'12px 16px'}}>
          {installing ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
              <div style={{position:'relative',width:100,height:100}}>
                <svg width="100" height="100" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#E8EAED" strokeWidth="6"/>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#1A73E8" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{transition:'stroke-dashoffset .08s linear'}}/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={52} radius={12}/>
                </div>
              </div>
              <div style={{fontSize:14,fontWeight:500,color:'#202124'}}>{app.name}</div>
              <div style={{fontSize:13,color:'#5F6368'}}>{Math.min(100,Math.round(progress))}% of {app.size_mb} MB</div>
              <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'#5F6368'}}>
                <span className="material-icons-round" style={{fontSize:14,color:'#34A853'}}>verified_user</span>
                Verified by Play Protect
              </div>
              <div style={{display:'flex',gap:12,marginTop:4}}>
                <button onClick={()=>setInstalling(false)}
                  style={{border:'1.5px solid #DADCE0',borderRadius:20,padding:'9px 24px',fontSize:13,
                    color:'#202124',background:'#fff',cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
                <button onClick={()=>showToast('Paused')}
                  style={{border:'none',borderRadius:20,padding:'9px 24px',fontSize:13,fontWeight:500,
                    color:'#fff',background:'#1A73E8',cursor:'pointer',fontFamily:'inherit'}}>Pause</button>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:4,fontSize:13,color:'#202124',cursor:'pointer',marginTop:4}}>
                Available on more devices
                <span className="material-icons-round" style={{fontSize:16}}>keyboard_arrow_down</span>
              </div>
            </div>
          ) : installed ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
              <AppIcon emoji={app.icon_emoji} color={app.icon_color} size={88} radius={20}/>
              <div style={{fontSize:20,fontWeight:500,color:'#202124'}}>{app.name}</div>
              <div style={{display:'flex',alignItems:'center',gap:4,fontSize:13,color:'#34A853'}}>
                <span className="material-icons-round" style={{fontSize:16}}>verified_user</span>
                Installed
              </div>
              <div style={{display:'flex',gap:12,width:'100%',marginTop:4}}>
                <button onClick={()=>showToast(`Opening ${app.name}`)}
                  style={{flex:1,padding:'13px',background:'#1A73E8',color:'#fff',border:'none',
                    borderRadius:8,fontSize:15,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Open</button>
                <button onClick={doUninstall}
                  style={{flex:1,padding:'13px',background:'#fff',color:'#1A73E8',
                    border:'1.5px solid #DADCE0',borderRadius:8,fontSize:15,fontWeight:500,
                    cursor:'pointer',fontFamily:'inherit'}}>Uninstall</button>
              </div>
            </div>
          ) : (
            <button onClick={doInstall}
              style={{width:'100%',padding:'14px',background:'#1A73E8',color:'#fff',border:'none',
                borderRadius:8,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'inherit',letterSpacing:.3}}>
              Install
            </button>
          )}
        </div>

        {/* Screenshots */}
        <div style={{display:'flex',gap:8,padding:'4px 16px 12px',overflowX:'auto'}} className="no-scrollbar">
          {SS_COLORS.map((c,i)=>(
            <div key={i} style={{width:140,height:244,borderRadius:8,flexShrink:0,
              background:c,border:'1px solid #E8EAED',display:'flex',
              alignItems:'center',justifyContent:'center',fontSize:44}}>
              {['🎬','📱','🎯','✨','🚀'][i]}
            </div>
          ))}
        </div>

        {/* About */}
        {!installing && <>
          <div style={{borderTop:'1px solid #E8EAED',padding:'14px 16px 10px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:15,fontWeight:500,color:'#202124'}}>About this app</span>
              <span className="material-icons-round" style={{fontSize:20,color:'#5F6368',cursor:'pointer'}}>chevron_right</span>
            </div>
            <p style={{fontSize:13,color:'#5F6368',lineHeight:1.65,margin:0}}>{app.description}</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>
              {app.tags?.map(t=>(
                <span key={t} style={{background:'#F1F3F4',borderRadius:20,padding:'5px 14px',fontSize:12,color:'#5F6368'}}>{t}</span>
              ))}
            </div>
          </div>

          {/* Ratings chart */}
          <div style={{borderTop:'1px solid #E8EAED',padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:4}}>
              <div style={{fontSize:48,fontWeight:300,color:'#202124',lineHeight:1}}>{app.rating}</div>
              <div style={{flex:1}}>
                {[5,4,3,2,1].map(n=>(
                  <div key={n} style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                    <span style={{fontSize:11,color:'#5F6368',width:8}}>{n}</span>
                    <div style={{flex:1,height:4,background:'#E8EAED',borderRadius:2}}>
                      <div style={{width:`${[70,20,6,3,1][5-n]}%`,height:'100%',background:'#FBBC04',borderRadius:2}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rate this app (only if installed) */}
          {installed && (
            <div style={{borderTop:'1px solid #E8EAED',padding:'14px 16px'}}>
              <div style={{fontSize:15,fontWeight:500,color:'#202124',marginBottom:4}}>Rate this app</div>
              <div style={{fontSize:12,color:'#5F6368',marginBottom:12}}>Tell others what you think</div>
              <div style={{display:'flex',gap:6}}>
                {[1,2,3,4,5].map(n=>(
                  <span key={n} onClick={()=>rateStar(n)}
                    className="material-icons-round"
                    style={{fontSize:34,cursor:'pointer',color:n<=stars?'#FBBC04':'#9AA0A6'}}>
                    {n<=stars?'star':'star_border'}
                  </span>
                ))}
              </div>
              <div onClick={()=>showToast('Opening review form')}
                style={{color:'#1A73E8',fontSize:13,cursor:'pointer',marginTop:12}}>
                Write a review
              </div>
            </div>
          )}

          {/* What's new */}
          <div style={{borderTop:'1px solid #E8EAED',padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
              <span style={{fontSize:15,fontWeight:500,color:'#202124'}}>What&apos;s new</span>
              <div style={{width:8,height:8,borderRadius:4,background:'#1A73E8'}}/>
              <div style={{flex:1}}/>
              <span className="material-icons-round" style={{fontSize:20,color:'#5F6368',cursor:'pointer'}}>chevron_right</span>
            </div>
            <div style={{fontSize:12,color:'#5F6368',marginBottom:8}}>Last updated Nov 2025</div>
            <p style={{fontSize:13,color:'#5F6368',margin:0,lineHeight:1.6}}>Bug fixes and performance improvements.</p>
          </div>

          {/* App support */}
          <div onClick={()=>showToast('App support')}
            style={{borderTop:'1px solid #E8EAED',padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}}>
            <span style={{fontSize:15,fontWeight:500,color:'#202124'}}>App support</span>
            <span className="material-icons-round" style={{fontSize:20,color:'#5F6368'}}>keyboard_arrow_down</span>
          </div>
        </>}

      </div>
      <Toast />
    </div>
  );
}

function Btn({icon,onClick}:{icon:string;onClick:()=>void}) {
  return (
    <button onClick={onClick} style={{background:'none',border:'none',cursor:'pointer',padding:8,borderRadius:20,display:'flex'}}>
      <span className="material-icons-round" style={{fontSize:22,color:'#202124'}}>{icon}</span>
    </button>
  );
}

function StatCol({label,children}:{label:string;children:React.ReactNode}) {
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'0 4px'}}>
      {children}
      <span style={{fontSize:11,color:'#5F6368',textAlign:'center'}}>{label}</span>
    </div>
  );
}

function Chip({children}:{children:React.ReactNode}) {
  return (
    <span style={{fontSize:11,color:'#5F6368',border:'1px solid #E8EAED',borderRadius:4,padding:'2px 6px'}}>
      {children}
    </span>
  );
}

function formatCount(n:number) {
  if (n>=1e9) return (n/1e9).toFixed(0)+'B';
  if (n>=1e6) return (n/1e6).toFixed(0)+'M';
  return n.toLocaleString();
}
