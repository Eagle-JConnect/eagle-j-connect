# Eagle-J Connect — Final local audit

Date: 2026-10-12

## Corrections included
- Public jobs and business listings use the unauthenticated public-read helper rather than attaching a stale logged-in bearer token.
- Public listing request errors show the actual HTTP/status message instead of silently looking like an empty listing page.
- Homepage statistics query approved public jobs/businesses and the privacy-limited `public_member_profiles` view; unavailable counts display `—` instead of a false zero.
- Login no longer deletes a valid Supabase Auth session when the profile lookup or admin lookup fails. It displays a diagnostic message instead; a confirmed inactive account still gets signed out.
- Admin verification distinguishes a confirmed non-admin from a failed request, avoiding a silent redirect to the normal dashboard when the admin check cannot run.
- Editing a listing sends it back to pending review (database migration) so owners can edit approved listings without being able to approve their own edits.
- Listing form supports up to 50 images, with each image limited to 5 MB and total selected images limited to 100 MB. It stores the first image in `image_url` and the full image URL list in `image_urls`; listing detail pages show a responsive gallery with click-to-enlarge.
- SQL migration creates the optional `business_images` table if missing and configures the `business-images` storage bucket for image files up to 100 MB per object.
- Cache keys standardized and bumped across all local JavaScript/CSS references so GitHub Pages is less likely to serve mixed older assets.
- First-visit language now defaults to English when no language preference is saved; previously saved language choices remain respected.
- Removed an embedded old ZIP and malformed duplicate member-directory HTML files.

## Local checks performed
- `node --check` passed for all 8 JavaScript files.
- Rechecked all 20 HTML pages for missing local assets/links and duplicate IDs; no missing local references or duplicate IDs were found.
- Static HTML asset check passed for all 20 HTML pages; no missing local references were found.
- ZIP integrity checked after packaging.

## Important live-test limits
- This environment cannot run SQL against the user's Supabase project or sign in to their account.
- Therefore public RLS visibility, existing row ownership/status values, storage settings, OAuth provider configuration, and live admin permissions still need verification after the SQL is reviewed/applied.
- The optional Social Media Manager still requires deployed Supabase Edge Functions and Meta/TikTok/YouTube provider secrets; provider secrets must never be added to browser JavaScript or GitHub Pages.
