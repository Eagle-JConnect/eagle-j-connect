# Eagle-J Connect — Global Web Platform

Eagle-J Connect is a global responsive platform for jobs, businesses, services, listings, networking, and opportunities.

## Global positioning

The website is designed to work worldwide. Country names are not part of the brand identity.

Location is treated as data entered or searched by the user:
- Worldwide
- Remote
- Country
- City
- Region
- Neighborhood
- Postal code

The marketplace no longer contains hard-coded country location filters.

## Main pages

- `index.html` — global homepage
- `search.html` — global search/discovery
- `travay.html` — jobs
- `biznis.html` — businesses and services
- `anons-list.html` — all listings
- `anons.html` — listing details
- `kreye-anons.html` — create a listing
- `enskri.html` — registration
- `login.html` — login
- `dashboard.html` — member dashboard
- `job-seeker.html` — job seeker area
- `employer.html` — employer area
- `poste-travay.html` — post a job
- `profil.html` — profile
- `itilizate.html` — public member directory
- `kontak.html` — contact
- `admin.html` — admin dashboard

## Technical audit completed

- JavaScript syntax checked with Node.js.
- Local HTML/CSS/JS references checked for missing files.
- Inline event-handler function names checked against project JavaScript.
- Added the missing `itilizate.html` public member directory referenced by the homepage.
- Nested outdated ZIP removed from the deployable project.
- Frontend cache-busting updated to `final20261009`.
- Homepage SEO title and description updated for global positioning.
- Marketplace location filtering changed from hard-coded country aliases to generic global location search.
- English is now the default language while English/French/Creole remain available.
- The canonical SQL explicitly grants administrator access to the verified project-owner Auth UUID; change it before reusing the migration in another project.
- No Supabase service-role/secret key is included in the frontend.
- Existing Supabase publishable key remains in the browser, which is expected for a Supabase public client; database security must be enforced by RLS.
- Existing moderation workflow is preserved: new jobs/listings are pending until approved by an administrator.

## Supabase

The frontend expects the existing Supabase project and tables used by the application:
- `profiles`
- `jobs`
- `businesses`
- `admin_users`

For this project, use **`SUPABASE-BASE-FINAL.sql` as the canonical database migration**. It replaces conflicting core-table policies, fixes the `admin_users` recursion, creates profiles automatically for new Auth users, keeps existing approved listings visible, enforces pending moderation for new jobs/listings, and adds a privacy-limited public member view.

**Do not run the older root-level SQL migration files after the canonical migration.** They are historical compatibility files and some define overlapping policies. If you already ran one or more old migrations, run `SUPABASE-BASE-FINAL.sql` once to normalize the core policy set.

Important:
1. Never put a Supabase service-role/secret key in frontend JavaScript.
2. This migration grants admin access to the verified Auth UUID for Judes Versanne (`9b134154-a1b6-4d1a-a91a-dcd8f139d7ff`). Change that UUID before reusing the SQL for a different project.
3. Social platform publishing still requires enabling each provider and adding its OAuth credentials/secrets in Supabase Edge Function settings. The frontend cannot create those provider credentials automatically.
4. After deployment, test registration (including email confirmation), login, Google login if configured, job creation, listing creation, image upload, admin moderation, member directory, and logout.

## Deployment

Upload the contents of this folder to the GitHub Pages repository used by the project.

After deployment, test:
1. Homepage loads without console errors.
2. Mobile navigation opens/closes correctly.
3. Language selector works.
4. Jobs can be searched and filtered.
5. Listings can be searched and filtered by any location.
6. Authenticated users can create listings/jobs.
7. New listings/jobs remain pending until moderation.
8. Approved content appears publicly.
9. Admin-only functions remain protected by Supabase RLS.
10. Image uploads work only for authenticated owners.

## Project identity

**Eagle-J Connect**

**Connect • Discover • Grow**

Suggested global positioning:

> Your World. Your Network. Your Opportunities.

The platform can serve local and international users without making any single country the identity of the brand.

## Social Media Manager
See `SOCIAL-MEDIA-SETUP.md` for the social integration status, required provider secrets, and deployment steps. The social module is not fully active until the external OAuth credentials and Edge Functions are configured.

## Profile photos and privacy
`SUPABASE-BASE-FINAL.sql` includes the profile image and visibility columns, the profile update policy, and the public member view. Profile photos are stored in the `business-images` bucket under `profile-avatars/<user-id>/`.

## Deployment instructions
Use `DEPLOY-FINAL.txt` for the step-by-step deployment and test checklist. Run only `SUPABASE-BASE-FINAL.sql` as the canonical core migration; the other root SQL files are retained for historical reference and should not be run after it.
