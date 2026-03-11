
-- Tighten: only allow inserting non-verified OTPs, and only update verified column
DROP POLICY "Allow anon insert otp" ON public.otp_verifications;
DROP POLICY "Allow anon update otp" ON public.otp_verifications;

CREATE POLICY "Allow anon insert otp" ON public.otp_verifications
  FOR INSERT TO anon WITH CHECK (verified = false);

CREATE POLICY "Allow anon update otp" ON public.otp_verifications
  FOR UPDATE TO anon USING (verified = false);
