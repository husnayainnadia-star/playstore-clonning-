'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayLogo from '@/components/PlayLogo';

export default function SplashPage() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push('/signin'), 2600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div style={{
      display:'flex', flexDirection:'column', flex:1,
      alignItems:'center', justifyContent:'center',
      background:'#fff', gap:0,
    }}>
      {/* Logo + text */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:18, marginBottom:72 }}>
        <PlayLogo size={96} />
        <div style={{ fontSize:28, fontWeight:400, color:'#202124', letterSpacing:-.3 }}>
          Google Play
        </div>
        <div style={{ fontSize:14, color:'#5F6368', textAlign:'center', lineHeight:1.6 }}>
          Discover millions<br/>of apps, games, and more
        </div>
      </div>

      {/* Four colored dashes at bottom */}
      <div style={{ position:'absolute', bottom:48, display:'flex', gap:8 }}>
        {['#EA4335','#FBBC04','#34A853','#1A73E8'].map((c,i) => (
          <div key={i} style={{ width:28, height:4, borderRadius:2, background:c }} />
        ))}
      </div>
    </div>
  );
}
