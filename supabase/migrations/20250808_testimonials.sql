-- Testimonials feature: table, RLS, and storage bucket

-- 1) Table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_name text,
  content text,
  image_path text,
  image_alt text,
  featured boolean,
  created_by uuid references auth.users(id) on delete set null
);

-- 2) RLS
alter table public.testimonials enable row level security;

-- Read: allow anyone to read testimonials
create policy if not exists "Allow read for all" on public.testimonials
  for select using (true);

-- Insert: only authenticated users can insert; force created_by = auth.uid()
create policy if not exists "Allow insert for authenticated" on public.testimonials
  for insert with check (auth.role() = 'authenticated' and created_by = auth.uid());

-- Update/Delete: only owner can modify their rows
create policy if not exists "Allow update own" on public.testimonials
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy if not exists "Allow delete own" on public.testimonials
  for delete using (created_by = auth.uid());

-- 3) Storage: create bucket for testimonial images
insert into storage.buckets (id, name, public)
  values ('testimonials', 'testimonials', true)
  on conflict (id) do nothing;

-- Storage policies
-- Public read access to files in testimonials bucket
create policy if not exists "Public read testimonials" on storage.objects
  for select using (bucket_id = 'testimonials');

-- Only authenticated users can upload to testimonials bucket
create policy if not exists "Authenticated upload testimonials" on storage.objects
  for insert with check (bucket_id = 'testimonials' and auth.role() = 'authenticated');

-- Only owners (by path prefix user id) can update/delete their own files
-- Assuming we upload to path 'userId/filename'
create policy if not exists "Owner update testimonials" on storage.objects
  for update using (
    bucket_id = 'testimonials' and auth.role() = 'authenticated' and (position(auth.uid()::text in name) = 1)
  ) with check (
    bucket_id = 'testimonials' and auth.role() = 'authenticated' and (position(auth.uid()::text in name) = 1)
  );

create policy if not exists "Owner delete testimonials" on storage.objects
  for delete using (
    bucket_id = 'testimonials' and auth.role() = 'authenticated' and (position(auth.uid()::text in name) = 1)
  );

-- Optional: add index for recent first queries
create index if not exists testimonials_created_at_idx on public.testimonials (created_at desc);
