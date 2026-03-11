import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/topics";
import CategoryCard from "@/components/CategoryCard";
import {
  BookOpen, LayoutGrid, Target, FileText, LogOut, Zap,
  Home, Brain, BarChart3, Infinity, GraduationCap, Sparkles,
  AlertTriangle, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTokenLimit, TOKEN_LIMIT, CONTACT_EMAIL } from "@/hooks/useTokenLimit";
import TokenLimitBanner from "@/components/TokenLimitBanner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const totalTopics = categories.reduce((sum, c) => sum + c.topics.length, 0);
  const studentName = user?.user_metadata?.student_name || "Student";
  const [activeTab, setActiveTab] = useState<"home" | "quiz" | "exam" | "activity">("home");
  const { totalTokens, remaining, usagePercent, limitReached, warningThreshold } = useTokenLimit();
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "activity") {
      supabase
        .from("ai_token_usage")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
        .then(({ data }) => { if (data) setActivityData(data); });
    }
  }, [activeTab]);

  const remainingLabel =
    remaining >= 1_000_000
      ? `${(remaining / 1_000_000).toFixed(2)}M`
      : remaining >= 1_000
        ? `${(remaining / 1_000).toFixed(1)}K`
        : `${remaining}`;

  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "quiz" as const, label: "Quiz", icon: Brain },
    { id: "exam" as const, label: "Exam", icon: FileText },
    { id: "activity" as const, label: "Activity", icon: BarChart3 },
  ];

  const stats = [
    { icon: "📊", value: categories.length.toString(), label: "Domains" },
    { icon: "✨", value: totalTopics.toString(), label: "Topics" },
    { icon: "🎯", value: "∞", label: "Questions" },
    { icon: "🤖", value: "✓", label: "AI Powered" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {limitReached && <TokenLimitBanner />}
      {warningThreshold && (
        <div className="border-b border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20 px-4 py-3">
          <div className="container flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-bold">Warning:</span> You've used {usagePercent.toFixed(1)}% of your 5M token limit ({remainingLabel} remaining). 
              Contact <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a> to increase your limit.
            </p>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight">NJSLA Grade 3</h2>
                <p className="text-xs text-muted-foreground">Math Practice</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                free version
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.id === "exam" ? navigate("/model-paper") : setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Tab Content */}
      {activeTab === "home" && (
        <main className="container py-6 space-y-6 max-w-4xl mx-auto">
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-accent/80 to-primary p-6 md:p-8 text-accent-foreground">
            <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-primary-foreground/10" />
            <div className="absolute bottom-[-20px] right-[60px] w-24 h-24 rounded-full bg-primary-foreground/5" />
            <div className="relative z-10">
              <p className="text-sm opacity-90">Welcome back! 👋</p>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
                Hey, {studentName}!
              </h1>
              <p className="mt-2 text-sm opacity-80 max-w-md">
                Ready to practice? Pick a topic and start solving AI-generated problems. 🚀
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={() => setActiveTab("quiz")}
                  variant="secondary"
                  className="gap-2 rounded-xl font-semibold"
                >
                  <Zap size={14} /> Start Quiz
                </Button>
                <Button
                  onClick={() => navigate("/model-paper")}
                  variant="secondary"
                  className="gap-2 rounded-xl font-semibold"
                >
                  <FileText size={14} /> Model Exam
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center"
              >
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-2xl font-extrabold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Token Balance */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Token Balance</span>
              </div>
              <span className="text-sm font-semibold text-accent">{remainingLabel} remaining</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${Math.max(1, 100 - usagePercent)}%` }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/token-usage")}
              className="rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors p-4 flex items-center gap-3 text-left"
            >
              <Zap size={18} className="text-accent shrink-0" />
              <div>
                <span className="text-sm font-semibold text-foreground">Token Usage Dashboard</span>
                <p className="text-xs text-muted-foreground">Detailed breakdown & history</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/model-paper")}
              className="rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors p-4 flex items-center gap-3 text-left"
            >
              <FileText size={18} className="text-accent shrink-0" />
              <div>
                <span className="text-sm font-semibold text-foreground">Model Question Paper</span>
                <p className="text-xs text-muted-foreground">Full 45-question practice test</p>
              </div>
            </button>
          </div>
        </main>
      )}

      {activeTab === "quiz" && (
        <main className="container py-6 max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-1">Select a Category</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a domain to explore topics and generate practice quizzes.
          </p>
          <div className="grid gap-3">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.name} category={cat} index={i} />
            ))}
          </div>
        </main>
      )}

      {activeTab === "activity" && (
        <main className="container py-6 max-w-3xl mx-auto">
          {/* Activity Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <span className="text-2xl mb-2 block">❓</span>
              <p className="text-3xl font-extrabold text-foreground">
                {activityData.reduce((s, r) => s + (r.question_count || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Questions Generated</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <span className="text-2xl mb-2 block">🏆</span>
              <p className="text-3xl font-extrabold text-foreground">{activityData.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Quizzes Taken</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <span className="text-2xl mb-2 block">📄</span>
              <p className="text-3xl font-extrabold text-foreground">
                {activityData.filter(r => r.category === "Model Paper").length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDFs Downloaded</p>
            </div>
          </div>

          {/* Token Usage Section */}
          <div className="rounded-xl border border-border bg-primary/5 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-foreground" />
                <span className="text-base font-bold text-foreground">Token Usage</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                limitReached
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              }`}>
                {limitReached ? "Deactivated" : "Active"}
              </span>
            </div>

            {/* Token Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-card border border-border p-3 text-center">
                <p className="text-lg font-extrabold text-foreground">5.00M</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-3 text-center">
                <p className="text-lg font-extrabold text-foreground">
                  {totalTokens >= 1_000_000 ? `${(totalTokens / 1_000_000).toFixed(2)}M` : totalTokens >= 1_000 ? `${(totalTokens / 1_000).toFixed(1)}K` : totalTokens}
                </p>
                <p className="text-xs text-muted-foreground">Used</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-3 text-center">
                <p className="text-lg font-extrabold text-accent">
                  {(100 - usagePercent).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    limitReached ? "bg-destructive" : usagePercent > 80 ? "bg-yellow-500" : "bg-accent"
                  }`}
                  style={{ width: `${Math.max(1, usagePercent)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{usagePercent.toFixed(1)}% used</p>
            </div>

            {/* Available highlight */}
            <div className="rounded-lg bg-card border border-border p-3 text-center mt-3">
              <span className="text-lg font-extrabold text-accent">{(100 - usagePercent).toFixed(1)}%</span>
              <span className="text-sm text-muted-foreground ml-2">available</span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Each quiz or model exam uses AI resources (tokens). If your tokens are fully used, your account will be deactivated. Please contact{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-foreground hover:underline">{CONTACT_EMAIL}</a>{" "}
              to reactivate.
            </p>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="container py-5 text-center text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={14} />
            <span>{(100 - usagePercent).toFixed(1)}% available</span>
          </div>
          <p>For any support or facing challenges pls email to rj.yogeshwari@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
