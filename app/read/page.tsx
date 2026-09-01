'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, BUCKET, narrationUrlFor } from '@/lib/supabaseClient';

type FileEntry = {
  path: string; // full path within the bucket, e.g. "page_003.jpg"
};

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic)$/i;

// Supabase's list() only returns one folder level at a time, so we
// recurse into subfolders to pick up everything, however it's organized.
// The "audio" and "site" folders are reserved for narration/assets and
// are skipped here so they never show up as pages.
async function listAllFiles(prefix = ''): Promise<FileEntry[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error || !data) return [];

  const results: FileEntry[] = [];
  for (const entry of data) {
    const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (!prefix && (entry.name === 'audio' || entry.name === 'site')) continue;
    const isFolder = entry.id === null;
    if (isFolder) {
      const nested = await listAllFiles(fullPath);
      results.push(...nested);
    } else if (IMAGE_EXT.test(entry.name)) {
      results.push({ path: fullPath });
    }
  }
  return results;
}

export default function ReadPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [narrationPlaying, setNarrationPlaying] = useState(false);
  const [narrationAvailable, setNarrationAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function load() {
      const all = await listAllFiles();
      all.sort((a, b) =>
        a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: 'base' })
      );
      setFiles(all);
      setLoading(false);
    }
    load();
  }, []);

  const urlFor = useCallback((path: string) => {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }, []);

  const stopNarration = useCallback(() => {
    audioRef.current?.pause();
    setNarrationPlaying(false);
  }, []);

  const close = () => {
    stopNarration();
    setActiveIndex(null);
  };
  const prev = () => {
    stopNarration();
    setNarrationAvailable(true);
    setActiveIndex((i) => (i === null ? null : Math.max(0, i - 1)));
  };
  const next = () => {
    stopNarration();
    setNarrationAvailable(true);
    setActiveIndex((i) => (i === null ? null : Math.min(files.length - 1, i + 1)));
  };

  const toggleNarration = () => {
    if (activeIndex === null) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (narrationPlaying) {
      audio.pause();
      setNarrationPlaying(false);
      return;
    }

    const src = narrationUrlFor(files[activeIndex].path);
    if (audio.src !== src) {
      audio.src = src;
    }
    audio
      .play()
      .then(() => setNarrationPlaying(true))
      .catch(() => setNarrationAvailable(false));
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (activeIndex === null) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, files.length]);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">The Collection</div>
        <h1>Joe&rsquo;s Book</h1>
        <p>Every page, in order, in one place.</p>
      </div>

      {loading && <p>Loading pages&hellip;</p>}

      {!loading && files.length === 0 && (
        <div className="empty">
          <p>No pages found in the bucket yet.</p>
          <p>Add some in your Supabase Storage dashboard, then refresh this page.</p>
        </div>
      )}

      {!loading && files.length > 0 && (
        <div className="grid">
          {files.map((f, i) => (
            <div className="card" key={f.path} onClick={() => setActiveIndex(i)}>
              <img src={urlFor(f.path)} alt={f.path} loading="lazy" />
              <div className="label">{f.path}</div>
            </div>
          ))}
        </div>
      )}

      {activeIndex !== null && files[activeIndex] && (
        <div className="lightbox" onClick={close}>
          <audio
            ref={audioRef}
            onEnded={() => setNarrationPlaying(false)}
            onError={() => setNarrationAvailable(false)}
          />
          <span className="close" onClick={close}>
            ✕
          </span>
          {activeIndex > 0 && (
            <span
              className="nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              ‹
            </span>
          )}
          <img
            src={urlFor(files[activeIndex].path)}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          {activeIndex < files.length - 1 && (
            <span
              className="nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              ›
            </span>
          )}
          {narrationAvailable && (
            <button
              className={`narration-btn${narrationPlaying ? ' playing' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleNarration();
              }}
            >
              {narrationPlaying ? '⏸ Narration' : '🔊 Narration'}
            </button>
          )}
        </div>
      )}
    </>
  );
}
