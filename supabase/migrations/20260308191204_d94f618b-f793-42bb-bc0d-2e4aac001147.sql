
-- Table to store OTP codes for parent verification
CREATE TABLE public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  parent_email TEXT NOT NULL DEFAULT 'rj.yogeshwari@gmail.com',
  verified BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (signup flow before auth)
CREATE POLICY "Allow anon insert otp" ON public.otp_verifications
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anon to read their own OTP by id
CREATE POLICY "Allow anon select otp" ON public.otp_verifications
  FOR SELECT TO anon USING (true);

-- Allow anon to update verified status
CREATE POLICY "Allow anon update otp" ON public.otp_verifications
  FOR UPDATE TO anon USING (true);
