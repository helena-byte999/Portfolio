import NowPlaying from './fx/NowPlaying';
import s from './Header.module.css';

// The middle of the header: which section you're on. Lives here so nothing floats over the page.
export default function HeaderCenter() {
  return (
    <div className={s.center}>
      <NowPlaying />
    </div>
  );
}
