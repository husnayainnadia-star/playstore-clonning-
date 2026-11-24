'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayLogo from '@/components/PlayLogo';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to signin after 2.5s
    const timer = setTimeout(() => router.push('/signin'), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col h-full min-h-screen items-center justify-center gap-0 bg-white">
      <div className="flex flex-col items-center gap-5 mb-16">
        <PlayLogo size={100} />
        <div className="text-[28px] font-medium text-[#202124] mt-2">Google Play</div>
        <div className="text-[14px] text-[#5F6368] text-center leading-relaxed">
          Discover millions<br />of apps, games, and more
        </div>
      </div>
      {/* Progress dots */}
      <div className="flex gap-2 mt-16">
        {['#EA4335','#FBBC04','#34A853','#1A73E8'].map((c, i) => (
          <div key={i} style={{ background: c, width: 24, height: 4, borderRadius: 2 }} />
        ))}
      </div>
    </div>
  );
}
