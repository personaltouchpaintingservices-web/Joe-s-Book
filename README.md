# Joe's Book — sharing site

A simple gallery that reads images straight out of your Supabase Storage
bucket. No database needed yet — it lists whatever's in the bucket.

## What you need before starting

- Your Supabase project's **URL** and **anon public key**
  (Supabase dashboard → your project → Project Settings → API)
- The exact **name of your bucket** (Storage → the bucket list)
- A free [GitHub](https://github.com) account
- A free [Vercel](https://vercel.com) account (sign up with GitHub, one click)

## Step 1 — Make sure the bucket is actually public

Supabase dashboard → **Storage** → click your bucket → **Configuration** (or
the bucket's "..." menu) → confirm **Public bucket** is switched on. If it's
private, images won't load in the gallery without extra signed-URL code.

## Step 2 — Put this code on GitHub

1. Go to github.com → **New repository** → name it e.g. `joes-book` → Create.
2. On your computer, unzip this project, then in a terminal inside the folder:
   ```bash
   git init
   git add .
   git commit -m "Joe's Book site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/joes-book.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME` with your GitHub username. GitHub will show you
   this exact command on the new repo's page too.)

   No terminal handy? GitHub also lets you drag-and-drop the unzipped folder
   into a new repo from the web UI ("uploading an existing file").

## Step 3 — Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Click **Import** next to your `joes-book` repository.
3. Before clicking Deploy, open **Environment Variables** and add:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
   | `NEXT_PUBLIC_SUPABASE_BUCKET` | your bucket's exact name |
4. Click **Deploy**. Wait about a minute.
5. You'll get a live link like `https://joes-book.vercel.app`.

## Step 4 — Test it on your phone

Open the `vercel.app` link on your phone's browser. You should see every
image in your bucket, in a grid, tap-to-enlarge with swipe-through arrows.

## Step 5 — Share it with your brothers

Just text or message them the `vercel.app` link. Anyone with the link can
view it (the bucket is public) — nobody needs an account.

Want it locked down to just people you invite instead of "anyone with the
link"? That's a follow-up step (Supabase Auth) — just ask and we'll add it.

## Adding more photos later

For now, add new photos straight from the Supabase dashboard: Storage →
your bucket → **Upload files**. The site re-lists the bucket on every page
load, so refresh the site and new pages show up automatically — no
redeploy needed.

A proper in-site uploader (so you don't have to open Supabase at all) is
the next thing to build — the `/upload` page is a placeholder for it today.

## Organizing pages so they read in order

The gallery sorts files by their full path/name. If you upload the two
halves of the book into separate folders in the bucket (e.g. `part1/` and
`part2/`), each folder's `page_001.jpg ... page_085.jpg` will sort
correctly within itself, and folders sort alphabetically too.

## Local development (optional)

```bash
npm install
cp .env.local.example .env.local   # fill in your real values
npm run dev
```
Then open http://localhost:3000.
