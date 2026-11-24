'use client';
export default function PlayLogo({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M8,4 L8,50 L50,50 Z" fill="#34A853"/>
      <path d="M8,50 L8,96 L50,50 Z" fill="#1A73E8"/>
      <path d="M8,4 L50,50 L90,30 Z" fill="#FBBC04"/>
      <path d="M8,96 L50,50 L90,70 Z" fill="#EA4335"/>
      <path d="M50,50 L90,30 L90,70 Z" fill="#E8710A" opacity="0.9"/>
    </svg>
  );
}
