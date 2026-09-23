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
- Duplicate malformed member-directory HTML files removed; `itilizate.html` is the canonical page.
- Nested outdated ZIP removed from the deployable project.
- Frontend cache-busting updated to `global1`.
- Homepage SEO title and description updated for global positioning.
- Marketplace location filtering changed from hard-coded country aliases to generic global location search.
- English is now the default language while English/French/Creole remain available.
- Hard-coded administrator UUID was removed from the RLS fix migrations.
- No Supabase service-role/secret key is included in the frontend.
- Existing Supabase publishable key remains in the browser, which is expected for a Supabase public client; database security must be enforced by RLS.
- Existing moderation workflow is preserved: new jobs/listings are pending until approved by an administrator.

## Supabase

The frontend expects the existing Supabase project and tables used by the application:
- `profiles`
- `jobs`
- `businesses`
- `admin_users`

For a new or repaired database, review and run the appropriate SQL migrations in the Supabase SQL Editor.

Important:
1. Do not put a Supabase service-role/secret key in frontend JavaScript.
2. Add your own administrator UUID manually to `public.admin_users`.
3. Review RLS policies before production deployment.
4. Test registration, login, job creation, listing creation, image upload, moderation, and logout after deployment.

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
