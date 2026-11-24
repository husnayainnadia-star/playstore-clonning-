'use client';
import { useEffect, useState } from 'react';

let _show: ((m: string) => void) | null = null;
export function showToast(msg: string) { _show?.(msg); }

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [vis, setVis] = useState(false);
  useEffect(() => {
    _show = (m) => { setMsg(m); setVis(true); setTimeout(() => setVis(false), 2500); };
    return () => { _show = null; };
  }, []);
  return (
    <div style={{
      position:'absolute', bottom:88, left:'50%', transform:'translateX(-50%)',
      background:'#323232', color:'#fff', padding:'10px 20px', borderRadius:50,
      fontSize:13, zIndex:999, whiteSpace:'nowrap', pointerEvents:'none',
      transition:'opacity .25s', opacity: vis ? 1 : 0,
    }}>{msg}</div>
  );
}
