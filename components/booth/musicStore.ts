'use client';

import { useSyncExternalStore } from 'react';
import type { Playlist } from './MusicPlayer';

// What's playing, shared between the playlist cards (in the hero) and the player (in the header).
// `at` changes on every press, so pressing the playing playlist again reopens the player.
type Music = { list: Playlist[]; index: number; at: number } | null;

let state: Music = null;
const subscribers = new Set<() => void>();

export const music = {
  get: () => state,
  set(next: Music) {
    state = next;
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
