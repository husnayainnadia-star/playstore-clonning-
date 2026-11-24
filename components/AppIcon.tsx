'use client';
interface Props {
  emoji: string;
  color: string;
  size?: number;
  radius?: number;
}
export default function AppIcon({ emoji, color, size = 56, radius }: Props) {
  const r = radius ?? Math.round(size * 0.25);
  const fontSize = Math.round(size * 0.5);
  return (
    <div
      style={{ width: size, height: size, borderRadius: r, background: color, fontSize, flexShrink: 0 }}
      className="flex items-center justify-center"
    >
      {emoji}
    </div>
  );
}
