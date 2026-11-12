CREATE TABLE public.visual_bible_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(254) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT visual_bible_waitlist_email_format CHECK (
    email = lower(btrim(email))
    AND length(email) BETWEEN 3 AND 254
    AND position('@' IN email) > 1
  )
);
CREATE UNIQUE INDEX visual_bible_waitlist_email_unique ON public.visual_bible_waitlist (email);
GRANT INSERT ON public.visual_bible_waitlist TO anon, authenticated;
GRANT ALL ON public.visual_bible_waitlist TO service_role;
ALTER TABLE public.visual_bible_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can join the waitlist" ON public.visual_bible_waitlist
  FOR INSERT TO anon, authenticated
  WITH CHECK (email = lower(btrim(email)) AND length(email) BETWEEN 3 AND 254 AND position('@' IN email) > 1);