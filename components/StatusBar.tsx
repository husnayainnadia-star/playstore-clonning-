'use client';
export default function StatusBar({ light = false }: { light?: boolean }) {
  const color = light ? '#fff' : '#202124';
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'12px 20px 4px', flexShrink:0 }}>
      <span style={{ fontSize:13, fontWeight:600, color }}>9:41</span>
      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill={color}>
          <rect x="0"  y="4" width="3" height="8" rx="1"/>
          <rect x="4"  y="2.5" width="3" height="9.5" rx="1"/>
          <rect x="8"  y="1" width="3" height="11" rx="1"/>
          <rect x="12" y="0" width="3" height="12" rx="1" opacity=".3"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={color}>
          <path d="M8 2.4C5.6 2.4 3.4 3.4 1.8 5L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2L14.2 5C12.6 3.4 10.4 2.4 8 2.4z"/>
          <path d="M8 5.6c-1.6 0-3 .6-4.1 1.6L2.1 5.4C3.6 4 5.7 3.2 8 3.2s4.4.8 5.9 2.2L12.1 7.2C11 6.2 9.6 5.6 8 5.6z"/>
          <circle cx="8" cy="10" r="2"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={color} strokeOpacity=".35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill={color}/>
          <path d="M23 4v4a2 2 0 000-4z" fill={color} fillOpacity=".4"/>
        </svg>
      </div>
    </div>
  );
}
