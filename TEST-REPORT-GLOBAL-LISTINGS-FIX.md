# Eagle-J Connect — test and correction report

## Corrections applied in this ZIP
- Listing cards keep a direct `anons.html?id=...` details link.
- Detail pages now allow the signed-in owner to view their own unpublished listing from their profile, while the public query still only exposes approved listings. The owner fallback is restricted by both listing ID and the current user's ID.
- Legacy business rows whose `category` contains only a category (for example `restaurant`) remain visible in the general Business filter instead of disappearing because they lack a `type:category` prefix.
- Profile image lookup accepts additional common profile image fields (`profile_picture`, `avatar`, `image_url`) as well as Auth metadata.
- Statistics now show `—` and log a warning if the count cannot be read, rather than presenting a failed request as a real zero.
- HTML asset query versions were bumped to force browsers to request the corrected JavaScript/CSS.

## Tests run locally
- ZIP archive integrity checked.
- JavaScript syntax checked with Node.js (`node --check`) for each JavaScript file.
- HTML local references and required listing/profile/form element IDs checked with a static test.

## Limits
This environment cannot reach the live GitHub Pages or Supabase hosts, so a real authenticated database test and live-browser interaction test could not be completed here. No Supabase data or SQL policies were changed. Public listing visibility still requires the row to have `status = 'approved'` and a suitable Supabase SELECT policy.
