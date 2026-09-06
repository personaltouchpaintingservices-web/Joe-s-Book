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

      <div className="author-story">
        <picture>
          <source srcSet="/images/author-art-1.webp" type="image/webp" />
          <img
            src="/images/author-art-1.jpg"
            alt="The cover of the book"
            className="author-banner"
          />
        </picture>

        <div className="author-story-body">
          {photoAvailable && (
            <img
              src={authorPhotoUrl()}
              alt="The author"
              className="author-photo"
              onError={() => setPhotoAvailable(false)}
            />
          )}

          <p>My older brother always had talent. He just never knew what to do with it.</p>

          <p>
            He made some bad decisions along the way &mdash; and one of the worst was
            nearly giving up on himself.
          </p>

          <p>
            When he went to prison, I wrote him a bunch of times. I never got a
            response.
          </p>

          <p>
            Later, he told me why. He&rsquo;d sit down to write, and couldn&rsquo;t
            think of anything to say. So instead, he started remembering &mdash; all
            the times we had growing up, watching wrestling together. Before any of
            the drama of our real lives. Back when we were just kids, having fun.
          </p>

          <picture>
            <source srcSet="/images/author-art-2.webp" type="image/webp" />
            <img
              src="/images/author-art-2.jpg"
              alt="One of the drawings from the book"
              className="author-accent"
            />
          </picture>

          <p>
            He drew a picture of one of his favorite wrestling moments. Then another.
            Then another &mdash; nearly every day after that.
          </p>

          <p>
            When he got out, he handed me this book, with a promise: there&rsquo;d be
            more to come.
          </p>

          <p className="author-closing">
            I have never seen my older brother put so much of himself into something.
            And I have never been more proud to be his brother.
          </p>

          <p className="author-signature">I love you, Joe.</p>
        </div>
      </div>
    </>
  );
}
