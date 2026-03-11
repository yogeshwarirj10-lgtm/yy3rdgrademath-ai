import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, FileText, BookOpen, Download, ArrowRight, Star, CheckCircle, Zap, Infinity } from "lucide-react";
import { categories } from "@/data/topics";

const totalTopics = categories.reduce((sum, c) => sum + c.topics.length, 0);

const features = [
  { icon: Brain, title: "AI-Powered Questions", desc: "Fresh, unique problems generated every session — never the same quiz twice." },
  { icon: BookOpen, title: `${totalTopics} Topics, ${categories.length} Domains`, desc: "Complete coverage of all Grade 3 NJSLA math standards." },
  { icon: FileText, title: "Printable PDF Worksheets", desc: "Download ready-to-print worksheets with full answer keys and explanations." },
  { icon: Infinity, title: "Unlimited Practice", desc: "No limits on quizzes. Practice as much as you need, whenever you want." },
];

const benefits = [
  "100% Free — No credit card needed",
  "Aligned to 2023 NJ Learning Standards",
  "Instant feedback & explanations",
  "Multiple DOK levels for deeper thinking",
  "Works on any device",
];

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container relative py-16 md:py-28 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm font-semibold text-accent mb-8">
            <Zap size={14} />
            AI Powered
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Master 3rd Grade Math
            <span className="block text-accent mt-1">the Smart Way</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The #1 AI-powered practice platform for NJSLA Grade 3 Mathematics. Fresh questions every session, printable worksheets, and instant feedback — all completely free.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="gap-2 text-base px-8 h-12 rounded-xl shadow-lg"
            >
              Start Practicing Free <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="gap-2 text-base px-8 h-12 rounded-xl"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16 md:py-20 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <f.icon size={22} className="text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-card border-y border-border">
        <div className="container py-16 md:py-20 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <ul className="space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-accent shrink-0" />
                    <span className="text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
          Ready to Ace the NJSLA?
        </h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Join students across New Jersey. Sign up and start practicing — it's completely free.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/signup")}
          className="mt-6 gap-2 text-base px-8 h-12 rounded-xl shadow-lg"
        >
          Get Started Free <ArrowRight size={16} />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container py-5 text-center text-xs text-muted-foreground space-y-1">
          <p>For any support or facing challenges pls email to rj.yogeshwari@gmail.com</p>
          <p>NJSLA 3rd Grade Math Prep &middot; Practice makes perfect</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
