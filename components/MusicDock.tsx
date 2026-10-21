'use client';

import MusicPlayer from './booth/MusicPlayer';
import { useMusic } from './booth/musicStore';

// Mounted once in the root layout, so a playlist keeps playing as visitors move between pages.
export default function MusicDock() {
  const playing = useMusic();
  return playing ? <MusicPlayer list={playing.list} index={playing.index} at={playing.at} /> : null;
}
