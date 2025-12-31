-- Rate limiting event store
CREATE TABLE IF NOT EXISTS public.rate_limit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  endpoint text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_key_endpoint_created_at
  ON public.rate_limit_events (key, endpoint, created_at DESC);

ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;

-- No RLS policies: default deny for all direct access.

-- Atomic rate limit check + increment
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_endpoint text,
  p_max_requests integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cutoff timestamp with time zone;
  v_count integer;
BEGIN
  -- Defensive validation
  IF p_key IS NULL OR length(trim(p_key)) = 0 OR length(p_key) > 200 THEN
    RETURN false;
  END IF;

  IF p_endpoint IS NULL OR length(trim(p_endpoint)) = 0 OR length(p_endpoint) > 100 THEN
    RETURN false;
  END IF;

  IF p_max_requests IS NULL OR p_max_requests < 1 OR p_max_requests > 10000 THEN
    RETURN false;
  END IF;

  IF p_window_seconds IS NULL OR p_window_seconds < 1 OR p_window_seconds > 86400 THEN
    RETURN false;
  END IF;

  v_cutoff := now() - make_interval(secs => p_window_seconds);

  -- Opportunistic cleanup (keeps table bounded)
  DELETE FROM public.rate_limit_events
  WHERE created_at < now() - interval '24 hours';

  SELECT count(*) INTO v_count
  FROM public.rate_limit_events
  WHERE key = p_key
    AND endpoint = p_endpoint
    AND created_at >= v_cutoff;

  IF v_count >= p_max_requests THEN
    RETURN false;
  END IF;

  INSERT INTO public.rate_limit_events (key, endpoint) VALUES (p_key, p_endpoint);

  RETURN true;
END;
$$;