-- Eagle-J Connect: secure admin setup for Supabase
-- Run this once in Supabase SQL Editor.
-- IMPORTANT: After creating the table, insert ONLY your own user id as admin.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Admins can see the admin list. A user can see only their own admin row.
create policy "admin_users_select_self_or_admin"
on public.admin_users for select
using (
  auth.uid() = user_id
  or exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

-- Prevent normal browser users from inserting themselves as admins.
-- Do NOT create an INSERT policy for authenticated users.

-- Profiles: admins can read and update all profiles.
-- Keep your existing policies for normal users; add these policies if RLS is enabled.
alter table public.profiles enable row level security;

create policy "admins_select_all_profiles"
on public.profiles for select
using (
  auth.uid() = id
  or exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

create policy "admins_update_all_profiles"
on public.profiles for update
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- To make YOUR account an administrator, first get your Auth user UUID
-- from Supabase Dashboard -> Authentication -> Users, then run:
insert into public.admin_users(user_id) values ('9b134154-a1b6-4d1a-a91a-dcd8f139d7ff') on conflict (user_id) do nothing;
