'use client';

import { useRef, useState } from 'react';
import { landingMusicUrl } from '@/lib/supabaseClient';

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL;

function RingBackground() {
  return (
    <svg
      className="ring-bg"
      viewBox="0 0 1400 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="matGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16308f" />
          <stop offset="100%" stopColor="#0e2066" />
        </linearGradient>
      </defs>

      {/* mat is inset from the canvas edge so the crowd-texture page
          background shows through as the "audience" beyond the ropes */}
      <rect x="60" y="60" width="1280" height="780" fill="url(#matGrad)" />

      <rect x="60" y="60" width="1280" height="780" rx="10" fill="none" stroke="#c0392b" strokeWidth="10" />
      <rect x="105" y="105" width="1190" height="690" rx="10" fill="none" stroke="#f5f1e6" strokeWidth="10" />
      <rect x="150" y="150" width="1100" height="600" rx="10" fill="none" stroke="#c9a227" strokeWidth="10" />

      <g>
        <rect x="20" y="20" width="90" height="90" rx="14" fill="#a4271f" stroke="#5c140f" strokeWidth="4" />
        <rect x="1290" y="20" width="90" height="90" rx="14" fill="#a4271f" stroke="#5c140f" strokeWidth="4" />
        <rect x="20" y="790" width="90" height="90" rx="14" fill="#a4271f" stroke="#5c140f" strokeWidth="4" />
        <rect x="1290" y="790" width="90" height="90" rx="14" fill="#a4271f" stroke="#5c140f" strokeWidth="4" />
      </g>
    </svg>
  );
}

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
    <div className="landing ring-hero">
      <RingBackground />

      <audio
        ref={audioRef}
        loop
        onEnded={() => setPlaying(false)}
        onError={() => setMusicAvailable(false)}
      />

      <div className="landing-inner">
        <picture>
          <source srcSet="/images/joe-full-hero.webp" type="image/webp" />
          <img
            src="/images/joe-full-hero.png"
            alt="Joe's Wrestling Artwork"
            className="hero-logo hero-logo-full"
          />
        </picture>

        <p className="landing-sub ring-sub">
          Saying the prayers, Eating the vitamins, and Believing in yourself, brother,
          that&rsquo;s what makes a true Hulkamaniac. Over 170 hand-drawn pages of
          highlights and memories starting with the first Wrestlemania from a lifelong
          fan.
        </p>

        <div className="landing-actions">
          <a href="/read" className="btn btn-primary">
            Read the Book
          </a>
          <a href="/author" className="btn btn-secondary ring-btn-secondary">
            About the Author
          </a>
          {musicAvailable && (
            <button className="btn btn-ghost ring-btn-ghost" onClick={toggleMusic}>
              {playing ? '⏸ Pause Music' : '♪ Play Music'}
            </button>
          )}
        </div>

        {DONATE_URL && (
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="donate-link ring-donate-link"
          >
            Support this project
          </a>
        )}
      </div>
    </div>
  );
}
