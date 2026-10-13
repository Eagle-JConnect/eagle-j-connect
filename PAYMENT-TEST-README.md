EAGLE-J CONNECT — PAYMENT TEST BUNDLE
======================================

Purpose
-------
This package adds a test-only page and SQL setup for creating a transaction that
stays in `pending`. It does not connect to PayPal or Paddle, charge money, mark a
transaction successful, or activate a subscription.

Files
-----
- payment-test.html: browser page to create and list your own test transactions.
- PAYMENT-TEST-SETUP.sql: idempotent setup for the test column, disabled test plan,
  authenticated test RPC, and read-own RLS policy.
- Eagle-J-Connect-Payment-Foundation.sql: initial five-table payment schema reference.
- PAYMENT-TEST-INSTRUCTIONS.txt: short install/test steps.

Important note about the SQL Editor
----------------------------------
Supabase SQL Editor has no end-user JWT by default, so `auth.uid()` and `auth.role()`
can be NULL there. Run the SQL setup in SQL Editor, but create a test transaction by
signing into Eagle-J Connect and clicking the button on payment-test.html.

Install
-------
1. Back up the current GitHub repository before replacing files.
2. Unzip this package and open the `eagle/` folder.
3. Upload `payment-test.html` to the root of the existing GitHub Pages repository,
   beside `index.html`, `login.html`, `script.js`, and `style.css`.
4. In Supabase SQL Editor, run PAYMENT-TEST-SETUP.sql once. Do NOT re-run the entire
   original base migration just to set up the test page.
5. Confirm the final verification query returns true for all three columns.
6. Deploy the new file to GitHub Pages.
7. Sign into Eagle-J Connect in the same browser, then visit:
   https://eagle-jconnect.github.io/eagle-j-connect/payment-test.html
8. Click “Kreye tranzaksyon tès”. It should return an ID and leave status as pending.
9. Click “Verifye tranzaksyon mwen yo” to list your own test transactions.

If you see “You must be signed in”
---------------------------------
The page could not find the expected local login token, or the JWT is no longer valid.
Sign in again on the site and reopen the test page. Do not remove the auth.uid() check.
The page expects these localStorage keys, already used by the project's script.js:
- supabase_access_token
- supabase_user_id

If you see permission denied / HTTP 401 / HTTP 403
--------------------------------------------------
Check that you ran PAYMENT-TEST-SETUP.sql in the same Supabase project used by the site,
and that the account is signed in. Do not grant browser INSERT/UPDATE on payment records.

Security
--------
- Never place a Supabase service-role key in HTML/JavaScript or GitHub Pages.
- The browser can create only a pending test record via a function that checks auth.uid().
- Browser users cannot change status to succeeded through this test page.
- `test_mode = true` identifies test records; $1.00 is metadata for testing only, not a charge.
- This package is not production checkout and has no payment-provider/webhook integration.
