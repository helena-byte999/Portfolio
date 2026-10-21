'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { BOOTH_HINT, PADS, PERSON } from '@/content/site';
import { PadNote } from '../fx/Doodles';
import type { BoothSignal } from './BoothScene';
import StageDecor from './StageDecor';
import s from './Booth.module.css';

// three.js only loads here, after first paint, and never on the case study pages.
const BoothScene = dynamic(() => import('./BoothScene'), { ssr: false });

/** If WebGL dies mid-session the static booth simply stays up. */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canRender3d() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Booth() {
  const signal = useRef<BoothSignal>({ hover: -1, flash: -1, flashAt: -10, dragged: false, azimuth: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const [use3d, setUse3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [pressed, setPressed] = useState(-1);

  useEffect(() => setUse3d(canRender3d()), []);

  // Stop rendering the scene while it's scrolled out of view.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(stage.current!);
    return () => io.disconnect();
  }, []);

  const hit = useCallback((index: number) => {
    const pad = PADS[index];
    signal.current.flash = index;
    signal.current.flashAt = performance.now() / 1000;
    setPressed(index);
    window.setTimeout(() => setPressed(-1), 260);
    window.setTimeout(() => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById(pad.target)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `#${pad.target}`);
    }, 220);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const el = e.target as HTMLElement;
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      const index = PADS.findIndex((p) => p.key === e.key);
      if (index >= 0) hit(index);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hit]);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className={s.booth}>
      <div
        ref={stage}
        className={s.stage}
        role="img"
        aria-label="LEGO-style Ena in headphones and glasses, holding a vinyl record, nodding along at a DJ booth with two decks and a mixer."
      >
        <div className={s.poster} data-hidden={ready || undefined}>
          <img className={s.posterFigure} src="/booth/ena-full.webp" alt="" />
          <div className={s.posterDesk}>
            <span className={s.posterStuds} />
            <span className={s.posterLcd}>
              {PERSON.roles[0]}
              <i />
            </span>
          </div>
        </div>
        {use3d && (
          <SceneBoundary onError={() => setReady(false)}>
            <BoothScene signal={signal} roles={PERSON.roles} onPad={hit} onReady={onReady} running={onScreen} />
          </SceneBoundary>
        )}
        <p className="visually-hidden">{PERSON.roles.join(', ')}</p>
      </div>

      <StageDecor />

      <nav className={s.pads} aria-label="Jump to a section">
        <PadNote text="try a pad" />
        {PADS.map((pad, i) => (
          <button
            key={pad.key}
            type="button"
            className={s.pad}
            data-pressed={pressed === i || undefined}
            style={{ ['--pad' as string]: pad.color, ['--pad-ink' as string]: pad.ink }}
            onPointerEnter={() => (signal.current.hover = i)}
            onPointerLeave={() => (signal.current.hover = -1)}
            onFocus={() => (signal.current.hover = i)}
            onBlur={() => (signal.current.hover = -1)}
            onClick={() => hit(i)}
            aria-keyshortcuts={pad.key}
          >
            <span className={s.padKey}>{pad.key}</span>
            <span className={s.padLabel}>{pad.label}</span>
          </button>
        ))}
      </nav>
      <p className={`${s.hint} shimmer`}>{BOOTH_HINT}</p>
    </div>
  );
}
