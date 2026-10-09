# Eagle-J Connect — Social Media setup

This module is a staged integration. The current backend implements the Meta OAuth connection flow for Facebook Pages and detects a linked Instagram Business account. WhatsApp creates a share link. TikTok, YouTube, and automatic publishing to connected networks are **not yet active**; the UI must not be interpreted as proof that a post was published.

## 1. Database

The canonical `SUPABASE-BASE-FINAL.sql` now creates the social tables and their owner-only RLS policies. Do not run `supabase/social-media-schema.sql` after the canonical migration. That older file is retained for reference only.

## 2. Edge Function secrets

In Supabase Dashboard → Edge Functions → Secrets, configure:

- `SOCIAL_PLATFORM_CONFIG` — one-line JSON, e.g. `{"meta_client_id":"YOUR_META_APP_ID","meta_client_secret":"YOUR_META_APP_SECRET"}`
- `SOCIAL_TOKEN_ENCRYPTION_KEY` — random 32-byte key encoded as base64
- `SOCIAL_OAUTH_REDIRECT_URL` — `https://glwyqrvufmjscjbbszzz.supabase.co/functions/v1/social-oauth?action=callback`

Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Never place the Meta App Secret, service-role key, or encryption key in GitHub files or browser JavaScript.

The exact error `META_CLIENT_ID manke nan SOCIAL_PLATFORM_CONFIG` means the deployed function did not read a valid `meta_client_id` from the `SOCIAL_PLATFORM_CONFIG` secret. The expected JSON key is lowercase `meta_client_id`; do not paste the Facebook personal account ID there. Use the App ID shown in Meta for Developers → your app → App settings → Basic.

## 3. Meta redirect and permissions

Add the exact callback URL above to the Meta app's valid OAuth redirect URIs. Facebook/Instagram publishing requires a suitable Page, linked Instagram Business/Creator account, and Meta approval for the requested permissions. This code uses Meta Graph API `v24.0`; change it in `supabase/functions/social-oauth/index.ts` if your app must use another supported version.

## 4. Deploy

From the project root, deploy:

```sh
supabase functions deploy social-oauth --no-verify-jwt
supabase functions deploy social-publish
```

`social-oauth` validates the user's access token itself. The callback stores tokens encrypted with AES-GCM and saves no raw provider token in the database. After changing secrets, retry the connection from `social-media.html`.

## 5. Current limitations

- Facebook OAuth and linked Instagram account discovery are implemented in this package but still require correct Meta configuration and live testing.
- `social-publish` currently creates a safe WhatsApp share link and records a draft/status for other networks. It deliberately does not claim Facebook, Instagram, TikTok, or YouTube content was published automatically.
- TikTok and YouTube OAuth/publishing, and actual Facebook/Instagram publishing endpoints, must be implemented and tested separately before promoting the feature as complete.
