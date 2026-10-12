# EAGLE-J CONNECT / MARKET — Final review v7

## Changes in this package

- Kept the business listing detail route consistent: business cards and “Wè detay” links open `anons.html?id=<id>`.
- Improved keyboard accessibility for clickable business cards and kept buttons/links from triggering the card click twice.
- Business photo upload uses device file selection, supports local previews, and validates JPG/PNG/WebP/GIF files before upload.
- Social Media Manager image posts also use file selection and preview, then upload to Supabase Storage; video posts continue to accept a public video URL.
- Set reasonable image limits: maximum 5 photos per listing, 5 MB each, 20 MB total.
- Editing a business listing now sets its status back to `pending` so the changed listing is reviewed before becoming public again.
- Polished the Admin Dashboard styling for desktop and mobile.
- Added a direct logout fallback on the Admin page and clears the local admin marker during logout.
- Admin status filters now filter the loaded data locally, so dashboard totals do not become misleading when a status filter is selected.
- Added cache-busting versions to updated pages and scripts.

## Deployment

1. Back up the current GitHub repository before replacing files.
2. Extract this ZIP and upload the project files to the repository root (same level as `index.html`).
3. Commit/push changes and wait for GitHub Pages to publish.
4. Open the site in a private/incognito tab or clear browser cache, then test:
   - sign in and sign out;
   - create a business listing with 1–5 images;
   - open its details from the business listing card;
   - verify a new or edited listing remains pending until Admin approves it;
   - sign in as an authorized admin and approve/reject a job and a business listing.

## Supabase notes

- This ZIP does not deploy changes to Supabase automatically.
- Use the project's existing `SUPABASE-BASE-FINAL.sql` / `moderation-v7.sql` only if the matching schema/security migration has not already been installed; do not rerun unrelated setup SQL blindly.
- The Storage bucket `business-images` must exist and its policies must permit authenticated owners to upload while allowing public reads for public image URLs.
- Never place a Supabase service-role key in browser code. The key in frontend files must remain a publishable/anon key.
- Social-media publishing still depends on Supabase Edge Functions not included in this ZIP; that separate backend cannot be verified or deployed from these static files alone.

## Validation

- JavaScript syntax checked with Node.js for all project `.js` files.
- HTML files and local asset references checked after edits.
- Live GitHub Pages and Supabase behavior still needs a real sign-in/browser test after deployment; this workspace cannot deploy to those services on your behalf.
