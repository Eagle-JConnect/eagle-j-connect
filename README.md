# Eagle-J Connect
Ayiti + Bahamas — jobs, business listings and community connections.

## Main features
- Kreyòl / English / Français interface
- Supabase registration and login
- Job seeker and employer accounts
- Employer job posting and own-job dashboard
- Public job search and contact via phone/WhatsApp
- Business listings with one optional image
- Responsive mobile layout
- Homepage live counts from Supabase when public read policies allow them

## Supabase tables expected
`profiles`, `jobs`, `businesses` and storage bucket `business-images`.

The site uses the Supabase publishable key in the browser. Database/storage Row Level Security policies should remain enabled.


## Fixed in this version
- Unified the Biznis page with the site's responsive mobile hamburger menu.
- Connected the Biznis page to the Supabase business listings loader.
- Added the missing `anons.html` business-detail page used by business cards.
- Added business-detail loading from `?id=...`.
- Added responsive business-detail image/card styling.


## Fix konfimasyon imèl
Enskripsyon an voye `email_redirect_to` sou `login.html` nan menm GitHub Pages path la. Nan Supabase Dashboard > Authentication > URL Configuration, ajoute URL GitHub Pages login lan nan Redirect URLs: `https://eagle-jconnect.github.io/eagle-j-connect/login.html`.
