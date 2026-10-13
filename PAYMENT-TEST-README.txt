EAGLE-J CONNECT — PAYMENT TEST PAGE

New file: payment-test.html

Purpose:
- Calls the existing create_ejc_test_payment() RPC using the signed-in user's existing access token.
- Lists only that user's test_mode=true transactions through the existing RLS policy.
- Does not connect to PayPal/Paddle, does not charge money, and does not mark a transaction paid.

How to use after uploading this project to GitHub Pages:
1. Sign in to Eagle-J Connect in the same browser.
2. Open payment-test.html on the deployed site.
3. Tap “Kreye tranzaksyon tès”.
4. Confirm that the row appears with status pending and test_mode=true.

Important:
- The database migration already needs to have added payment_transactions.test_mode and the create_ejc_test_payment() function.
- The page deliberately does not implement any payment-success action.
- This file is not added to the site's main navigation.
