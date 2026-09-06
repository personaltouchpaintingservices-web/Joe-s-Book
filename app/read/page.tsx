'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, BUCKET, narrationUrlFor } from '@/lib/supabaseClient';

type FileEntry = {
  path: string; // full path within the bucket, e.g. "page_003.jpg"
};

type CommentRow = {
  id: number;
  page_path: string;
  name: string | null;
  message: string;
  created_at: string;
};

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic)$/i;
const MAX_MESSAGE_LEN = 500;

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

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ReadPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [narrationPlaying, setNarrationPlaying] = useState(false);
  const [narrationError, setNarrationError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const loadComments = useCallback(async (path: string) => {
    setCommentsLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('page_path', path)
      .order('created_at', { ascending: true });
    if (!error && data) setComments(data as CommentRow[]);
    setCommentsLoading(false);
  }, []);

  const close = () => {
    stopNarration();
    setActiveIndex(null);
    setCommentsOpen(false);
  };
  const prev = () => {
    stopNarration();
    setNarrationError(null);
    setCommentsOpen(false);
    setSubmitError(null);
    setActiveIndex((i) => (i === null ? null : Math.max(0, i - 1)));
  };
  const next = () => {
    stopNarration();
    setNarrationError(null);
    setCommentsOpen(false);
    setSubmitError(null);
    setActiveIndex((i) => (i === null ? null : Math.min(files.length - 1, i + 1)));
  };

  const openPage = (i: number) => {
    setActiveIndex(i);
    setCommentsOpen(false);
    setSubmitError(null);
  };

  const toggleComments = () => {
    const opening = !commentsOpen;
    setCommentsOpen(opening);
    if (opening && activeIndex !== null) {
      loadComments(files[activeIndex].path);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex === null) return;

    // Honeypot: real visitors never fill this hidden field. If it has a
    // value, silently pretend success without actually posting anything.
    if (honeypot.trim() !== '') {
      setMessageInput('');
      setNameInput('');
      return;
    }

    const trimmed = messageInput.trim();
    if (!trimmed) {
      setSubmitError('Comment cannot be empty.');
      return;
    }
    if (trimmed.length > MAX_MESSAGE_LEN) {
      setSubmitError(`Keep it under ${MAX_MESSAGE_LEN} characters.`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    const { data, error } = await supabase
      .from('comments')
      .insert({
        page_path: files[activeIndex].path,
        name: nameInput.trim() || 'Anonymous',
        message: trimmed,
      })
      .select()
      .single();

    setSubmitting(false);
    if (error) {
      setSubmitError("Couldn't post that — try again?");
      return;
    }
    if (data) {
      setComments((prev) => [...prev, data as CommentRow]);
      setMessageInput('');
    }
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

    setNarrationError(null);
    const src = narrationUrlFor(files[activeIndex].path);
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }
    audio
      .play()
      .then(() => setNarrationPlaying(true))
      .catch((err) => {
        console.error('Narration playback failed:', err);
        setNarrationError('No narration for this page yet.');
      });
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
            <div className="card" key={f.path} onClick={() => openPage(i)}>
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
            onError={(e) => {
              console.error('Narration failed to load:', e);
              setNarrationError('No narration for this page yet.');
            }}
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

          <div className="lightbox-controls" onClick={(e) => e.stopPropagation()}>
            <button
              className={`narration-btn${narrationPlaying ? ' playing' : ''}`}
              onClick={toggleNarration}
            >
              {narrationPlaying ? '⏸ Narration' : '🔊 Narration'}
            </button>
            <button
              className={`comments-btn${commentsOpen ? ' open' : ''}`}
              onClick={toggleComments}
            >
              💬 Comments
            </button>
          </div>
          {narrationError && (
            <p className="narration-error" onClick={(e) => e.stopPropagation()}>
              {narrationError}
            </p>
          )}

          {commentsOpen && (
            <div className="comments-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="comments-drawer-header">
                <span>Comments</span>
                <span className="comments-drawer-close" onClick={() => setCommentsOpen(false)}>
                  ✕
                </span>
              </div>

              <div className="comments-list">
                {commentsLoading && <p className="comments-empty">Loading&hellip;</p>}
                {!commentsLoading && comments.length === 0 && (
                  <p className="comments-empty">No comments yet — be the first!</p>
                )}
                {!commentsLoading &&
                  comments.map((c) => (
                    <div className="comment-item" key={c.id}>
                      <div className="comment-meta">
                        <span className="comment-name">{c.name || 'Anonymous'}</span>
                        <span className="comment-time">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="comment-message">{c.message}</p>
                    </div>
                  ))}
              </div>

              <form className="comments-form" onSubmit={submitComment}>
                {/* Honeypot field: hidden from real visitors via CSS, bots that
                    auto-fill every field will trip it and get silently ignored. */}
                <input
                  type="text"
                  name="website"
                  className="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={60}
                />
                <textarea
                  placeholder="Leave a comment on this page..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  maxLength={MAX_MESSAGE_LEN}
                  rows={3}
                />
                {submitError && <p className="comment-submit-error">{submitError}</p>}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
