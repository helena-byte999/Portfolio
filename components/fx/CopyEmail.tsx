'use client';

import { useRef, useState } from 'react';
import s from './fx.module.css';

type Toast = { id: number; title: string; text: string };

// Copies the email address and confirms with a toast; repeat presses stack up and fade out.
export default function CopyEmail({ email }: { email: string }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const copy = async () => {
    let toast: Toast;
    try {
      await navigator.clipboard.writeText(email);
      toast = { id: nextId.current++, title: 'Email copied', text: email };
    } catch {
      toast = { id: nextId.current++, title: "Couldn't copy", text: `It's ${email}` };
    }
    setToasts((list) => [...list.slice(-2), toast]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== toast.id)), 2600);
  };

  return (
    <>
      <button type="button" className="btn" onClick={copy}>
        Copy email
      </button>
      <div className={s.toasts} role="status" aria-live="polite">
        {toasts.map((t, i) => (
          <div key={t.id} className={s.toast} style={{ ['--depth' as string]: toasts.length - 1 - i }}>
            <span className={s.toastDot} aria-hidden="true" />
            <span>
              <strong>{t.title}</strong>
              <span>{t.text}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
