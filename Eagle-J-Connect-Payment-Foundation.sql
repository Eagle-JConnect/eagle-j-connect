-- Eagle-J Connect: secure, provider-neutral payment foundation
-- IMPORTANT: This migration creates database structure only. It does NOT connect PayPal/Paddle,
-- create checkout sessions, or verify payment. Those actions must be implemented in Supabase Edge Functions.
-- Review first, then run in Supabase SQL Editor. Test in a development project before production.

BEGIN;

-- 1) Plans users can view. Only trusted server-side code should manage plan pricing/availability.
CREATE TABLE IF NOT EXISTS public.billing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  plan_type text NOT NULL CHECK (plan_type IN ('subscription', 'promotion', 'advertisement')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
  billing_interval text NOT NULL DEFAULT 'one_time'
    CHECK (billing_interval IN ('one_time', 'month', 'year')),
  duration_days integer CHECK (duration_days IS NULL OR duration_days > 0),
  is_active boolean NOT NULL DEFAULT false,
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((billing_interval = 'one_time') OR plan_type = 'subscription')
);

-- 2) Subscription status is server-managed; clients can only read their own rows.
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.billing_plans(id) ON DELETE RESTRICT,
  provider text NOT NULL CHECK (provider IN ('paypal', 'paddle', 'manual')),
  provider_customer_id text,
  provider_subscription_id text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'past_due', 'cancelled', 'expired', 'failed')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subscription_id)
);
CREATE INDEX IF NOT EXISTS user_subscriptions_user_id_idx ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS user_subscriptions_status_idx ON public.user_subscriptions(status);

-- 3) Payment records. A provider transaction ID can only be recorded once per provider.
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.billing_plans(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
  provider text NOT NULL CHECK (provider IN ('paypal', 'paddle', 'manual')),
  provider_transaction_id text,
  provider_checkout_id text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
  purpose text NOT NULL CHECK (purpose IN ('subscription', 'promotion', 'advertisement')),
  paid_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_transaction_id)
);
CREATE INDEX IF NOT EXISTS payment_transactions_user_id_idx ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS payment_transactions_status_idx ON public.payment_transactions(status);

-- 4) Paid visibility/promotional campaigns. Activation must be performed by verified server-side code.
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id bigint REFERENCES public.businesses(id) ON DELETE SET NULL,
  plan_id uuid REFERENCES public.billing_plans(id) ON DELETE SET NULL,
  payment_transaction_id uuid REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
  title text NOT NULL,
  target_url text,
  placement text NOT NULL DEFAULT 'featured'
    CHECK (placement IN ('featured', 'homepage', 'search', 'banner')),
  status text NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('draft', 'pending_payment', 'pending_review', 'active', 'paused', 'rejected', 'ended')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS ad_campaigns_owner_id_idx ON public.ad_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS ad_campaigns_status_idx ON public.ad_campaigns(status);

-- 5) Webhook event ledger makes provider event processing idempotent.
-- Raw secrets/payment credentials must never be stored here. Keep payloads minimal/redacted.
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('paypal', 'paddle')),
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  processing_status text NOT NULL DEFAULT 'received'
    CHECK (processing_status IN ('received', 'processed', 'ignored', 'failed')),
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  error_message text,
  UNIQUE (provider, provider_event_id)
);

-- RLS: public can read active plans; authenticated users can read only their own billing/campaign records.
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS billing_plans_read_active ON public.billing_plans;
CREATE POLICY billing_plans_read_active ON public.billing_plans
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS user_subscriptions_read_own ON public.user_subscriptions;
CREATE POLICY user_subscriptions_read_own ON public.user_subscriptions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS payment_transactions_read_own ON public.payment_transactions;
CREATE POLICY payment_transactions_read_own ON public.payment_transactions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS ad_campaigns_read_own ON public.ad_campaigns;
CREATE POLICY ad_campaigns_read_own ON public.ad_campaigns
  FOR SELECT TO authenticated USING (owner_id = auth.uid());

-- No client policies are created for webhook events. Edge Functions using the service role handle these rows.
-- Explicitly prevent browser clients from writing paid-state records or webhook events.
REVOKE ALL ON public.billing_plans FROM anon, authenticated;
GRANT SELECT ON public.billing_plans TO anon, authenticated;
REVOKE ALL ON public.user_subscriptions FROM anon, authenticated;
GRANT SELECT ON public.user_subscriptions TO authenticated;
REVOKE ALL ON public.payment_transactions FROM anon, authenticated;
GRANT SELECT ON public.payment_transactions TO authenticated;
REVOKE ALL ON public.ad_campaigns FROM anon, authenticated;
GRANT SELECT ON public.ad_campaigns TO authenticated;
REVOKE ALL ON public.payment_webhook_events FROM anon, authenticated, PUBLIC;

COMMIT;

-- Verification after running:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'billing_plans', 'user_subscriptions', 'payment_transactions',
    'ad_campaigns', 'payment_webhook_events'
  )
ORDER BY table_name;
