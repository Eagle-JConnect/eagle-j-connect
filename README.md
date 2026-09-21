# Eagle-J Connect Bahamas + Ayiti

Marketplace update: the Business page now acts as a marketplace for employees, employers, professionals, services, businesses and property/goods. Existing database structure is preserved; listing type is encoded inside the existing `category` field so no database migration is required.


## Fix Marketplace 2026-09-21
- Fixed Supabase insert error caused by sending a non-existent `listing_type` column to the `businesses` table.
- Listing type is stored inside the existing `category` value (for example `service:cleaning`), so no database schema change is required.
- Added employee listing type to the create-anons form.

ADMIN DASHBOARD
- Open admin.html after signing in.
- Run admin-setup.sql in Supabase SQL Editor first.
- Add only your own Auth user UUID to public.admin_users.
- The dashboard reads and updates profiles only for verified admin users.
- This browser dashboard does not delete auth.users; that requires a trusted backend/service-role function.
