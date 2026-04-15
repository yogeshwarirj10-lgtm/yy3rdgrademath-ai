import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, Download, CheckCircle2, XCircle, RefreshCw, Clock, Timer, AlertTriangle, Play, Trophy, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateModelPaperPdf } from "@/lib/generateModelPaperPdf";
import { supabase } from "@/integrations/supabase/client";

interface Choice { label: string; text: string; }
interface Question {
  id: number; question: string; choices: Choice[]; correctAnswer: string;
  explanation: string; standard?: string; dok?: number; domain?: string;
  type?: string; points?: number;
}
interface UnitData { title: string; questions: Question[]; standards?: string; time?: number; }

const UNIT_INFO = [
  { title: "Unit 1: Operations, Algebraic Thinking & Number Sense", questions: 25, time: 40 },
  { title: "Unit 2: Fractions, Measurement & Data", questions: 25, time: 40 },
  { title: "Unit 3: Geometry, Measurement & Review", questions: 25, time: 40 },
];

const FULL_EXAM_INFO = {
  totalQuestions: 30,
  units: [
    { title: "Unit 1: Operations & Algebraic Thinking", questions: 12, standards: "3.OA" },
    { title: "Unit 2: Number & Base Ten, Fractions", questions: 10, standards: "3.NBT, 3.NF" },
    { title: "Unit 3: Measurement, Data & Geometry", questions: 8, standards: "3.MD, 3.G" },
  ],
  itemTypes: [
    { type: "Type I", desc: "1–2 pts • Recall & Application" },
    { type: "Type II", desc: "3–4 pts • Reasoning & Modeling" },
    { type: "Type III", desc: "3–6 pts • Strategic Thinking" },
  ],
};

const TIMER_SECONDS = 40 * 60; // 40 minutes per unit
const FULL_EXAM_TIMER = 180 * 60; // 180 minutes for full exam (3 units × 60 min)

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Please sign in to continue.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

type UnitStatus = "locked" | "ready" | "loading" | "in_progress" | "completed";
type FullExamStatus = "ready" | "loading" | "in_progress" | "completed";
type FullExamLoadingProgress = { currentUnit: number; totalUnits: number; unitTitle: string } | null;

