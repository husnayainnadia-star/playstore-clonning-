'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlayLogo from '@/components/PlayLogo';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/home');
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    // Demo: bypass login as guest
    router.push('/home');
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-white animate-in">
      <div style={{ height: 60 }} />
      <div className="flex flex-col flex-1 px-8 pb-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <PlayLogo size={52} />
        </div>
        <h1 className="text-[24px] font-medium text-[#202124] text-center mb-2">Welcome back</h1>
        <p className="text-[14px] text-[#5F6368] text-center mb-8">Sign in to continue to Google Play</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-[14px] border border-[#E8EAED] rounded-lg text-[14px] text-[#202124] outline-none focus:border-[#1A73E8] placeholder:text-[#9AA0A6]"
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-[14px] border border-[#E8EAED] rounded-lg text-[14px] text-[#202124] outline-none focus:border-[#1A73E8] placeholder:text-[#9AA0A6]"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-[#EA4335] text-[13px]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A73E8] text-white rounded-full font-medium text-[14px] cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Next'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4 text-[#5F6368] text-[13px]">
          <div className="flex-1 h-px bg-[#E8EAED]" />
          or
          <div className="flex-1 h-px bg-[#E8EAED]" />
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 border border-[#E8EAED] rounded-full text-[14px] font-medium text-[#202124] bg-white cursor-pointer hover:bg-[#F8F9FA]"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.3 0 24 0 14.7 0 6.7 5.5 2.7 13.6l7.8 6C12.4 13.3 17.8 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3.1-2.3 5.7-4.8 7.5l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.3z"/>
            <path fill="#FBBC05" d="M10.5 28.5c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.8-6C1 15.9 0 19.8 0 24s1 8.1 2.7 11.4l7.8-6z"/>
            <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.6l-7.5-5.8c-2.1 1.4-4.8 2.3-8 2.3-6.2 0-11.5-4.2-13.4-9.9l-7.8 6C6.7 42.5 14.7 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <Link
          href="/signup"
          className="w-full flex items-center justify-center py-3 border border-[#E8EAED] rounded-full text-[14px] font-medium text-[#202124] mt-3 hover:bg-[#F8F9FA]"
        >
          Create account
        </Link>

        <div className="mt-auto pt-4 text-center">
          <span className="text-[#1A73E8] text-[13px] cursor-pointer hover:underline">Forgot email?</span>
        </div>
      </div>
    </div>
  );
}
