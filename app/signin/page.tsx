'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlayLogo from '@/components/PlayLogo';
import Link from 'next/link';

const S: Record<string, React.CSSProperties> = {
  root: { display:'flex', flexDirection:'column', flex:1, background:'#fff', padding:'0 28px 32px' },
  logoWrap: { display:'flex', flexDirection:'column', alignItems:'center', marginTop:48, marginBottom:32, gap:0 },
  title: { fontSize:24, fontWeight:400, color:'#202124', textAlign:'center', marginBottom:8 },
  sub: { fontSize:14, color:'#5F6368', textAlign:'center', marginBottom:28 },
  input: {
    width:'100%', padding:'14px 14px', border:'1px solid #DADCE0', borderRadius:4,
    fontSize:14, color:'#202124', outline:'none', fontFamily:'inherit',
    background:'#fff', marginBottom:0,
  },
  btnPrimary: {
    width:'100%', padding:'13px', background:'#1A73E8', color:'#fff',
    border:'none', borderRadius:4, fontSize:14, fontWeight:500,
    cursor:'pointer', fontFamily:'inherit', letterSpacing:.25,
  },
  orRow: { display:'flex', alignItems:'center', gap:12, margin:'16px 0', color:'#5F6368', fontSize:13 },
  line: { flex:1, height:1, background:'#E8EAED' },
  btnGoogle: {
    width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
    padding:'13px', background:'#fff', border:'1px solid #DADCE0', borderRadius:4,
    fontSize:14, fontWeight:500, color:'#202124', cursor:'pointer', fontFamily:'inherit',
  },
  btnOutline: {
    width:'100%', padding:'13px', background:'#fff',
    border:'1px solid #DADCE0', borderRadius:4,
    fontSize:14, fontWeight:500, color:'#202124', cursor:'pointer', fontFamily:'inherit',
    marginTop:12,
  },
  error: { fontSize:12, color:'#EA4335', marginTop:4 },
  forgot: { textAlign:'center', marginTop:'auto', paddingTop:16 },
  link: { color:'#1A73E8', fontSize:13, cursor:'pointer', textDecoration:'none' },
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error); return; }
      router.push('/home');
    } catch { setErr('Gagal terhubung ke server'); }
    finally { setLoading(false); }
  }

  return (
    <div style={S.root} className="animate-in">
      <div style={S.logoWrap}>
        <PlayLogo size={56} />
      </div>

      <div style={S.title}>Welcome back</div>
      <div style={S.sub}>Sign in to continue to Google Play</div>

      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <input
          style={{ ...S.input, borderColor: focused==='email' ? '#1A73E8' : '#DADCE0',
            borderWidth: focused==='email' ? 2 : 1 }}
          type="email" placeholder="Email or phone number"
          value={email} onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
          required
        />
        <input
          style={{ ...S.input, borderColor: focused==='pw' ? '#1A73E8' : '#DADCE0',
            borderWidth: focused==='pw' ? 2 : 1 }}
          type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          onFocus={() => setFocused('pw')} onBlur={() => setFocused('')}
          required
        />
        {err && <p style={S.error}>{err}</p>}
        <button type="submit" style={{ ...S.btnPrimary, opacity: loading ? .7 : 1 }} disabled={loading}>
          {loading ? 'Loading...' : 'Next'}
        </button>
      </form>

      <div style={S.orRow}>
        <div style={S.line}/> or <div style={S.line}/>
      </div>

      <button style={S.btnGoogle} onClick={() => router.push('/home')}>
        <GoogleIcon /> Continue with Google
      </button>

      <Link href="/signup" style={{ ...S.btnOutline, display:'flex', alignItems:'center',
        justifyContent:'center', textDecoration:'none', marginTop:12 }}>
        Create account
      </Link>

      <div style={S.forgot}>
        <Link href="#" style={S.link}>Forgot email?</Link>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.3 0 24 0 14.7 0 6.7 5.5 2.7 13.6l7.8 6C12.4 13.3 17.8 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3.1-2.3 5.7-4.8 7.5l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.3z"/>
      <path fill="#FBBC05" d="M10.5 28.5c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.8-6C1 15.9 0 19.8 0 24s1 8.1 2.7 11.4l7.8-6z"/>
      <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.6l-7.5-5.8c-2.1 1.4-4.8 2.3-8 2.3-6.2 0-11.5-4.2-13.4-9.9l-7.8 6C6.7 42.5 14.7 48 24 48z"/>
    </svg>
  );
}
