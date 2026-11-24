'use client';
export default function PlayLogo({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Green — top-left triangle */}
      <path d="M8,4 L8,50 L52,50 Z" fill="#34A853"/>
      {/* Blue — bottom-left triangle */}
      <path d="M8,50 L8,96 L52,50 Z" fill="#1A73E8"/>
      {/* Yellow — top-right triangle */}
      <path d="M8,4 L52,50 L90,28 Z" fill="#FBBC04"/>
      {/* Red — bottom-right triangle */}
      <path d="M8,96 L52,50 L90,72 Z" fill="#EA4335"/>
      {/* Dark orange center */}
      <path d="M52,50 L90,28 L90,72 Z" fill="#E8710A"/>
    </svg>
  );
}
