'use client';
interface Props { emoji: string; color: string; size?: number; radius?: number; }
export default function AppIcon({ emoji, color, size = 56, radius }: Props) {
  const r = radius ?? Math.round(size * 0.22);
  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: color, fontSize: Math.round(size * 0.48),
      display:'flex', alignItems:'center', justifyContent:'center',
      flexShrink: 0, overflow:'hidden',
    }}>
      {emoji}
    </div>
  );
}
