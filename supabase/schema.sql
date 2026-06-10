-- =====================================================================
-- NRI to USA — Community System Schema
-- Owner: Wealth Building Academy LLC
-- Run this in the Supabase SQL Editor (or `supabase db push`) BEFORE seed.sql
-- =====================================================================

-- Required extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- =====================================================================
-- 1. profiles  (one row per auth user)
-- =====================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email       text,
  avatar_url  text,
  role        text not null default 'member'
              check (role in ('member','moderator','admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =====================================================================
-- 2. community_categories
-- =====================================================================
create table if not exists public.community_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  icon        text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- 3. community_starter_profiles  (admin-controlled personas, NOT real users)
-- =====================================================================
create table if not exists public.community_starter_profiles (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  gender          text,
  label           text not null default 'Community Starter',
  short_bio       text,
  avatar_initials text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- =====================================================================
-- 4. community_posts
-- =====================================================================
create table if not exists public.community_posts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(title) between 5 and 160),
  slug               text unique not null,
  content            text not null check (char_length(content) between 10 and 20000),
  category_id        uuid references public.community_categories(id) on delete set null,
  author_id          uuid references public.profiles(id) on delete set null,
  starter_profile_id uuid references public.community_starter_profiles(id) on delete set null,
  posted_by_type     text not null default 'user'
                     check (posted_by_type in ('user','community_starter','official_admin')),
  status             text not null default 'published'
                     check (status in ('published','hidden','draft')),
  is_pinned          boolean not null default false,
  is_locked          boolean not null default false,
  views_count        integer not null default 0,
  replies_count      integer not null default 0,
  last_activity_at   timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists community_posts_category_idx on public.community_posts(category_id);
create index if not exists community_posts_activity_idx on public.community_posts(last_activity_at desc);
create index if not exists community_posts_author_idx on public.community_posts(author_id);

-- =====================================================================
-- 5. community_replies
-- =====================================================================
create table if not exists public.community_replies (
  id                 uuid primary key default gen_random_uuid(),
  post_id            uuid not null references public.community_posts(id) on delete cascade,
  content            text not null check (char_length(content) between 1 and 10000),
  author_id          uuid references public.profiles(id) on delete set null,
  starter_profile_id uuid references public.community_starter_profiles(id) on delete set null,
  posted_by_type     text not null default 'user'
                     check (posted_by_type in ('user','community_starter','official_admin')),
  parent_reply_id    uuid references public.community_replies(id) on delete cascade,
  status             text not null default 'published'
                     check (status in ('published','hidden','draft')),
  is_best_answer     boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists community_replies_post_idx on public.community_replies(post_id);

-- =====================================================================
-- 6. community_reports
-- =====================================================================
create table if not exists public.community_reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references public.community_posts(id) on delete cascade,
  reply_id    uuid references public.community_replies(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason      text,
  status      text not null default 'open'
              check (status in ('open','reviewing','resolved','dismissed')),
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- 7. saved_posts
-- =====================================================================
create table if not exists public.saved_posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

-- =====================================================================
-- Helper functions
-- =====================================================================

-- Secure admin check (SECURITY DEFINER so it can read profiles regardless of RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_moderator_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','moderator')
  );
$$;

-- Create a profile row automatically on signup (role defaults to 'member')
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generic updated_at maintenance
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists posts_touch on public.community_posts;
create trigger posts_touch before update on public.community_posts
  for each row execute function public.touch_updated_at();

drop trigger if exists replies_touch on public.community_replies;
create trigger replies_touch before update on public.community_replies
  for each row execute function public.touch_updated_at();

-- Keep posts.replies_count and last_activity_at in sync with replies
create or replace function public.sync_post_reply_stats()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.community_posts
      set replies_count = replies_count + 1,
          last_activity_at = greatest(last_activity_at, new.created_at)
      where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.community_posts
      set replies_count = greatest(replies_count - 1, 0)
      where id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists replies_sync_stats on public.community_replies;
create trigger replies_sync_stats
  after insert or delete on public.community_replies
  for each row execute function public.sync_post_reply_stats();

-- Public, column-limited view of profiles for showing author display names.
-- security_invoker is OFF (default) so it bypasses the profiles RLS and exposes
-- ONLY these non-sensitive columns publicly (email stays private).
create or replace view public.public_profiles as
  select id, display_name, role, avatar_url from public.profiles;

grant select on public.public_profiles to anon, authenticated;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles                   enable row level security;
alter table public.community_categories       enable row level security;
alter table public.community_starter_profiles enable row level security;
alter table public.community_posts            enable row level security;
alter table public.community_replies          enable row level security;
alter table public.community_reports          enable row level security;
alter table public.saved_posts                enable row level security;

-- ---- profiles ----
drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- community_categories ----
drop policy if exists categories_select_active on public.community_categories;
create policy categories_select_active on public.community_categories
  for select using (is_active or public.is_admin());

drop policy if exists categories_admin_all on public.community_categories;
create policy categories_admin_all on public.community_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- community_starter_profiles ----
drop policy if exists starters_select_active on public.community_starter_profiles;
create policy starters_select_active on public.community_starter_profiles
  for select using (is_active or public.is_admin());

drop policy if exists starters_admin_all on public.community_starter_profiles;
create policy starters_admin_all on public.community_starter_profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- community_posts ----
drop policy if exists posts_select_published on public.community_posts;
create policy posts_select_published on public.community_posts
  for select using (
    status = 'published' or author_id = auth.uid() or public.is_admin()
  );

-- Logged-in users may create posts only as themselves (never as a starter/official)
drop policy if exists posts_insert_self on public.community_posts;
create policy posts_insert_self on public.community_posts
  for insert with check (
    auth.uid() = author_id
    and posted_by_type = 'user'
    and starter_profile_id is null
  );

-- Users edit/delete only their own posts, and only if not locked
drop policy if exists posts_update_own on public.community_posts;
create policy posts_update_own on public.community_posts
  for update using (auth.uid() = author_id and is_locked = false)
  with check (auth.uid() = author_id);

drop policy if exists posts_delete_own on public.community_posts;
create policy posts_delete_own on public.community_posts
  for delete using (auth.uid() = author_id and is_locked = false);

-- Admins: full control (pin, lock, hide, edit, delete, post as starter/official)
drop policy if exists posts_admin_all on public.community_posts;
create policy posts_admin_all on public.community_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- community_replies ----
drop policy if exists replies_select_published on public.community_replies;
create policy replies_select_published on public.community_replies
  for select using (
    status = 'published' or author_id = auth.uid() or public.is_admin()
  );

drop policy if exists replies_insert_self on public.community_replies;
create policy replies_insert_self on public.community_replies
  for insert with check (
    auth.uid() = author_id
    and posted_by_type = 'user'
    and starter_profile_id is null
    -- cannot reply on a locked post
    and not exists (
      select 1 from public.community_posts p
      where p.id = post_id and p.is_locked = true
    )
  );

drop policy if exists replies_update_own on public.community_replies;
create policy replies_update_own on public.community_replies
  for update using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists replies_delete_own on public.community_replies;
create policy replies_delete_own on public.community_replies
  for delete using (auth.uid() = author_id);

drop policy if exists replies_admin_all on public.community_replies;
create policy replies_admin_all on public.community_replies
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- community_reports ----
drop policy if exists reports_insert_self on public.community_reports;
create policy reports_insert_self on public.community_reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists reports_select_own_or_mod on public.community_reports;
create policy reports_select_own_or_mod on public.community_reports
  for select using (auth.uid() = reporter_id or public.is_moderator_or_admin());

drop policy if exists reports_manage_mod on public.community_reports;
create policy reports_manage_mod on public.community_reports
  for update using (public.is_moderator_or_admin()) with check (public.is_moderator_or_admin());

drop policy if exists reports_admin_delete on public.community_reports;
create policy reports_admin_delete on public.community_reports
  for delete using (public.is_admin());

-- ---- saved_posts ----
drop policy if exists saved_select_own on public.saved_posts;
create policy saved_select_own on public.saved_posts
  for select using (auth.uid() = user_id);

drop policy if exists saved_insert_own on public.saved_posts;
create policy saved_insert_own on public.saved_posts
  for insert with check (auth.uid() = user_id);

drop policy if exists saved_delete_own on public.saved_posts;
create policy saved_delete_own on public.saved_posts
  for delete using (auth.uid() = user_id);

-- Allow the views_count increment by anyone (best-effort) via RPC below.
create or replace function public.increment_post_views(p_slug text)
returns void language sql security definer set search_path = public as $$
  update public.community_posts set views_count = views_count + 1 where slug = p_slug and status = 'published';
$$;
grant execute on function public.increment_post_views(text) to anon, authenticated;

-- =====================================================================
-- Done. Next: run supabase/seed.sql
-- =====================================================================
