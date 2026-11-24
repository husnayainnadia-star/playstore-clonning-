'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/StatusBar';
import PlayLogo from '@/components/PlayLogo';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first:'', last:'', email:'', password:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name:`${form.first} ${form.last}`.trim(), email:form.email, password:form.password }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error); return; }
      router.push('/home');
    } catch { setErr('Gagal terhubung ke server'); }
    finally { setLoading(false); }
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width:'100%', padding:'14px', border: `${focused===name?2:1}px solid ${focused===name?'#1A73E8':'#DADCE0'}`,
    borderRadius:4, fontSize:14, color:'#202124', outline:'none', fontFamily:'inherit', background:'#fff',
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:'#fff' }} className="animate-in">
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', padding:'4px 8px' }}>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', padding:8, borderRadius:20 }}>
          <span className="material-icons-round" style={{ fontSize:22, color:'#202124' }}>arrow_back</span>
        </button>
      </div>

      <div style={{ padding:'0 28px 32px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24, gap:0 }}>
          <PlayLogo size={52} />
        </div>
        <div style={{ fontSize:24, fontWeight:400, color:'#202124', textAlign:'center', marginBottom:8 }}>
          Create Google Account
        </div>
        <div style={{ fontSize:14, color:'#5F6368', textAlign:'center', marginBottom:28 }}>
          One account. All of Google.
        </div>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <input style={inputStyle('first')} placeholder="First name"
            value={form.first} onChange={e => setForm({...form,first:e.target.value})}
            onFocus={() => setFocused('first')} onBlur={() => setFocused('')} required />
          <input style={inputStyle('last')} placeholder="Last name"
            value={form.last} onChange={e => setForm({...form,last:e.target.value})}
            onFocus={() => setFocused('last')} onBlur={() => setFocused('')} />
          <input style={inputStyle('email')} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form,email:e.target.value})}
            onFocus={() => setFocused('email')} onBlur={() => setFocused('')} required />
          <input style={inputStyle('pw')} type="password" placeholder="Password (min 6 karakter)"
            value={form.password} onChange={e => setForm({...form,password:e.target.value})}
            onFocus={() => setFocused('pw')} onBlur={() => setFocused('')} required />
          {err && <p style={{ fontSize:12, color:'#EA4335' }}>{err}</p>}
          <button type="submit" disabled={loading}
            style={{ padding:'13px', background:'#1A73E8', color:'#fff', border:'none', borderRadius:4,
              fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', opacity:loading?.7:1 }}>
            {loading ? 'Loading...' : 'Next'}
          </button>
        </form>

        <p style={{ fontSize:11, color:'#5F6368', textAlign:'center', marginTop:16, lineHeight:1.7 }}>
          By creating an account, you agree to the{' '}
          <span style={{ color:'#1A73E8', cursor:'pointer' }}>Google Terms of Service</span>
          {' '}and{' '}
          <span style={{ color:'#1A73E8', cursor:'pointer' }}>Privacy Policy</span>.
        </p>

        <div style={{ marginTop:'auto', paddingTop:16, textAlign:'center' }}>
          <span onClick={() => router.push('/signin')}
            style={{ color:'#1A73E8', fontSize:13, cursor:'pointer' }}>
            Sign in instead
          </span>
        </div>
      </div>
    </div>
  );
}
