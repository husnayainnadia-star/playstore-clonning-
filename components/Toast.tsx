'use client';
import { useEffect, useState } from 'react';

let toastFn: ((msg: string) => void) | null = null;
export function showToast(msg: string) { toastFn?.(msg); }

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastFn = (m: string) => {
      setMsg(m);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };
    return () => { toastFn = null; };
  }, []);

  return (
    <div
      style={{
        position: 'absolute', bottom: 90, left: '50%',
        transform: 'translateX(-50%)',
        background: '#323232', color: '#fff',
        padding: '10px 20px', borderRadius: 50,
        fontSize: 13, zIndex: 200, whiteSpace: 'nowrap',
        transition: 'opacity .3s',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      {msg}
    </div>
  );
}