const ModelPaper = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<(UnitData | null)[]>([null, null, null]);
  const [unitStatuses, setUnitStatuses] = useState<UnitStatus[]>(["ready", "ready", "ready"]);
  const [activeUnit, setActiveUnit] = useState<number | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [scores, setScores] = useState<number[]>([0, 0, 0]);
  const [answered, setAnswered] = useState<number[]>([0, 0, 0]);
  const [userAnswers, setUserAnswers] = useState<(string | null)[][]>([[], [], []]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [pdfLoading, setPdfLoading] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Full exam state
  const [fullExamUnits, setFullExamUnits] = useState<UnitData[]>([]);
  const [fullExamData, setFullExamData] = useState<UnitData | null>(null);
  const [fullExamStatus, setFullExamStatus] = useState<FullExamStatus>("ready");
  const [fullExamScore, setFullExamScore] = useState(0);
  const [fullExamAnswered, setFullExamAnswered] = useState(0);
  const [fullExamUserAnswers, setFullExamUserAnswers] = useState<(string | null)[]>([]);
  const [isFullExamActive, setIsFullExamActive] = useState(false);
  const [fullExamProgress, setFullExamProgress] = useState<FullExamLoadingProgress>(null);

  // Timer logic
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const handleTimeUp = useCallback(() => {
    if (isFullExamActive && fullExamData) {
      toast.warning("Time's up! Your answers have been submitted.");
      setFullExamAnswered(fullExamData.questions.length);
      setSubmitted(false);
      setSelected("");
      setFullExamStatus("completed");
      setIsFullExamActive(false);
      return;
    }
    if (activeUnit === null) return;
    toast.warning("Time's up! Your answers have been submitted.");
    const unit = units[activeUnit];
    if (!unit) return;
    const newAnswered = [...answered];
    newAnswered[activeUnit] = unit.questions.length;
    setAnswered(newAnswered);
    setSubmitted(false);
    setSelected("");
    const newStatuses = [...unitStatuses];
    newStatuses[activeUnit] = "completed";
    setUnitStatuses(newStatuses);
    setActiveUnit(null);
  }, [activeUnit, units, answered, unitStatuses, isFullExamActive, fullExamData]);

  const generateUnit = async (unitIndex: number) => {
    const newStatuses = [...unitStatuses];
    newStatuses[unitIndex] = "loading";
    setUnitStatuses(newStatuses);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-model-paper`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ unitIndex }),
        }
      );

      if (response.status === 429) {
        toast.error("Too many requests. Please wait and try again.");
        newStatuses[unitIndex] = "ready";
        setUnitStatuses([...newStatuses]);
        return;
      }
      if (response.status === 402) {
        toast.error("AI credits exhausted. Please add credits.");
        newStatuses[unitIndex] = "ready";
        setUnitStatuses([...newStatuses]);
        return;
      }

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 403) throw new Error(data?.error || "Access denied");
        throw new Error("Our servers are busy right now. Please try again in a few minutes.");
      }

      const unitData: UnitData = {
        title: data.unit || UNIT_INFO[unitIndex].title,
        questions: data.questions || [],
      };

      const newUnits = [...units];
      newUnits[unitIndex] = unitData;
      setUnits(newUnits);

      // Init user answers array
      const newUserAnswers = [...userAnswers];
      newUserAnswers[unitIndex] = new Array(unitData.questions.length).fill(null);
      setUserAnswers(newUserAnswers);

      // Start quiz
      newStatuses[unitIndex] = "in_progress";
      setUnitStatuses([...newStatuses]);
      setActiveUnit(unitIndex);
      setCurrentIdx(0);
      setSelected("");
      setSubmitted(false);
      setTimeLeft(TIMER_SECONDS);
      setTimerActive(true);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong. Please try again in a few minutes.");
      newStatuses[unitIndex] = "ready";
      setUnitStatuses([...newStatuses]);
    }
  };

  const downloadUnitPdf = async (unitIndex: number) => {
    // If already generated, just download
    if (units[unitIndex]) {
      generateModelPaperPdf([units[unitIndex]!], `NJSLA_Grade3_Unit${unitIndex + 1}.pdf`);
      return;
    }
    // Otherwise generate first, then download
    setPdfLoading(unitIndex);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-model-paper`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ unitIndex }),
        }
      );
      if (!response.ok) {
        const d = await response.json();
        throw new Error(d?.error || "Failed to generate");
      }
      const data = await response.json();
      const unitData: UnitData = {
        title: data.unit || UNIT_INFO[unitIndex].title,
        questions: data.questions || [],
      };
      const newUnits = [...units];
      newUnits[unitIndex] = unitData;
      setUnits(newUnits);
      generateModelPaperPdf([unitData], `NJSLA_Grade3_Unit${unitIndex + 1}.pdf`);
    } catch (e: any) {
      toast.error(`Failed to generate Unit ${unitIndex + 1}: ${e.message}`);
    } finally {
      setPdfLoading(null);
    }
  };

  // Generate full exam — calls edge function once per unit to avoid timeout
  const generateFullExam = async () => {
    setFullExamStatus("loading");
    setFullExamProgress({ currentUnit: 1, totalUnits: 3, unitTitle: "Unit 1" });

    const unitTitles = ["Unit 1: Operations & Algebraic Thinking", "Unit 2: Number & Base Ten, Fractions", "Unit 3: Measurement, Data & Geometry"];
    const examUnits: UnitData[] = [];
    let startId = 1;

    const fetchUnit = async (unitIdx: number, retries = 2): Promise<any> => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-model-paper`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ fullExam: true, fullExamUnit: unitIdx, startId }),
        }
      );

      if (response.status === 429) {
        if (retries > 0) {
          await new Promise((r) => setTimeout(r, 4000));
          return fetchUnit(unitIdx, retries - 1);
        }
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      if (response.status === 402) {
        throw new Error("AI credits exhausted. Please add credits.");
      }

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (retries > 0) {
          await new Promise((r) => setTimeout(r, 2000));
          return fetchUnit(unitIdx, retries - 1);
        }
        if (response.status === 403) throw new Error(data?.error || "Access denied");
        throw new Error("Our servers are busy right now. Please try again in a few minutes.");
      }
      return data;
    };

    try {
      for (let i = 0; i < 3; i++) {
        setFullExamProgress({ currentUnit: i + 1, totalUnits: 3, unitTitle: unitTitles[i] });
        const data = await fetchUnit(i);
        const questions = data.questions || [];
        examUnits.push({
          title: data.title || unitTitles[i],
          standards: data.standards,
          time: data.time,
          questions,
        });
        startId += questions.length;
      }

      // Combine all questions for quiz mode
      const allQuestions = examUnits.flatMap((u: UnitData) => u.questions);
      const examData: UnitData = {
        title: "Full Exam — All Units Combined",
        questions: allQuestions,
      };

      setFullExamUnits(examUnits);
      setFullExamData(examData);
      setFullExamUserAnswers(new Array(allQuestions.length).fill(null));

      setFullExamStatus("in_progress");
      setIsFullExamActive(true);
      setCurrentIdx(0);
      setSelected("");
      setSubmitted(false);
      setFullExamScore(0);
      setFullExamAnswered(0);
      setTimeLeft(FULL_EXAM_TIMER);
      setTimerActive(true);
      setFullExamProgress(null);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong. Please try again in a few minutes.");
      setFullExamStatus("ready");
      setFullExamProgress(null);
    }
  };

  // Determine current questions source
  const currentQuestions = isFullExamActive && fullExamData 
    ? fullExamData.questions 
    : (activeUnit !== null && units[activeUnit] ? units[activeUnit]!.questions : []);
  const current = currentQuestions[currentIdx];
  const isUnitComplete = activeUnit !== null && unitStatuses[activeUnit] === "completed";

  const handleSubmit = () => {
    if (!selected || !current) return;
    
    // Full exam mode
    if (isFullExamActive) {
      setSubmitted(true);
      setFullExamAnswered((a) => a + 1);
      const newUserAnswers = [...fullExamUserAnswers];
      newUserAnswers[currentIdx] = selected;
      setFullExamUserAnswers(newUserAnswers);
      if (selected === current.correctAnswer) {
        setFullExamScore((s) => s + 1);
      }
      return;
    }
    
    // Unit mode
    if (activeUnit === null) return;
    setSubmitted(true);
    const newAnswered = [...answered];
    newAnswered[activeUnit]++;
    setAnswered(newAnswered);

    const newUserAnswers = [...userAnswers];
    newUserAnswers[activeUnit] = [...newUserAnswers[activeUnit]];
    newUserAnswers[activeUnit][currentIdx] = selected;
    setUserAnswers(newUserAnswers);

    if (selected === current.correctAnswer) {
      const newScores = [...scores];
      newScores[activeUnit]++;
      setScores(newScores);
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelected("");
    
    // Full exam mode
    if (isFullExamActive && fullExamData) {
      if (currentIdx < fullExamData.questions.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        // Full exam complete
        setTimerActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setFullExamStatus("completed");
        setIsFullExamActive(false);
      }
      return;
    }
    
    // Unit mode
    if (activeUnit === null) return;
    if (currentIdx < currentQuestions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      // Unit complete
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      const newStatuses = [...unitStatuses];
      newStatuses[activeUnit] = "completed";
      setUnitStatuses(newStatuses);
      setActiveUnit(null);
    }
  };

  const allCompleted = unitStatuses.every((s) => s === "completed");
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const totalQuestions = units.reduce((s, u) => s + (u?.questions.length || 0), 0);
  const completedUnits = units.filter((u, i) => unitStatuses[i] === "completed" && u) as UnitData[];

  const timerWarning = timeLeft <= 300 && timeLeft > 0; // 5 min warning
  const timerCritical = timeLeft <= 60 && timeLeft > 0; // 1 min

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
            Back to Home
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={20} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  NJSLA Mock Exam
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                Grade 3 Mathematics — Full Practice Test
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                3 Units • 75 Questions • 40 min per unit • No Calculator
              </p>
            </div>
            {allCompleted && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => generateModelPaperPdf(completedUnits)}
              >
                <Download size={14} />
                Download Full Paper
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-2xl mx-auto">
        {/* Timer bar when quiz is active */}
        {(activeUnit !== null || isFullExamActive) && timerActive && (
          <div className={`flex items-center justify-between rounded-lg border p-3 mb-6 ${
            timerCritical ? "border-destructive bg-destructive/10" :
            timerWarning ? "border-yellow-500 bg-yellow-500/10" :
            "border-border bg-card"
          }`}>
            <div className="flex items-center gap-2">
              <Timer size={18} className={timerCritical ? "text-destructive" : timerWarning ? "text-yellow-600" : "text-primary"} />
              <span className="text-sm font-medium text-foreground">
                {isFullExamActive ? "Full Exam" : `Unit ${activeUnit! + 1}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {timerWarning && <AlertTriangle size={14} className={timerCritical ? "text-destructive" : "text-yellow-600"} />}
              <span className={`font-mono text-lg font-bold ${
                timerCritical ? "text-destructive" : timerWarning ? "text-yellow-600" : "text-foreground"
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Unit selection - show when no unit is active and full exam not active */}
        {activeUnit === null && !isFullExamActive && fullExamStatus !== "completed" && (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <FileText size={36} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">NJSLA Mock Exam</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Take each unit as a timed 40-minute exam, or try the full combined practice test.
              </p>
            </div>

            {/* Individual Units */}
            <div className="grid gap-4 max-w-lg mx-auto">
              {UNIT_INFO.map((u, i) => {
                const status = unitStatuses[i];
                const unitData = units[i];
                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-5 transition-all ${
                      status === "completed"
                        ? "border-primary/30 bg-primary/5"
                        : status === "ready"
                        ? "border-border bg-card hover:shadow-md"
                        : status === "loading"
                        ? "border-border bg-card"
                        : "border-border bg-muted/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        status === "completed"
                          ? "bg-primary text-primary-foreground"
                          : status === "ready"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {status === "completed" ? <CheckCircle2 size={20} /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{u.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {u.questions} questions • {u.time} min
                        </p>

                        {status === "completed" && unitData && (
                          <>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(scores[i] / unitData.questions.length) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-primary">
                                {scores[i]}/{unitData.questions.length} ({Math.round((scores[i] / unitData.questions.length) * 100)}%)
                              </span>
                            </div>
                            <div className="mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 w-full"
                                onClick={() => generateModelPaperPdf([unitData], `NJSLA_Grade3_Unit${i + 1}.pdf`)}
                              >
                                <Download size={13} />
                                Download PDF
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col gap-2">
                        {status === "ready" && (
                          <>
                            <Button size="sm" className="gap-2" onClick={() => generateUnit(i)}>
                              <Play size={14} />
                              Take Quiz
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5"
                              disabled={pdfLoading === i}
                              onClick={() => downloadUnitPdf(i)}
                            >
                              {pdfLoading === i ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                              {pdfLoading === i ? "Generating…" : "PDF"}
                            </Button>
                          </>
                        )}
                        {status === "loading" && (
                          <Button size="sm" disabled className="gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            Generating…
                          </Button>
                        )}
                        {status === "completed" && (
                          <span className="text-xs font-semibold text-primary flex items-center gap-1">
                            <CheckCircle2 size={14} /> Done
                          </span>
                        )}
                        {status === "locked" && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={14} /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Practice Test Section */}
            <div className="max-w-lg mx-auto mt-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Full Practice Test
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="rounded-xl border-2 border-primary/20 bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">🏆</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">
                      NJSLA Full Practice Test
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      3 Units • 30 Questions • Type I, II & III • 180 min total
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="gap-1 text-xs font-medium">
                        <Clock size={12} />
                        3 × 60 min
                      </Badge>
                      <Badge variant="outline" className="text-xs font-medium">
                        30 questions
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Unit breakdown */}
                <div className="space-y-2 mb-4">
                  {FULL_EXAM_INFO.units.map((u, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2 border border-border">
                      <span className="font-medium text-foreground">{u.title}</span>
                      <span className="text-muted-foreground">{u.questions} Q • {u.standards}</span>
                    </div>
                  ))}
                </div>

                {/* Item types */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {FULL_EXAM_INFO.itemTypes.map((t) => (
                    <span
                      key={t.type}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20 font-medium"
                    >
                      {t.type}: {t.desc}
                    </span>
                  ))}
                </div>

                <Button
                  className="w-full gap-2 h-12 text-base"
                  onClick={generateFullExam}
                  disabled={fullExamStatus === "loading"}
                >
                  {fullExamStatus === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {fullExamProgress
                        ? `Generating Unit ${fullExamProgress.currentUnit} of ${fullExamProgress.totalUnits}…`
                        : "Generating…"}
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate & Start Full Exam
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Full exam generates 30 questions across 3 units (takes ~60 seconds). Individual units have 25 questions each.
            </p>
          </div>
        )}

        {/* Active quiz - Unit or Full Exam */}
        {((activeUnit !== null && !isUnitComplete) || isFullExamActive) && current && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Question {currentIdx + 1} of {currentQuestions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Score: {isFullExamActive ? fullExamScore : scores[activeUnit!]}/{isFullExamActive ? fullExamAnswered : answered[activeUnit!]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setShowExitDialog(true)}
                >
                  <LogOut size={14} />
                  Exit
                </Button>
                <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to exit? Your current progress will be lost and you'll need to start over.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          setTimerActive(false);
                          if (timerRef.current) clearInterval(timerRef.current);
                          if (isFullExamActive) {
                            setIsFullExamActive(false);
                            setFullExamStatus("ready");
                            setFullExamData(null);
                            setFullExamUserAnswers([]);
                            setFullExamScore(0);
                            setFullExamAnswered(0);
                          } else if (activeUnit !== null) {
                            const newStatuses = [...unitStatuses];
                            newStatuses[activeUnit] = "ready";
                            setUnitStatuses(newStatuses);
                            setActiveUnit(null);
                          }
                          setCurrentIdx(0);
                          setSelected("");
                          setSubmitted(false);
                          toast.info("Exited the test. You can restart anytime.");
                        }}
                      >
                        Exit Quiz
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    if (isFullExamActive && fullExamUnits.length > 0) {
                      generateModelPaperPdf(fullExamUnits, "NJSLA_Grade3_Full_Practice_Test.pdf", {
                        isFullExam: true,
                        timeMinutes: 180,
                      });
                    } else if (activeUnit !== null && units[activeUnit]) {
                      generateModelPaperPdf([units[activeUnit]!], `NJSLA_Grade3_Unit${activeUnit + 1}.pdf`);
                    }
                    toast.success("PDF downloaded!");
                  }}
                >
                  <Download size={14} />
                  PDF
                </Button>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((currentIdx + (submitted ? 1 : 0)) / currentQuestions.length) * 100}%` }}
              />
            </div>

            <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {current.type && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    current.type === "III" ? "bg-destructive/10 text-destructive" :
                    current.type === "II" ? "bg-yellow-500/10 text-yellow-700" :
                    "bg-primary/10 text-primary"
                  }`}>
                    Type {current.type} · {current.points || 1} pt{(current.points || 1) > 1 ? "s" : ""}
                  </span>
                )}
                {current.standard && (
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {current.standard}
                  </span>
                )}
                {current.domain && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                    {current.domain}
                  </span>
                )}
              </div>
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
                    if (isCorrect) borderClass = "border-primary bg-primary/10";
                    else if (isSelected && !isCorrect) borderClass = "border-destructive bg-destructive/10";
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
                      <RadioGroupItem value={choice.label} id={`mp-${choice.label}`} />
                      <Label htmlFor={`mp-${choice.label}`} className="cursor-pointer flex-1 text-sm">
                        <span className="font-semibold mr-2">{choice.label}.</span>
                        {choice.text}
                      </Label>
                      {submitted && isCorrect && <CheckCircle2 size={18} className="text-primary shrink-0" />}
                      {submitted && isSelected && !isCorrect && <XCircle size={18} className="text-destructive shrink-0" />}
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
                  <Button onClick={handleSubmit} disabled={!selected}>Submit Answer</Button>
                ) : (
                  <Button onClick={handleNext}>
                    {currentIdx < currentQuestions.length - 1 ? "Next Question" : (isFullExamActive ? "Finish Exam" : "Finish Unit")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Full Exam Complete */}
        {fullExamStatus === "completed" && fullExamData && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-foreground">Full Exam Complete!</h2>
            <p className="text-muted-foreground mt-2">
              Score: <strong className="text-foreground">{fullExamScore}</strong> / {fullExamData.questions.length}
              {" "}({Math.round((fullExamScore / fullExamData.questions.length) * 100)}%)
            </p>

            <div className="w-full max-w-xs mx-auto mt-4 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(fullExamScore / fullExamData.questions.length) * 100}%` }}
              />
            </div>

            {/* NJSLA-style performance levels */}
            <div className="mt-6 max-w-sm mx-auto">
              {(() => {
                const pct = Math.round((fullExamScore / fullExamData.questions.length) * 100);
                let level = "", color = "", desc = "";
                if (pct >= 80) { level = "Level 5 — Exceeded Expectations"; color = "text-primary"; desc = "Demonstrates thorough understanding"; }
                else if (pct >= 65) { level = "Level 4 — Met Expectations"; color = "text-primary"; desc = "Demonstrates adequate understanding"; }
                else if (pct >= 50) { level = "Level 3 — Approached Expectations"; color = "text-yellow-600"; desc = "May need additional support"; }
                else if (pct >= 30) { level = "Level 2 — Partially Met Expectations"; color = "text-orange-500"; desc = "Needs significant support"; }
                else { level = "Level 1 — Did Not Meet Expectations"; color = "text-destructive"; desc = "Needs substantial support"; }
                return (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className={`text-sm font-bold ${color}`}>{level}</p>
                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                  </div>
                );
              })()}
            </div>

            {/* Score breakdown by item type */}
            <div className="mt-6 max-w-md mx-auto">
              {(() => {
                const typeBreakdown: Record<string, { correct: number; total: number; points: number; maxPoints: number }> = {};
                fullExamData.questions.forEach((q, i) => {
                  const t = q.type || "I";
                  if (!typeBreakdown[t]) typeBreakdown[t] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
                  typeBreakdown[t].total++;
                  typeBreakdown[t].maxPoints += (q.points || 1);
                  if (fullExamUserAnswers[i] === q.correctAnswer) {
                    typeBreakdown[t].correct++;
                    typeBreakdown[t].points += (q.points || 1);
                  }
                });
                const typeLabels: Record<string, string> = { "I": "Type I — Recall", "II": "Type II — Reasoning", "III": "Type III — Strategic" };
                const typeColors: Record<string, string> = { "I": "bg-primary/10 text-primary", "II": "bg-accent text-accent-foreground", "III": "bg-destructive/10 text-destructive" };
                return (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm font-bold text-foreground mb-3">Score by Item Type</p>
                    <div className="space-y-3">
                      {["I", "II", "III"].filter(t => typeBreakdown[t]).map(t => {
                        const b = typeBreakdown[t];
                        const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
                        return (
                          <div key={t}>
                            <div className="flex justify-between items-center text-xs mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColors[t]}`}>{typeLabels[t]}</span>
                              <span className="text-muted-foreground">{b.correct}/{b.total} correct · {b.points}/{b.maxPoints} pts · {pct}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              <Button variant="outline" onClick={() => navigate("/topics")}>All Topics</Button>
              <Button variant="outline" className="gap-2" onClick={() => generateModelPaperPdf(fullExamUnits.length > 0 ? fullExamUnits : [fullExamData], "NJSLA_Grade3_FullExam.pdf", { isFullExam: true, timeMinutes: 180 })}>
                <Download size={14} />
                Download PDF
              </Button>
              <Button onClick={() => {
                setFullExamUnits([]);
                setFullExamData(null);
                setFullExamStatus("ready");
                setFullExamScore(0);
                setFullExamAnswered(0);
                setFullExamUserAnswers([]);
                setCurrentIdx(0);
              }} className="gap-2">
                <RefreshCw size={14} />
                New Exam
              </Button>
            </div>
          </div>
        )}

        {/* All units complete */}
        {allCompleted && fullExamStatus !== "completed" && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Mock Exam Complete!</h2>
            <p className="text-muted-foreground mt-2">
              Total Score: <strong className="text-foreground">{totalScore}</strong> / {totalQuestions}
              {" "}({totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0}%)
            </p>

            <div className="w-full max-w-xs mx-auto mt-4 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0}%` }}
              />
            </div>

            {/* NJSLA-style performance levels */}
            <div className="mt-6 max-w-sm mx-auto">
              {(() => {
                const pct = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
                let level = "", color = "", desc = "";
                if (pct >= 80) { level = "Level 5 — Exceeded Expectations"; color = "text-primary"; desc = "Demonstrates thorough understanding"; }
                else if (pct >= 65) { level = "Level 4 — Met Expectations"; color = "text-primary"; desc = "Demonstrates adequate understanding"; }
                else if (pct >= 50) { level = "Level 3 — Approached Expectations"; color = "text-yellow-600"; desc = "May need additional support"; }
                else if (pct >= 30) { level = "Level 2 — Partially Met Expectations"; color = "text-orange-500"; desc = "Needs significant support"; }
                else { level = "Level 1 — Did Not Meet Expectations"; color = "text-destructive"; desc = "Needs substantial support"; }
                return (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className={`text-sm font-bold ${color}`}>{level}</p>
                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                  </div>
                );
              })()}
            </div>

            <div className="grid gap-3 max-w-sm mx-auto mt-6 text-left">
              {completedUnits.map((u, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Unit {i + 1}</p>
                    <p className="text-xs text-muted-foreground">{u.title.split(":")[1]?.trim()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{scores[i]}/{u.questions.length}</p>
                    <p className="text-xs text-muted-foreground">{Math.round((scores[i] / u.questions.length) * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              <Button variant="outline" onClick={() => navigate("/topics")}>All Topics</Button>
              <Button variant="outline" className="gap-2" onClick={() => generateModelPaperPdf(completedUnits)}>
                <Download size={14} />
                Download PDF
              </Button>
              <Button onClick={() => {
                setUnits([null, null, null]);
                setUnitStatuses(["ready", "ready", "ready"]);
                setActiveUnit(null);
                setScores([0, 0, 0]);
                setAnswered([0, 0, 0]);
                setUserAnswers([[], [], []]);
                setTimeLeft(TIMER_SECONDS);
                setTimerActive(false);
              }} className="gap-2">
                <RefreshCw size={14} />
                New Exam
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelPaper;
