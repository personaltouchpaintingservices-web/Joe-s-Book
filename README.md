# Joe's Book — sharing site

A landing page, a gallery/reader, an author page, and per-page narration —
all reading from your Supabase Storage bucket. No database needed.

## What's new in this version

- **Landing page** (`/`) — title, intro, optional background music, buttons
  through to the book and the author page.
- **Reader** (`/read`) — the gallery you had before, now with a narration
  play/pause button per page when you view it full-screen.
- **Author page** (`/author`) — a bio, with an optional photo.
- **Donate link** — shows up in the nav bar and on the landing page, only if
  you set the env var for it.

## Environment variables

Same three as before, plus one new one — set these in Vercel under Project
Settings → Environment Variables:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
| `NEXT_PUBLIC_SUPABASE_BUCKET` | your bucket's exact name |
| `NEXT_PUBLIC_DONATE_URL` | *(optional)* link to Ko-fi / PayPal.me / Venmo / Cash App |

Leave `NEXT_PUBLIC_DONATE_URL` unset if you're not ready for a donate link
yet — it just won't appear anywhere until you add it.

## Adding audio

All audio lives in the **same bucket** as your photos, under two reserved
folders that the reader knows to skip when listing pages:

- `audio/landing.mp3` — background music for the landing page.
- `audio/page_012.mp3` — narration for `page_012.jpg`. The filename (minus
  extension) must match the image's filename exactly. Any page without a
  matching audio file just won't show a narration button for that page.

Upload these the same way you uploaded the photos — drag them into the
bucket via the Supabase dashboard, into an `audio` folder.

## Adding an author photo

Optional. Upload one photo to `site/author.jpg` in the same bucket (again,
via the Supabase dashboard, into a `site` folder). If it's not there, the
author page just shows the bio text without a photo — nothing breaks.

## Editing the author bio

The bio text is plain text in the code, not pulled from Supabase. Open
`app/author/page.tsx` and edit the two paragraphs directly, then push the
change the same way you push any other code change (GitHub Desktop → commit
→ push; Vercel redeploys automatically).

## Deploying this update

Same process as before:

1. In GitHub Desktop, make sure it's pointed at your existing `Joe-s-Book`
   local folder.
2. Copy all the files from this zip into that folder, overwriting what's
   there.
3. GitHub Desktop will show a batch of changes — commit with a message like
   "add landing page, author page, donate button, narration" and push.
4. Vercel picks up the push automatically and redeploys within about a
   minute.

## Everything from before still applies

Bucket must stay public, photos upload the same way, filenames sort
alphabetically for reading order. See earlier notes for the full original
setup if you need a refresher.

## Contact link

Same pattern as Donate: set `NEXT_PUBLIC_CONTACT_URL` in Vercel to your
Reddit post (or wherever), and a "Contact" link appears in the nav bar
automatically. Leave it unset to hide it.

## Traffic analytics

Vercel Web Analytics is now wired in (free on the Hobby plan, 50,000
events/month, no cookie banner needed). One manual step required:

1. In your Vercel dashboard, open this project → the "Analytics" tab.
2. Click "Enable" (one-time toggle).
3. Give it a few minutes after your next deploy, then visit the Analytics
   tab to see page views, visitor counts, top pages, and referrer sources
   (so you can see how much traffic came from Reddit specifically).

## Known issue: Next.js version

This project runs Next.js 14.2.35 (the latest patch in the 14.x line),
which has a number of known security advisories fixed only in the 15.x/16.x
major versions. Upgrading is a breaking change that needs its own dedicated
testing pass — not something to do in a rush. Worth scheduling as a
follow-up task rather than ignoring indefinitely.
