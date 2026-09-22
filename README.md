# Eagle-J Connect — Final Web Version

Eagle-J Connect is a responsive marketplace/job platform for the Haiti + Bahamas community.

## What was improved

- Professional, consistent visual system across the site.
- Responsive mobile navigation and layout.
- Redesigned homepage with clear calls-to-action, stats, services and steps.
- Professional marketplace cards with search, location and category filters.
- Business/service detail pages with phone and WhatsApp actions.
- Job search UI with responsive cards and filters.
- Registration/login/profile/employer pages kept connected to Supabase.
- Fixed the broken/incomplete `script.js`.
- Added complete business listing loading, filtering, creation and detail logic.
- Business listing type is stored in the existing `category` field as `type:category`, so no schema migration is required.
- Image upload remains connected to the `business-images` Supabase bucket.
- Added accessibility improvements to navigation, buttons and cards.
- Added cache-busting `?v=final6` to frontend assets.
- Added the missing public jobs loader/filter renderer so `travay.html` now reads and displays rows from Supabase `jobs`.
- Added `jobs-rls-fix.sql` for public job reads and employer-owned job writes.
- Removed the problematic `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY` from the business SQL migration; Supabase Storage already manages that table.
- Fixed the public users directory to use the project's existing HTML escaping helper.
- Standardized the main navigation with an **Anons** link and added translations for it.

## Deployment

Upload the contents of this project to the GitHub Pages repository used by:

`https://eagle-jconnect.github.io/eagle-j-connect/`

The frontend expects the existing Supabase project and the `businesses`, `jobs`, `profiles` and `admin_users` tables/policies already used by the project.

### Important Supabase setup

If the project is being deployed to a fresh database, run the included SQL setup files as appropriate:

- `admin-setup.sql`
- `admin-rls-fix.sql`
- `admin-profile-email-fix.sql`

Do not expose a Supabase service-role key in the browser. The project uses the existing publishable key.

## Main pages

- `index.html` — homepage
- `travay.html` — jobs
- `biznis.html` — marketplace
- `anons-list.html` — all listings
- `anons.html` — listing detail
- `kreye-anons.html` — create listing
- `enskri.html` — registration
- `login.html` — login
- `dashboard.html` — user profile
- `employer.html` — employer area
- `kontak.html` — contact
- `admin.html` — admin dashboard


## Final 2026 navigation fixes
- One shared professional navigation shell across every page.
- One mobile-menu controller (`menu.js`) to prevent double-toggle conflicts.
- Login/logout navigation state is synchronized automatically.
- Admin link appears only for verified admin users.
- Business detail links and marketplace filters are wired consistently.
- Haiti/Haiti and Bahamas/Nassau location aliases are supported by marketplace filtering.

## Supabase business publishing fix

Run `business-rls-fix.sql` once in the Supabase SQL Editor. It:
- adds `businesses.user_id` when missing;
- allows public reads;
- allows authenticated users to create, edit and delete only their own ads;
- ensures the `business-images` public bucket exists;
- adds secure storage policies for upload/update/delete.

The frontend now sends the signed-in user's UUID as `user_id` when publishing an ad.


FINAL v5: hardened Supabase business creation session handling and explicit Authorization on business INSERT.


## v6 review / fixes

The project was reviewed page-by-page and the main runtime issues found were corrected:

1. **Jobs page:** `travay.html` was calling `loadJobs()` and `renderJobs()` even though those functions were missing. They are now implemented in `script.js`.
2. **Jobs filtering:** search and job-type filtering now operate on the loaded Supabase rows.
3. **Empty/error states:** the jobs page now clearly distinguishes between no jobs and a loading/API error.
4. **Users directory:** fixed an undefined `escapeHtml()` call by using the existing `esc()` helper.
5. **Navigation:** added the Anons link consistently to the main navigation where applicable and added HT/EN/FR translations.
6. **Supabase jobs security:** added `jobs-rls-fix.sql` without changing Storage ownership/RLS settings.
7. **Browser cache:** frontend references now use `final6` so old JavaScript is less likely to remain cached.

### Supabase action for jobs

If the Jobs page still shows an API/RLS error after uploading this version, run `jobs-rls-fix.sql` in the Supabase SQL Editor. The frontend itself is now wired to the `jobs` table.


## v7 — Admin moderation and publishing control

- New jobs and marketplace ads are created as `pending`.
- Only an administrator can change them to `approved`, making them public.
- Admin can reject, mark unavailable, or delete jobs and business ads.
- Existing jobs/business ads remain approved when the migration is first run.
- Admin can disable users or remove their profile from the site.
- Disabled/removed profiles cannot be used by the frontend login flow.
- Public jobs/business ads are hidden when the owner's profile is disabled.
- Added `moderation-v7.sql` for the complete Supabase RLS/status migration.
- `admin.html` / `admin.js` now provide moderation queues and user management.

Run `moderation-v7.sql` in Supabase SQL Editor before testing v7.
