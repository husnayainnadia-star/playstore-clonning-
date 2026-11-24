'use client';

interface Props {
  emoji?: string;
  color?: string;
  size?: number;
  radius?: number;
  appName?: string; // used to pick real SVG logo
}

// Real SVG brand logos
function TikTokIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#010101"/>
      <path d="M34.2 14.8c-1.6-1-2.7-2.7-3-4.8h-4.1v20.6c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .8.1 1.1.2V22.6c-.4-.1-.7-.1-1.1-.1-4.6 0-8.3 3.7-8.3 8.3s3.7 8.3 8.3 8.3 8.3-3.7 8.3-8.3V22c1.7 1.2 3.7 1.9 5.9 1.9v-4.1c-1.2 0-2.4-.4-3.1-1z" fill="white"/>
      <path d="M34.2 14.8c-1.6-1-2.7-2.7-3-4.8h-4.1v20.6c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .8.1 1.1.2V22.6c-.4-.1-.7-.1-1.1-.1-4.6 0-8.3 3.7-8.3 8.3s3.7 8.3 8.3 8.3 8.3-3.7 8.3-8.3V22c1.7 1.2 3.7 1.9 5.9 1.9v-4.1c-1.2 0-2.4-.4-3.1-1z" fill="#69C9D0" opacity="0.6"/>
      <path d="M31.1 10H27v20.6c0 2.2-1.8 4-4 4" stroke="#EE1D52" strokeWidth="0.5" fill="none" opacity="0.4"/>
    </svg>
  );
}

function InstagramIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs>
        <radialGradient id="ig-g1" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#ig-g1)"/>
      <rect x="13" y="13" width="22" height="22" rx="6" stroke="white" strokeWidth="2.5" fill="none"/>
      <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
      <circle cx="33" cy="15" r="1.8" fill="white"/>
    </svg>
  );
}

function WhatsAppIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#25D366"/>
      <path d="M24 10C16.3 10 10 16.3 10 24c0 2.5.7 4.9 1.9 7L10 38l7.3-1.9C19.3 37.3 21.6 38 24 38c7.7 0 14-6.3 14-14S31.7 10 24 10z" fill="white"/>
      <path d="M31.5 27.5c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2s-1 1.2-1.2 1.5c-.2.3-.4.3-.8.1s-1.6-.6-3-1.9c-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.7l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.4-.1-.6s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.6 5.8 5.1 3.4 1.5 3.4 1 4 1s2.6-1 3-2 .4-1.8.3-2c-.2-.1-.4-.2-.8-.4z" fill="#25D366"/>
    </svg>
  );
}

function YouTubeIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#FF0000"/>
      <path d="M38.5 16.8s-.4-2.5-1.5-3.6c-1.4-1.5-3-1.5-3.8-1.6C29.3 11.4 24 11.4 24 11.4s-5.3 0-9.2.3c-.8.1-2.4.1-3.8 1.6-1.1 1.1-1.5 3.6-1.5 3.6S9 19.6 9 22.4v2.6c0 2.8.5 5.6.5 5.6s.4 2.5 1.5 3.6c1.4 1.5 3.3 1.4 4.2 1.6 3 .3 12.8.4 12.8.4s5.3 0 9.2-.4c.8-.1 2.4-.1 3.8-1.6 1.1-1.1 1.5-3.6 1.5-3.6s.5-2.8.5-5.6v-2.6c0-2.8-.5-5.6-.5-5.6z" fill="white" opacity="0.15"/>
      <polygon points="20,17 20,31 32,24" fill="white"/>
    </svg>
  );
}

function MapsIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#fff"/>
      <path d="M30 11l-6 3-6-3-8 4v22l8-4 6 3 6-3 8 4V15l-8-4z" fill="none"/>
      <path d="M24 8C19 8 15 12.1 15 17.2c0 7.2 9 18.8 9 18.8s9-11.6 9-18.8C33 12.1 29 8 24 8z" fill="#EA4335"/>
      <path d="M24 8C19 8 15 12.1 15 17.2c0 7.2 9 18.8 9 18.8" fill="#C5221F"/>
      <circle cx="24" cy="17" r="4.5" fill="white"/>
      <circle cx="24" cy="17" r="3" fill="#EA4335"/>
    </svg>
  );
}

function SpotifyIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#1DB954"/>
      <path d="M24 10C16.3 10 10 16.3 10 24s6.3 14 14 14 14-6.3 14-14S31.7 10 24 10zm6.4 20.2c-.3.4-.8.5-1.2.3-3.3-2-7.4-2.5-12.3-1.4-.5.1-.9-.2-1-.6-.1-.5.2-.9.6-1 5.3-1.2 9.9-.7 13.6 1.5.4.3.6.8.3 1.2zm1.7-3.8c-.3.5-1 .6-1.5.3-3.8-2.3-9.5-3-14-1.6-.6.2-1.2-.1-1.4-.7-.2-.6.1-1.2.7-1.4 5.1-1.5 11.4-.8 15.8 1.8.5.4.6 1.1.4 1.6zm.1-3.9c-4.5-2.7-12-2.9-16.3-1.6-.7.2-1.4-.2-1.6-.9-.2-.7.2-1.4.9-1.6 5-1.5 13.3-1.2 18.5 1.9.6.4.8 1.2.4 1.9-.4.6-1.3.8-1.9.3z" fill="white"/>
    </svg>
  );
}

function NetflixIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#141414"/>
      <path d="M15 10h5.5v14.5L26 10h5.5L26 24.5 31.5 38H26l-5.5-13.5V38H15V10z" fill="#E50914"/>
      <path d="M20.5 10v14.5L26 38h5.5L26 24.5 31.5 10H26l-5.5 14.5V10h-5.5z" fill="#B81D24" opacity="0.5"/>
    </svg>
  );
}

function SnapchatIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#FFFC00"/>
      <path d="M24 9c-3.9 0-7 3.1-7 7v3c-1.1.5-2 .5-2 .5s.5 2 2 2.5c-.5 1-1.5 2-3 2.5.5 1 2.5 1.5 4 1.5.5 1 1 1.5 1 1.5H19s0 2 5 2 5-2 5-2h-.5s.5-1 1-1.5c1.5 0 3.5-.5 4-1.5-1.5-.5-2.5-1.5-3-2.5 1.5-.5 2-2.5 2-2.5s-.9 0-2-.5v-3c0-3.9-3.1-7-7-7z" fill="#1A1A1A"/>
    </svg>
  );
}

function GmailIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#fff"/>
      <path d="M10 14h28v20H10V14z" fill="white" stroke="#E8EAED" strokeWidth="1"/>
      <path d="M10 14l14 10 14-10" stroke="#EA4335" strokeWidth="2.5" fill="none"/>
      <path d="M10 14v20h6V21l8 6 8-6v13h6V14" fill="#fff"/>
      <path d="M10 14l14 10 14-10H10z" fill="#EA4335"/>
      <path d="M10 34V14l14 10" fill="#C5221F"/>
      <path d="M38 34V14L24 24" fill="#C5221F"/>
      <path d="M16 34V21l-6-7v20h6z" fill="#4285F4"/>
      <path d="M32 34V21l6-7v20h-6z" fill="#34A853"/>
    </svg>
  );
}

function ChromeIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#fff"/>
      <circle cx="24" cy="24" r="13" fill="none" stroke="#E8EAED" strokeWidth="1"/>
      <path d="M24 11a13 13 0 0 1 11.3 6.5H24a6.5 6.5 0 0 0 0 13 6.5 6.5 0 0 0 5.6-3.2l-5.6-9.7" fill="none"/>
      <circle cx="24" cy="24" r="6.5" fill="#4285F4"/>
      <path d="M24 11h11.3A13 13 0 0 1 37 24" fill="#EA4335"/>
      <path d="M35.3 17.5H24" stroke="white" strokeWidth="0.5"/>
      <path d="M37 24a13 13 0 0 1-7.4 11.7L24 24" fill="#34A853"/>
      <path d="M29.6 35.7L24 24" stroke="white" strokeWidth="0.5"/>
      <path d="M29.6 35.7A13 13 0 0 1 11 24a13 13 0 0 1 2.7-7.9L24 24" fill="#FBBC05"/>
      <path d="M13.7 16.1L24 24" stroke="white" strokeWidth="0.5"/>
      <circle cx="24" cy="24" r="5" fill="white"/>
      <circle cx="24" cy="24" r="4" fill="#4285F4"/>
    </svg>
  );
}

function DefaultIcon({ emoji, color, s, r }: { emoji: string; color: string; s: number; r: number }) {
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <rect width={s} height={s} rx={r} fill={color}/>
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
        fontSize={Math.round(s * 0.48)}>
        {emoji}
      </text>
    </svg>
  );
}

export default function AppIcon({ emoji = '📱', color = '#1A73E8', size = 56, radius, appName = '' }: Props) {
  const r = radius ?? Math.round(size * 0.22);
  const s = size;

  // Pick real SVG logo based on app name
  const name = appName.toLowerCase();
  let logoSVG: React.ReactNode = null;

  if (name.includes('tiktok'))      logoSVG = <TikTokIcon s={s} />;
  else if (name.includes('instagram')) logoSVG = <InstagramIcon s={s} />;
  else if (name.includes('whatsapp'))  logoSVG = <WhatsAppIcon s={s} />;
  else if (name.includes('youtube'))   logoSVG = <YouTubeIcon s={s} />;
  else if (name.includes('map'))       logoSVG = <MapsIcon s={s} />;
  else if (name.includes('spotify'))   logoSVG = <SpotifyIcon s={s} />;
  else if (name.includes('netflix'))   logoSVG = <NetflixIcon s={s} />;
  else if (name.includes('snapchat'))  logoSVG = <SnapchatIcon s={s} />;
  else if (name.includes('gmail'))     logoSVG = <GmailIcon s={s} />;
  else if (name.includes('chrome'))    logoSVG = <ChromeIcon s={s} />;

  return (
    <div
      style={{
        width: s, height: s, borderRadius: r,
        overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        // Subtle shadow like real app icons
        boxShadow: '0 1px 4px rgba(0,0,0,.18), 0 0 0 .5px rgba(0,0,0,.06)',
        transition: 'transform .15s ease, box-shadow .15s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 14px rgba(0,0,0,.22), 0 0 0 .5px rgba(0,0,0,.06)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,.18), 0 0 0 .5px rgba(0,0,0,.06)';
      }}
    >
      {logoSVG ?? <DefaultIcon emoji={emoji} color={color} s={s} r={r} />}
    </div>
  );
}
