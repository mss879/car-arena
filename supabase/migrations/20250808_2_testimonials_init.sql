-- Testimonials initial schema (no IF NOT EXISTS)

-- 1) Table
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_name text,
  content text,
  image_path text,
  image_alt text,
  featured boolean,
  created_by uuid references auth.users(id) on delete set null
);

-- 2) Row Level Security (RLS)
alter table public.testimonials enable row level security;

-- Public read access
create policy "Allow read for all" on public.testimonials
  for select using (true);

-- Insert limited to authenticated users; require created_by = auth.uid()
create policy "Allow insert for authenticated" on public.testimonials
  for insert with check (auth.role() = 'authenticated' and created_by = auth.uid());

-- Only owners can update/delete their rows
create policy "Allow update own" on public.testimonials
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "Allow delete own" on public.testimonials
  for delete using (created_by = auth.uid());

-- 3) Storage: public bucket for testimonial images
insert into storage.buckets (id, name, public)
  values ('testimonials', 'testimonials', true);

-- Storage policies
-- Public read access to files in testimonials bucket
create policy "Public read testimonials" on storage.objects
  for select using (bucket_id = 'testimonials');

-- Only authenticated users can upload to testimonials bucket
create policy "Authenticated upload testimonials" on storage.objects
  for insert with check (bucket_id = 'testimonials' and auth.role() = 'authenticated');

-- Only owners (by path prefix user id) can update/delete their own files
-- Path format used by the app: '<userId>/<timestamp>-<filename>'
create policy "Owner update testimonials" on storage.objects
  for update using (
    bucket_id = 'testimonials' and auth.role() = 'authenticated' and split_part(name, '/', 1) = auth.uid()::text
  ) with check (
    bucket_id = 'testimonials' and auth.role() = 'authenticated' and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "Owner delete testimonials" on storage.objects
  for delete using (
    bucket_id = 'testimonials' and auth.role() = 'authenticated' and split_part(name, '/', 1) = auth.uid()::text
  );

-- Optional: index for recent-first queries
create index testimonials_created_at_idx on public.testimonials (created_at desc);
