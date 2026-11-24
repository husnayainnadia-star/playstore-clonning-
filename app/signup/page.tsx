'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlayLogo from '@/components/PlayLogo';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.name} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
        }),
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

  return (
    <div className="flex flex-col min-h-screen bg-white animate-in">
      <StatusBar />
      <div className="flex items-center px-4 py-2">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-[#F8F9FA]">
          <span className="material-icons-round text-[#202124]">arrow_back</span>
        </button>
      </div>

      <div className="flex flex-col flex-1 px-8 pb-8">
        <div className="flex justify-center mb-6">
          <PlayLogo size={52} />
        </div>
        <h1 className="text-[24px] font-medium text-[#202124] text-center mb-2">Create Google Account</h1>
        <p className="text-[14px] text-[#5F6368] text-center mb-8">One account. All of Google.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-[14px] border border-[#E8EAED] rounded-lg text-[14px] outline-none focus:border-[#1A73E8] placeholder:text-[#9AA0A6]"
            placeholder="First name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-[14px] border border-[#E8EAED] rounded-lg text-[14px] outline-none focus:border-[#1A73E8] placeholder:text-[#9AA0A6]"
            placeholder="Last name"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
          />
          <input
            className="w-full px-4 py-[14px] border border-[#E8EAED] rounded-lg text-[14px] outline-none focus:border-[#1A73E8] placeholder:text-[#9AA0A6]"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-[14px] border border-[#E8EAED] rounded-lg text-[14px] outline-none focus:border-[#1A73E8] placeholder:text-[#9AA0A6]"
            type="password"
            placeholder="Password (min 6 karakter)"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
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

        <p className="text-[11px] text-[#5F6368] text-center mt-4 leading-relaxed">
          By creating an account, you agree to the{' '}
          <span className="text-[#1A73E8]">Google Terms of Service</span> and{' '}
          <span className="text-[#1A73E8]">Privacy Policy</span>.
        </p>

        <div className="mt-auto pt-4 text-center">
          <Link href="/signin" className="text-[#1A73E8] text-[13px] hover:underline">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
