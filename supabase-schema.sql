-- ==========================================
-- FENORA TECHNOLOGIES: PROJECT MANAGEMENT SYSTEM
-- SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- ==========================================

-- 1. Create Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  business_problem text,
  technical_solution text,
  business_outcome text,
  category text,
  tech_stack text[] default '{}',
  metrics jsonb default '[]'::jsonb,
  cover_image text,
  gallery_images text[] default '{}',
  project_url text,
  github_url text,
  client_name text,
  industry text,
  start_date text,
  completion_date text,
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  "order" integer default 0,
  color text default 'from-primary to-accent',
  image_accent text default 'rgba(0, 102, 255, 0.2)',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) on Projects
alter table public.projects enable row level security;

-- 3. Projects Access Control Policies
-- Policy 3a: Allow public read-only access to published projects (anonymous website users)
create policy "Allow public read access to published projects"
  on public.projects for select
  using (status = 'published');

-- Policy 3b: Allow authenticated admins full transactional permissions
create policy "Allow all access to authenticated admins"
  on public.projects for all
  using (auth.role() = 'authenticated');


-- 4. Supabase Storage Configuration for "project-images"
-- Note: Create a public storage bucket named "project-images" before executing these rules.

-- Allow public read access to uploaded images
create policy "Allow public read access to images"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Allow authenticated admins to upload and write images
create policy "Allow admins to upload image assets"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- Allow authenticated admins to update/delete image assets
create policy "Allow admins to edit/delete image assets"
  on storage.objects for update
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Allow admins to remove image assets"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');
