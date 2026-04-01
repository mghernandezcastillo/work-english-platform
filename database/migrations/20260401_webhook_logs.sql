-- ============================================================
-- WEBHOOK LOGS — auditoría de webhooks entrantes (Hotmart, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  source text NOT NULL DEFAULT 'hotmart',
  event text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  buyer_email text,
  transaction_id text,
  result text NOT NULL DEFAULT 'pending' CHECK (result IN ('success', 'error', 'ignored', 'pending')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_tx ON public.webhook_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_email ON public.webhook_logs(buyer_email);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON public.webhook_logs(created_at DESC);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook logs"
  ON public.webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
