'use client';

import { useState } from 'react';
import { authorPhotoUrl } from '@/lib/supabaseClient';

export default function AuthorPage() {
  const [photoAvailable, setPhotoAvailable] = useState(true);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">About</div>
        <h1>The Author</h1>
      </div>

      <div className="author-layout">
        {photoAvailable && (
          <img
            src={authorPhotoUrl()}
            alt="The author"
            className="author-photo"
            onError={() => setPhotoAvailable(false)}
          />
        )}

        <div className="author-bio">
          {/*
            Edit this bio directly in the code (app/author/page.tsx) —
            replace this paragraph with the real story whenever you're ready.
          */}
          <p>
            Every page of this book was drawn, written, and put together by hand over
            eighteen months &mdash; a labor of love built from a lifetime of watching
            wrestling and the memories that came with it.
          </p>
          <p>
            This site exists to keep that work somewhere it can be shared, read, and
            revisited &mdash; by family, by friends, and by anyone who grew up loving
            the same golden years of the sport.
          </p>
        </div>
      </div>
    </>
  );
}
