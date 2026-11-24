'use client';
import { useRouter } from 'next/navigation';

const ITEMS = [
  { icon: 'sports_esports', label: 'Games',  path: '/home' },
  { icon: 'apps',           label: 'Apps',   path: '/home' },
  { icon: 'search',         label: 'Search', path: '/search' },
  { icon: 'book',           label: 'Books',  path: '/home' },
];

export default function BottomNav({ active = 'Apps' }: { active?: string }) {
  const router = useRouter();
  return (
    <div style={{ display:'flex', borderTop:'1px solid #E8EAED', background:'#fff', flexShrink:0 }}>
      {ITEMS.map(item => {
        const on = item.label === active;
        return (
          <button key={item.label} onClick={() => router.push(item.path)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              padding:'8px 4px 14px', border:'none', background:'none', cursor:'pointer', gap:3 }}>
            <span className="material-icons-round"
              style={{ fontSize:22, color: on ? '#1A73E8' : '#5F6368' }}>
              {item.icon}
            </span>
            <span style={{ fontSize:11, color: on ? '#1A73E8' : '#5F6368',
              fontWeight: on ? 500 : 400, letterSpacing:.3 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
