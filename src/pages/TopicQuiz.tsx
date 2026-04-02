import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { categories } from "@/data/topics";
import { topicTips } from "@/data/topicTips";

import { ArrowLeft, CheckCircle2, XCircle, Loader2, RefreshCw, Download, Lightbulb, AlertTriangle } from "lucide-react";
import { generateQuizPdf } from "@/lib/generateQuizPdf";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Choice {
  label: string;
  text: string;
}

interface Question {
  id: number;
  question: string;
  choices: Choice[];
  correctAnswer: string;
  explanation: string;
  standard?: string;
  dok?: number;
}

const TopicQuiz = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Find the topic and category — support custom topics via ?name= query param
  const isCustom = slug === "custom";
  const customName = searchParams.get("name") || "";

  let topicName = "";
  let categoryName = "";
  let categoryEmoji = "";
  let categoryBg = "";

  if (isCustom && customName) {
    topicName = customName;
    categoryName = "Custom Topic";
    categoryEmoji = "🔍";
    categoryBg = "bg-primary";
  } else {
    for (const cat of categories) {
      const found = cat.topics.find((t) => t.slug === slug);
      if (found) {
        topicName = found.name;
        categoryName = cat.name;
        categoryEmoji = cat.emoji;
        categoryBg = cat.bgClass;
        break;
      }
    }
  }

  const fetchQuestions = async () => {
    setLoading(true);
    setErrorMessage("");
    setQuestions([]);
    setCurrentIdx(0);
    setSelected("");
    setSubmitted(false);
    setScore(0);
    setAnswered(0);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ topic: topicName, category: categoryName, count: 20 }),
        }
      );

      if (response.status === 429) {
        toast.error("Too many requests. Please wait a moment and try again.");
        return;
      }
      if (response.status === 402) {
        toast.error("AI credits exhausted. Please add credits to continue.");
        return;
      }

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (data?.error) throw new Error(data.error);
        if (response.status === 403) throw new Error("Access denied");
        throw new Error("Our servers are busy right now. Please try again in a few minutes.");
      }
      if (data?.error) throw new Error(data.error);
      setQuestions(data.questions || []);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Something went wrong. Please try again in a few minutes.");
      toast.error(e.message || "Something went wrong. Please try again in a few minutes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicName) fetchQuestions();
  }, [slug, customName]);

  if (!topicName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Topic not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/topics")}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];
  const isComplete = answered === questions.length && questions.length > 0;

  const handleSubmit = () => {
    if (!selected || !current) return;
    setSubmitted(true);
    setAnswered((a) => a + 1);
    if (selected === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelected("");
    setCurrentIdx((i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4 md:py-6">
          <button
            onClick={() => navigate("/topics")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft size={14} />
            Back to Topics
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`${categoryBg} flex items-center justify-center w-10 h-10 rounded-lg text-lg text-primary-foreground shrink-0`}>
                {categoryEmoji}
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{categoryName}</p>
                <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                  {topicName}
                </h1>
              </div>
            </div>
            {questions.length > 0 && !loading && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => generateQuizPdf(questions, topicName, categoryName)}
              >
                <Download size={14} />
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-2xl mx-auto space-y-6">
        {/* Tips Section */}
        {slug && topicTips[slug] && (
          <details className="rounded-xl bg-accent/5 border border-accent/20 overflow-hidden group">
            <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none hover:bg-accent/10 transition-colors">
              <Lightbulb size={18} className="text-accent shrink-0" />
              <span className="font-semibold text-sm text-foreground">Tips & Points to Remember</span>
            </summary>
            <div className="px-5 pb-4 pt-1 border-t border-accent/10">
              <p className="text-sm text-foreground/80 mb-3 italic">💡 {topicTips[slug].tip}</p>
              <ul className="space-y-1.5">
                {topicTips[slug].points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-muted-foreground text-sm">Generating NJSLA-style questions…</p>
          </div>
        ) : errorMessage && questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle size={28} className="text-destructive" />
            </div>
            <p className="text-destructive font-semibold">{errorMessage}</p>
            <Button onClick={() => { setErrorMessage(""); fetchQuestions(); }} className="gap-2 mt-2">
              <RefreshCw size={14} />
              Try Again
            </Button>
          </div>
        ) : isComplete ? (
          /* Score Screen */
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
            <p className="text-muted-foreground mt-2">
              You scored <strong className="text-foreground">{score}</strong> out of{" "}
              <strong className="text-foreground">{questions.length}</strong>
            </p>
            <div className="w-full max-w-xs mx-auto mt-4 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(score / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round((score / questions.length) * 100)}%
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Button variant="outline" onClick={() => navigate("/topics")}>
                All Topics
              </Button>
              <Button onClick={fetchQuestions} className="gap-2">
                <RefreshCw size={14} />
                Try Again
              </Button>
            </div>
          </div>
        ) : current ? (
          /* Question Card */
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Score: {score}/{answered}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              />
            </div>

            <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <p className="text-base font-semibold text-foreground leading-relaxed mb-6">
                {current.question}
              </p>

              <RadioGroup
                value={selected}
                onValueChange={(v) => !submitted && setSelected(v)}
                className="space-y-3"
              >
                {current.choices.map((choice) => {
                  const isCorrect = choice.label === current.correctAnswer;
                  const isSelected = selected === choice.label;
                  let borderClass = "border-border";
                  if (submitted) {
                    if (isCorrect) borderClass = "border-green-500 bg-green-50 dark:bg-green-950/20";
                    else if (isSelected && !isCorrect) borderClass = "border-red-500 bg-red-50 dark:bg-red-950/20";
                  } else if (isSelected) {
                    borderClass = "border-primary";
                  }

                  return (
                    <label
                      key={choice.label}
                      className={`flex items-center gap-3 rounded-lg border ${borderClass} p-4 cursor-pointer transition-colors ${
                        submitted ? "pointer-events-none" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={choice.label} id={`choice-${choice.label}`} />
                      <Label htmlFor={`choice-${choice.label}`} className="cursor-pointer flex-1 text-sm">
                        <span className="font-semibold mr-2">{choice.label}.</span>
                        {choice.text}
                      </Label>
                      {submitted && isCorrect && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
                      {submitted && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
                    </label>
                  );
                })}
              </RadioGroup>

              {submitted && (
                <div className="mt-5 rounded-lg bg-muted/50 border border-border p-4">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {current.standard && (
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {current.standard}
                      </span>
                    )}
                    {current.dok && (
                      <span className="text-xs bg-accent/10 text-accent-foreground px-2 py-0.5 rounded">
                        DOK Level {current.dok}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Explanation</p>
                  <p className="text-sm text-muted-foreground">{current.explanation}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                {!submitted ? (
                  <Button onClick={handleSubmit} disabled={!selected}>
                    Submit Answer
                  </Button>
                ) : currentIdx < questions.length - 1 ? (
                  <Button onClick={handleNext}>Next Question</Button>
                ) : (
                  <Button onClick={handleNext}>See Results</Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions generated. Please try again.</p>
            <Button onClick={fetchQuestions} className="mt-4 gap-2">
              <RefreshCw size={14} />
              Retry
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TopicQuiz;
