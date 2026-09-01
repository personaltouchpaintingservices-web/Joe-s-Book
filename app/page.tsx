'use client';

import { useRef, useState } from 'react';
import { landingMusicUrl } from '@/lib/supabaseClient';

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL;

export default function LandingPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [musicAvailable, setMusicAvailable] = useState(true);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (!audio.src) {
      audio.src = landingMusicUrl();
    }
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setMusicAvailable(false));
  };

  return (
    <div className="landing">
      <audio
        ref={audioRef}
        loop
        onEnded={() => setPlaying(false)}
        onError={() => setMusicAvailable(false)}
      />

      <div className="landing-inner">
        <div className="eyebrow">A WWF Wrestling Scrapbook</div>
        <h1 className="landing-title">Joe&rsquo;s Book</h1>
        <p className="landing-sub">
          Every page, drawn and written by hand &mdash; now shared for anyone who wants
          to step back into the golden years of wrestling with us.
        </p>

        <div className="landing-actions">
          <a href="/read" className="btn btn-primary">
            Read the Book
          </a>
          <a href="/author" className="btn btn-secondary">
            About the Author
          </a>
          {musicAvailable && (
            <button className="btn btn-ghost" onClick={toggleMusic}>
              {playing ? '⏸ Pause Music' : '♪ Play Music'}
            </button>
          )}
        </div>

        {DONATE_URL && (
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="donate-link"
          >
            Support this project
          </a>
        )}
      </div>
    </div>
  );
}
