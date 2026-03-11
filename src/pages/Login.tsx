import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      let message = error.message;
      if (error.message === "Invalid login credentials") {
        message = "Incorrect email or password. Please check and try again.";
      } else if (error.message.includes("Email not confirmed")) {
        message = "Your email is not verified yet. Please check your inbox for the verification link.";
      } else if (error.message.includes("Invalid email")) {
        message = "No account found with this email address. Please sign up first.";
      }
      toast({ title: "Login failed", description: message, variant: "destructive" });
    } else {
      navigate("/topics");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            NJSLA 3rd Grade
          </h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm font-semibold text-accent mt-3">
            <Sparkles size={14} />
            AI Powered
          </div>
          <h2 className="text-xl font-bold text-foreground mt-4">Get Started</h2>
          <p className="text-muted-foreground text-sm mt-1">Sign in or create a free account</p>
          <p className="text-muted-foreground text-xs mt-2">A 6-digit verification code will be sent to rj.yogeshwari@gmail.com for approval.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold">Email</Label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold">Password</Label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
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

          <Button type="submit" className="w-full h-11 text-base rounded-xl font-semibold" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {/* Forgot password */}
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-accent font-medium hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Create account */}
        <Button
          variant="outline"
          className="w-full h-11 text-base rounded-xl font-semibold"
          onClick={() => navigate("/signup")}
        >
          Create Free Account
        </Button>
      </div>
    </div>
  );
}
