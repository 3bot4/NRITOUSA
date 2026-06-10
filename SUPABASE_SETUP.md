# NRI to USA — Community System Setup (Supabase)

This guide gets the community system running locally and on Vercel. The website
builds and runs **without** Supabase (community pages show empty states), but
auth, posting, and the admin dashboard need a Supabase project.

> Trust note: the 50 "Community Starter" profiles are **admin-controlled personas**,
> not real independent users. They are always labeled **"Community Starter"** in
> public, and official team posts are labeled **"NRI to USA Team · Official."**
> Never present starter profiles as independent real members.

---

## 1. Environment variables

Copy `.env.local.example` to `.env.local` and fill in values from your Supabase
project → **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
```

- `NEXT_PUBLIC_*` values are safe in the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only**. It is read only inside
  `src/lib/supabase/admin.ts`, which imports `server-only` so it can never be
  bundled into client code. Never log it or expose it.
- `.env.local` and `.env` are already in `.gitignore` — **do not commit secrets.**

---

## 2. SQL files to run

In the Supabase dashboard → **SQL Editor**, run these in order:

1. **`supabase/schema.sql`** — creates all 7 tables, the `is_admin()` /
   `is_moderator_or_admin()` helpers, the signup trigger, stats triggers, the
   `public_profiles` view, the `increment_post_views` RPC, and all RLS policies.
2. **`supabase/seed.sql`** — inserts 13 categories, 50 Community Starter
   profiles, 60+ starter posts, and 100+ starter replies (dates spread across
   several months). Safe to re-run; categories/starters use `on conflict do nothing`.

(Or, with the Supabase CLI: `supabase db push` / run the files via `psql`.)

---

## 3. Create your first admin user

There is **no hardcoded admin password.** You sign up like any user, then
promote yourself in SQL.

1. Start the app (`npm run dev`) and go to **`/signup`**.
2. Create an account with your real admin email + a password.
3. If email confirmation is enabled in Supabase (Auth → Providers → Email),
   confirm via the email link. (For quick local testing you can disable
   "Confirm email" in Supabase Auth settings.)

The signup trigger automatically inserts a `profiles` row with `role = 'member'`.

---

## 4. Set role = 'admin'

In Supabase → **SQL Editor**, run (replace with your real email):

```sql
update profiles
set role = 'admin'
where email = 'MY_ADMIN_EMAIL_HERE';
```

Allowed roles: `member`, `moderator`, `admin`. Log out and back in so the new
role is picked up.

---

## 5. Seed categories

Categories are included in `supabase/seed.sql` (step 2). To verify, open
**`/admin/community/categories`** — you should see 13 active categories. You can
also add/edit categories from that page.

---

## 6. Seed starter profiles

The 50 Community Starter profiles are included in `supabase/seed.sql`. Verify at
**`/admin/community/starter-profiles`** — you should see 50 profiles, each shown
with the "Community Starter" label, plus per-profile post/reply counts. You can
edit name/initials/bio/label and enable/disable any profile there.

---

## 7. Seed starter posts / replies

Also included in `supabase/seed.sql` (60+ posts, 100+ replies across all
categories, with realistic spread-out dates). Verify at **`/admin`** (dashboard
counts) and **`/community`**.

To add more after launch:
- Use **`/admin/community`** → "Create post" → choose **Community Starter** and
  pick a profile (saved as `posted_by_type = 'community_starter'`), or post as
  **Official** (`posted_by_type = 'official_admin'`).
- Or re-run a customized seed file.

---

## 8. Test login

1. Go to **`/login`**, sign in with your account.
2. You should be redirected to `/community`. The navbar account/admin links work
   once logged in.
3. Visit **`/account`** to see your display name, email, your posts, and saved
   posts, plus a **Log out** button.

---

## 9. Test the admin dashboard

1. While logged in as an admin, go to **`/admin`**.
2. You should see totals: posts, replies, members, categories, open reports,
   posts this week, replies this week, and most active categories.
3. Non-admins who visit `/admin` see **Access Denied**; logged-out visitors are
   redirected to `/login`. (Protection is enforced server-side in
   `src/app/admin/layout.tsx` and again in each admin page.)

---

## 10. Test posting as a Community Starter

1. Go to **`/admin/community`** (Create post).
2. Choose **"Community Starter profile"**, pick a profile (e.g. *Priya*),
   fill in a title/category/content, and publish.
3. Open the post on **`/community/post/...`** — the author must read
   **"Priya · Community Starter"**. Official posts read **"NRI to USA Team · Official."**
4. On any post as admin, you can **pin, lock, hide, delete, mark best answer**,
   and reply as Official / a Starter / your own admin account.

To confirm trust rules: log in as a normal member and try to post — you can only
post as yourself (`posted_by_type = 'user'`). RLS prevents members from posting
as starter/official profiles.

---

## 11. Deploy on Vercel

1. Push the repo to GitHub and import it into Vercel.
2. In Vercel → **Project → Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as **sensitive**; do not expose to client)
3. In Supabase → **Auth → URL Configuration**, set the **Site URL** to your
   production domain (`https://www.nritousa.com`) and add it to redirect URLs.
4. Deploy. Run `schema.sql` + `seed.sql` against your production Supabase project
   if you haven't already.
5. Promote your production admin account with the SQL in step 4.

---

## Security checklist (already implemented)

- Service role key is server-only (`server-only` import) and never sent to the browser.
- Admin routes are protected **server-side** (layout + per-page guard), not just in the UI.
- Row Level Security is enabled on every table with least-privilege policies.
- Members cannot post as starter/official profiles (enforced by RLS `with check`).
- Members can only edit/delete their own non-locked posts/replies.
- `/admin/` (and private community routes) are disallowed in `robots.txt`.
- Profile emails are kept private; public author display uses the
  `public_profiles` view (id, display_name, role, avatar only).

## Routes reference

**Public:** `/community`, `/community/categories/[slug]`, `/community/post/[slug]`,
`/community/new`, `/community/my-posts`, `/community/saved`, `/community/rules`
**Auth:** `/login`, `/signup`, `/account`
**Admin (admins only):** `/admin`, `/admin/community`, `/admin/community/posts`,
`/admin/community/replies`, `/admin/community/starter-profiles`,
`/admin/community/categories`, `/admin/community/reports`,
`/admin/community/seed`, `/admin/community/settings`
