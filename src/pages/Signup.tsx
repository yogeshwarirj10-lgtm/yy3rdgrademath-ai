import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, UserPlus, Eye, EyeOff, ArrowRight, ArrowLeft, Mail, ShieldCheck, CheckCircle } from "lucide-react";

type Step = "name" | "email" | "otp" | "password";

export default function Signup() {
  const [step, setStep] = useState<Step>("name");
  const [emailError, setEmailError] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpId, setOtpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const PARENT_EMAIL = "rj.yogeshwari@gmail.com";

  const handleSendOtp = async () => {
    setLoading(true);
    setEmailError("");
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { action: "send", student_name: studentName, student_email: email },
      });
      if (error) throw error;
      if (!data.success) {
        if (data.message?.includes("already exists")) {
          setEmailError("exists");
          setLoading(false);
          return;
        }
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpId(data.otp_id);
      
      setStep("otp");
      toast({ title: "Code sent!", description: `Verification code sent to ${PARENT_EMAIL}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { action: "verify", otp_id: otpId, otp_code: otpCode },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.message || "Invalid code");

      setStep("password");
      toast({ title: "Verified!", description: "Now set your password to complete signup." });
    } catch (err: any) {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleCreateAccount = async () => {
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { student_name: studentName },
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Welcome aboard!" });
      navigate("/topics");
    }
  };


  const stepNumber = step === "name" ? 1 : step === "email" ? 2 : step === "otp" ? 3 : 4;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-16 text-9xl font-black">π</div>
          <div className="absolute top-40 right-20 text-7xl font-black">÷</div>
          <div className="absolute bottom-16 left-1/3 text-8xl font-black">%</div>
        </div>
        <div className="relative text-center text-primary-foreground px-12">
          <BookOpen size={48} className="mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold">Join thousands of students</h2>
          <p className="mt-3 text-primary-foreground/70 text-lg">Practice makes perfect — start today!</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen size={20} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg">3rd Grade NJSLA Math Prep</span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= stepNumber ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Name */}
          {step === "name" && (
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">What's your name?</h1>
              <p className="mt-1 text-muted-foreground">Let's start with your student name</p>
              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    autoFocus
                    maxLength={100}
                  />
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    if (!studentName.trim()) {
                      toast({ title: "Name required", description: "Please enter your name", variant: "destructive" });
                      return;
                    }
                    setStep("email");
                  }}
                >
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Email */}
          {step === "email" && (
            <div>
              <button onClick={() => setStep("name")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft size={14} /> Back
              </button>
              <h1 className="text-2xl font-extrabold text-foreground">What's your email?</h1>
              <p className="mt-1 text-muted-foreground">We'll use this as your login email</p>
              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button className="w-full gap-2" onClick={handleSendOtp} disabled={loading || !email.trim()}>
                  {loading ? "Sending code…" : <><Mail size={16} /> Send Verification Code</>}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  A 6-digit code will be sent to <strong>{PARENT_EMAIL}</strong> for verification
                </p>
                {emailError === "exists" && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm space-y-2">
                    <p className="font-semibold text-destructive">Account already exists</p>
                    <p className="text-muted-foreground">This email is already registered. Please sign in or reset your password.</p>
                    <div className="flex gap-3">
                      <Link to="/login" className="text-sm font-semibold text-accent hover:underline">Sign in</Link>
                      <Link to="/forgot-password" className="text-sm font-semibold text-accent hover:underline">Reset password</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {step === "otp" && (
            <div>
              <button onClick={() => setStep("email")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-accent" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground">Enter verification code</h1>
              <p className="mt-1 text-muted-foreground">
                A 6-digit code was sent to <strong className="text-foreground">{PARENT_EMAIL}</strong>
              </p>




              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-xl tracking-[0.3em] font-mono"
                    autoFocus
                    maxLength={6}
                  />
                </div>
                <Button className="w-full gap-2" onClick={handleVerifyOtp} disabled={loading || otpCode.length !== 6}>
                  {loading ? "Verifying…" : <><ShieldCheck size={16} /> Verify Code</>}
                </Button>
                <button
                  onClick={handleSendOtp}
                  className="w-full text-sm text-accent hover:underline"
                  disabled={loading}
                >
                  Didn't receive it? Resend code
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Password */}
          {step === "password" && (
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-accent" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground">Almost done!</h1>
              <p className="mt-1 text-muted-foreground">Set a password for your account</p>
              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={handleCreateAccount} disabled={loading}>
                  {loading ? "Creating account…" : <><UserPlus size={16} /> Create Account</>}
                </Button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
