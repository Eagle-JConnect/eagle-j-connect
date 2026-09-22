# Eagle-J Connect — Project Review v6

## Fixed
- Missing `loadJobs()` / `renderJobs()` functions causing `travay.html` to remain on “Ap chaje travay yo...”.
- Job search and job-type filter wiring.
- Job empty/error/loading states.
- Undefined `escapeHtml()` in the users directory.
- Main navigation cache version bumped to `final6`.
- Added Anons navigation label translations in Kreyòl, English and French.
- Removed the `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY` statement from the business RLS migration because it can fail with `must be owner of table objects` in Supabase.
- Added `jobs-rls-fix.sql` for public job reads and employer-owned job writes.

## Reviewed
- Local HTML links: no broken `.html` hrefs found.
- JavaScript syntax: `script.js`, `menu.js`, `language.js`, and `admin.js` pass Node syntax checks.
- Job posting form IDs match the JavaScript handler.
- Business listing/create/detail pages are connected to the existing Supabase API code.
- User dashboard/employer dashboard initialization is present.

## Remaining external dependency
The live Supabase database must contain the expected `jobs` table and allow public SELECT according to its RLS/grants. The included `jobs-rls-fix.sql` addresses the policy layer; it cannot create a missing table or infer an unknown custom schema.


# v7 Moderation Upgrade

## New workflow
1. User registers.
2. Employer creates a job -> `pending`.
3. User creates a business/service ad -> `pending`.
4. Admin reviews it in `admin.html`.
5. Admin chooses Approve / Reject / Unavailable / Delete.
6. Only `approved` records appear on public Jobs/Business pages.

## User management
- Admin can disable an account.
- Admin can reactivate an account.
- Admin can remove the user's profile from the site.
- The frontend does not expose a service-role key.

## Required Supabase action
Run `moderation-v7.sql` once in Supabase SQL Editor, then upload the v7 frontend files to GitHub Pages.
