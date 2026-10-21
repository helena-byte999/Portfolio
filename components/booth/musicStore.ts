'use client';

import { useSyncExternalStore } from 'react';
import type { Playlist } from './MusicPlayer';

// What's playing, shared between the playlist cards and the booth's decks (which start it), the mini
// player (which plays it) and the background (which sparks up while it plays).
// `at` changes on every press, so pressing the playing playlist again replays it.
type Music = { list: Playlist[]; index: number; at: number } | null;

let state: Music = null;
const subscribers = new Set<() => void>();

export const music = {
  get: () => state,
  set(next: Music) {
    state = next;
    if (!next) playback.set(false);
    subscribers.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  },
};

export const useMusic = () => useSyncExternalStore(music.subscribe, music.get, () => null);

// Whether sound is actually coming out, as reported by Spotify's player, plus its play/pause.
// Mirrored onto <html data-music="playing"> so the WebGL background can read it every frame.
let playing = false;
let toggle: (() => void) | null = null;

export const playback = {
  get playing() {
    return playing;
  },
  set(on: boolean) {
    playing = on;
    if (on) document.documentElement.dataset.music = 'playing';
    else delete document.documentElement.dataset.music;
  },
  setToggle(fn: (() => void) | null) {
    toggle = fn;
  },
  toggle() {
    toggle?.();
  },
};
