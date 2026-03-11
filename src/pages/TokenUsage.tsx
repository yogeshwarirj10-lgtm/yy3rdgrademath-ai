import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Zap, TrendingUp, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsageRecord {
  id: string;
  topic: string;
  category: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  question_count: number;
  created_at: string;
}

export default function TokenUsage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      const { data, error } = await supabase
        .from("ai_token_usage")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setRecords(data as UsageRecord[]);
      setLoading(false);
    };
    fetchUsage();
  }, []);

  const totalInput = records.reduce((s, r) => s + r.input_tokens, 0);
  const totalOutput = records.reduce((s, r) => s + r.output_tokens, 0);
  const totalTokens = records.reduce((s, r) => s + r.total_tokens, 0);
  const totalQuestions = records.reduce((s, r) => s + r.question_count, 0);

  // Per-topic breakdown
  const topicMap = new Map<string, { tokens: number; count: number; questions: number }>();
  records.forEach((r) => {
    const existing = topicMap.get(r.topic) || { tokens: 0, count: 0, questions: 0 };
    existing.tokens += r.total_tokens;
    existing.count += 1;
    existing.questions += r.question_count;
    topicMap.set(r.topic, existing);
  });
  const topicBreakdown = Array.from(topicMap.entries())
    .map(([topic, data]) => ({ topic, ...data }))
    .sort((a, b) => b.tokens - a.tokens);

  const formatNumber = (n: number) => n.toLocaleString();
  const formatDate = (d: string) => new Date(d).toLocaleString();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-4 md:py-6">
          <button
            onClick={() => navigate("/topics")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft size={14} />
            Back to Topics
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Zap size={20} className="text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                AI Token Usage
              </h1>
              <p className="text-xs text-muted-foreground">Track AI consumption across all quiz generations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <Zap size={40} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No token usage recorded yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Generate some quiz questions and come back!</p>
            <Button className="mt-4" onClick={() => navigate("/topics")}>Go to Topics</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Zap size={14} />
                  <span className="text-xs font-medium uppercase tracking-wide">Total Tokens</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{formatNumber(totalTokens)}</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp size={14} />
                  <span className="text-xs font-medium uppercase tracking-wide">Input Tokens</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{formatNumber(totalInput)}</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <BarChart3 size={14} />
                  <span className="text-xs font-medium uppercase tracking-wide">Output Tokens</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{formatNumber(totalOutput)}</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock size={14} />
                  <span className="text-xs font-medium uppercase tracking-wide">Generations</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{formatNumber(records.length)}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatNumber(totalQuestions)} questions</p>
              </div>
            </div>

            {/* Per-Topic Breakdown */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Usage by Topic</h2>
              <div className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Topic</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Generations</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Questions</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Tokens Used</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topicBreakdown.map((t) => (
                        <tr key={t.topic} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{t.topic}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{t.count}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(t.questions)}</td>
                          <td className="px-4 py-3 text-right font-mono text-foreground">{formatNumber(t.tokens)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full"
                                  style={{ width: `${totalTokens > 0 ? (t.tokens / totalTokens) * 100 : 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-10 text-right">
                                {totalTokens > 0 ? ((t.tokens / totalTokens) * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent History */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Recent Generations</h2>
              <div className="space-y-2">
                {records.slice(0, 20).map((r) => (
                  <div
                    key={r.id}
                    className="rounded-lg bg-card border border-border px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{r.topic}</p>
                      <p className="text-xs text-muted-foreground">{r.category} · {r.question_count} questions</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono text-foreground">{formatNumber(r.total_tokens)} tokens</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(r.input_tokens)} in / {formatNumber(r.output_tokens)} out
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
