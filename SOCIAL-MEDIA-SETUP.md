# Eagle-J Connect — Social Media Manager (Final)

This package adds a real social-media integration layer without replacing the existing authentication, jobs, businesses, profiles, admin moderation or language system.

## What was added

- `social-media.html` — Social Media Manager UI
- `social-media.css` — responsive styling
- `social-media.js` — authenticated UI, OAuth launch, composer and history
- `supabase/social-media-schema.sql` — tables + RLS
- `supabase/functions/social-oauth/index.ts` — OAuth start/callback/disconnect
- `supabase/functions/social-publish/index.ts` — server-side publishing
- `supabase/config.toml` — function auth settings

## Platforms

- Facebook Page publishing
- Instagram Business/Creator publishing through a linked Meta Page
- TikTok Content Posting API
- YouTube video upload
- WhatsApp share link immediately; WhatsApp Business Cloud API can be added as a separate Meta Business connector

## Important security rule

Do **not** put Meta/TikTok/Google client secrets, refresh tokens, service-role keys or encryption keys in GitHub Pages or in browser JavaScript. Supabase recommends storing sensitive values in Edge Function secrets. The publishable browser key is the only key intended for client-side use; secret keys stay server-side.

## 1. Run the SQL

Open Supabase SQL Editor and run:

`supabase/social-media-schema.sql`

Do this once.

## 2. Create the encryption key

Generate a random 32-byte value and encode it as base64. Example with a local terminal:

`openssl rand -base64 32`

Set it as the Supabase Edge Function secret:

`SOCIAL_TOKEN_ENCRYPTION_KEY=...`

Never commit this value.

## 3. Set the site/function URLs

Recommended values:

`SOCIAL_SITE_URL=https://eagle-jconnect.github.io/eagle-j-connect/social-media.html`

`SOCIAL_OAUTH_REDIRECT_URL=https://glwyqrvufmjscjbbszzz.supabase.co/functions/v1/social-oauth?action=callback`

## 4. Add platform configuration as ONE JSON secret

Use one secret called `SOCIAL_PLATFORM_CONFIG` so credentials stay together.

Example structure (replace every placeholder):

```json
{
  "meta_client_id": "YOUR_META_APP_ID",
  "meta_client_secret": "YOUR_META_APP_SECRET",
  "meta_graph_version": "v24.0",
  "tiktok_client_key": "YOUR_TIKTOK_CLIENT_KEY",
  "tiktok_client_secret": "YOUR_TIKTOK_CLIENT_SECRET",
  "google_client_id": "YOUR_GOOGLE_CLIENT_ID",
  "google_client_secret": "YOUR_GOOGLE_CLIENT_SECRET"
}
```

The exact Meta Graph version should be changed if Meta requires a newer version for your app.

## 5. Deploy the two Edge Functions

From the Supabase project directory:

`supabase functions deploy social-oauth --no-verify-jwt`

`supabase functions deploy social-publish`

Then set the secrets in Supabase Dashboard > Edge Functions > Secrets, or with the Supabase CLI.

## 6. Configure each provider

### Meta / Facebook / Instagram

Create a Meta developer app, enable the products/permissions needed for Page and Instagram publishing, set the OAuth redirect URL to the function URL above, and use the app ID/secret in `SOCIAL_PLATFORM_CONFIG`.

Instagram publishing requires an eligible Business/Creator account and a suitable linked Facebook Page.

### TikTok

Create a TikTok developer app, add the Content Posting API, configure the redirect URL, and request the scopes needed for the posting workflow. TikTok can require approval/audit before unrestricted public posting.

### YouTube

Create a Google Cloud project, enable YouTube Data API v3, configure OAuth consent + web client redirect URI, and use the client ID/secret above. YouTube uploads from new/unverified API projects can be restricted to private visibility until the project passes the required audit.

### WhatsApp

The current UI supports a safe `wa.me` share action without storing a WhatsApp token. A full WhatsApp Business Cloud API connector requires Meta Business setup, phone-number configuration and additional permissions.

## 7. Test

1. Log in to Eagle-J Connect.
2. Open `social-media.html`.
3. Connect one provider.
4. Return to the page.
5. Create a post and select the connected provider.
6. Check the Social Media history table.

If a provider has not been configured, the page should show a clear configuration error rather than pretending the account is connected.

## Existing system preservation

The existing `script.js`, `global.js`, `language.js`, login flow, profiles, jobs, businesses and admin moderation remain in place. The only navigation change is that authenticated users receive a Social Media Manager link from the existing menu controller.
