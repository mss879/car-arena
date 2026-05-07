-- Web analytics table to track page visits
create table if not exists public.web_analytics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  path text,
  referrer text,
  country text,
  region text,
  city text,
  user_agent text,
  screen_width int,
  screen_height int
);

alter table public.web_analytics enable row level security;

-- Allow anonymous inserts so the public site can log visits
drop policy if exists "Allow anon insert" on public.web_analytics;
create policy "Allow anon insert"
on public.web_analytics
for insert
to anon
with check (true);

-- Only authenticated users (e.g., admins) can read analytics
drop policy if exists "Allow authenticated read" on public.web_analytics;
create policy "Allow authenticated read"
on public.web_analytics
for select
to authenticated
using (true);

create index if not exists web_analytics_created_at_idx on public.web_analytics(created_at);
create index if not exists web_analytics_country_idx on public.web_analytics(country);
