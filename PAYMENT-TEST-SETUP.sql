-- EAGLE-J CONNECT: PAYMENT TEST SETUP (NO REAL PAYMENTS)
-- Run this script once in Supabase SQL Editor after reviewing it.
-- It is idempotent for the test column, test plan, and function.
-- It DOES NOT connect PayPal/Paddle or mark a payment as paid.

BEGIN;

-- Ensure the test-only flag exists on the payment table.
ALTER TABLE public.payment_transactions
  ADD COLUMN IF NOT EXISTS test_mode boolean NOT NULL DEFAULT false;

-- A disabled plan used only to create test transactions. It is not shown publicly.
INSERT INTO public.billing_plans (
  code, name, description, plan_type, amount, currency,
  billing_interval, is_active, features
)
VALUES (
  'EJC_TEST_SUBSCRIPTION',
  'Eagle-J Test Subscription',
  'TEST ONLY — no real payment and no entitlement activation',
  'subscription', 1.00, 'USD', 'month', false,
  '{"test_mode": true, "real_payment": false}'::jsonb
)
ON CONFLICT (code) DO NOTHING;

-- Only a signed-in user can create a test transaction for themselves.
-- SECURITY DEFINER allows the function to insert while client table INSERT is denied;
-- auth.uid() is still required and comes from the caller's verified Supabase JWT.
CREATE OR REPLACE FUNCTION public.create_ejc_test_payment()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid;
  v_plan_id uuid;
  v_amount numeric(12,2);
  v_currency text;
  v_transaction_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to run this test.';
  END IF;

  SELECT bp.id, bp.amount, bp.currency
    INTO v_plan_id, v_amount, v_currency
  FROM public.billing_plans AS bp
  WHERE bp.code = 'EJC_TEST_SUBSCRIPTION'
    AND bp.plan_type = 'subscription'
  LIMIT 1;

  IF v_plan_id IS NULL THEN
    RAISE EXCEPTION 'Test plan not found.';
  END IF;

  INSERT INTO public.payment_transactions (
    user_id, plan_id, provider, status, amount, currency,
    purpose, metadata, test_mode
  ) VALUES (
    v_user_id, v_plan_id, 'manual', 'pending', v_amount, v_currency,
    'subscription',
    '{"test_mode": true, "real_payment": false, "note": "No payment was taken"}'::jsonb,
    true
  )
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.create_ejc_test_payment() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_ejc_test_payment() TO authenticated;

-- Keep test data private to each account; only read access is granted to browser users.
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS payment_transactions_read_own ON public.payment_transactions;
CREATE POLICY payment_transactions_read_own
  ON public.payment_transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
REVOKE ALL ON public.payment_transactions FROM anon, authenticated;
GRANT SELECT ON public.payment_transactions TO authenticated;

COMMIT;

-- Verification only; this does not create a transaction.
SELECT
  EXISTS (SELECT 1 FROM public.billing_plans WHERE code = 'EJC_TEST_SUBSCRIPTION') AS test_plan_exists,
  EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'create_ejc_test_payment'
  ) AS test_function_exists,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'payment_transactions'
      AND column_name = 'test_mode'
  ) AS test_mode_column_exists;
