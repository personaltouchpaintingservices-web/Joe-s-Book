create table if not exists public.comments (
  id bigint generated always as identity primary key,
  page_path text not null,
  name text,
  message text not null check (char_length(message) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Public can read comments"
on public.comments for select
to public
using (true);

create policy "Public can add comments"
on public.comments for insert
to public
with check (char_length(message) between 1 and 1000);
