import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PARENT_EMAIL = "rj.yogeshwari@gmail.com";
const GMAIL_USER = "rj.yogeshwari@gmail.com";

async function sendOtpEmail(code: string, studentName: string, studentEmail: string) {
  const appPassword = Deno.env.get("GMAIL_APP_PASSWORD");
  if (!appPassword) throw new Error("GMAIL_APP_PASSWORD not configured");

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: GMAIL_USER,
        password: appPassword,
      },
    },
  });

  await client.send({
    from: GMAIL_USER,
    to: PARENT_EMAIL,
     subject: `3rd Grade NJSLA Math Prep - Verification Code: ${code}`,
    content: `Verification code: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1e3a5f; margin-bottom: 8px;">3rd Grade NJSLA Math Prep - Verification Code</h2>
        <p style="color: #555; font-size: 15px;">A new student is signing up:</p>
        <div style="background: #f5f7fa; border-radius: 12px; padding: 20px; margin: 16px 0;">
          <p style="margin: 4px 0; color: #333;"><strong>Student Name:</strong> ${studentName}</p>
          <p style="margin: 4px 0; color: #333;"><strong>Student Email:</strong> ${studentEmail}</p>
        </div>
        <p style="color: #555; font-size: 15px;">Your verification code is:</p>
        <div style="background: #1e3a5f; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 12px; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #888; font-size: 13px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });

  await client.close();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, student_name, student_email, otp_id, otp_code } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === "send") {
      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw new Error(`Auth error: ${listError.message}`);
      const existingUser = existingUsers.users.find((u) => u.email === student_email);
      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, message: "An account with this email already exists. Please sign in instead." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("otp_verifications")
        .insert({
          student_name,
          student_email,
          otp_code: code,
          parent_email: PARENT_EMAIL,
          expires_at: expiresAt,
        })
        .select("id")
        .single();

      if (error) throw new Error(`DB error: ${error.message}`);

      // Send email via Gmail SMTP
      await sendOtpEmail(code, student_name, student_email);

      return new Response(
        JSON.stringify({ success: true, otp_id: data.id, message: `Verification code sent to ${PARENT_EMAIL}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const { data, error } = await supabase
        .from("otp_verifications")
        .select("*")
        .eq("id", otp_id)
        .eq("otp_code", otp_code)
        .eq("verified", false)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid verification code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (new Date(data.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ success: false, message: "Verification code has expired. Please request a new one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase.from("otp_verifications").update({ verified: true }).eq("id", otp_id);

      return new Response(
        JSON.stringify({ success: true, student_name: data.student_name, student_email: data.student_email }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("OTP error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
