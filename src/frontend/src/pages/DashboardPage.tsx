import { CategoryChart } from "@/components/CategoryChart";
import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ALL_CATEGORIES, EXAM_CONFIGS } from "@/data/examData";
import type { ExamAttempt } from "@/data/types";
import { formatTime, getBadge } from "@/lib/examUtils";
import {
  deleteAllAttempts,
  getAllAttempts,
  getSettings,
  saveSettings,
} from "@/lib/storage";
import type { UserSettings } from "@/lib/storage";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Minus,
  RefreshCw,
  Shield,
  Star,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useState } from "react";

// ─── badge helpers ──────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  "Top Candidate": "bg-accent text-accent-foreground",
  "Academy Bound": "bg-primary text-primary-foreground",
  Ready: "bg-secondary text-secondary-foreground border border-border",
  Rookie: "bg-muted text-muted-foreground",
};

const BADGE_RANK: Record<string, number> = {
  Rookie: 1,
  Ready: 2,
  "Academy Bound": 3,
  "Top Candidate": 4,
};

function badgePill(badge: string) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${BADGE_COLORS[badge] ?? "bg-muted text-muted-foreground"}`}
    >
      {badge}
    </span>
  );
}

// ─── category score aggregation ─────────────────────────────────────────────
type CategoryScore = { correct: number; total: number; percentage: number };

function computeCategoryScores(
  attempts: ExamAttempt[],
): Record<string, CategoryScore> {
  const agg: Record<string, CategoryScore> = {};
  for (const attempt of attempts) {
    for (const [cat, cs] of Object.entries(attempt.categoryScores)) {
      if (!agg[cat]) agg[cat] = { correct: 0, total: 0, percentage: 0 };
      agg[cat].correct += cs.correct;
      agg[cat].total += cs.total;
    }
  }
  for (const cat of Object.keys(agg)) {
    const cs = agg[cat];
    cs.percentage =
      cs.total > 0 ? Math.round((cs.correct / cs.total) * 100) : 0;
  }
  return agg;
}

// ─── trend from last 3 attempts ─────────────────────────────────────────────
function examTrend(examAttempts: ExamAttempt[]): "up" | "down" | "flat" {
  if (examAttempts.length < 2) return "flat";
  const last3 = [...examAttempts]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )
    .slice(0, 3);
  if (last3.length < 2) return "flat";
  const first = last3[last3.length - 1].percentage;
  const latest = last3[0].percentage;
  if (latest > first + 2) return "up";
  if (latest < first - 2) return "down";
  return "flat";
}

// ─── motivation message ──────────────────────────────────────────────────────
function motivationMsg(avg: number, total: number): string {
  if (total === 0) return "Start your first exam to begin tracking progress.";
  if (avg >= 90)
    return "Elite performance. You are Top Candidate material — keep it up!";
  if (avg >= 80)
    return "You are passing consistently. Focus on weak areas to reach the top tier.";
  if (avg >= 65)
    return "You are making solid progress. Push through your weak categories to hit 80%.";
  return "Stay focused and practice your weak categories daily. Every rep counts toward the badge.";
}

// ─── DashboardPage ───────────────────────────────────────────────────────────
export function DashboardPage() {
  const [attempts, setAttempts] = useState<ExamAttempt[]>(() =>
    getAllAttempts(),
  );
  const [settings, setSettings] = useState<UserSettings>(() => getSettings());

  const handleClearAll = () => {
    deleteAllAttempts();
    setAttempts([]);
  };

  const toggleSetting = (key: keyof UserSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveSettings(next);
  };

  // ── derived stats ──
  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts,
        )
      : 0;
  const bestScore =
    totalAttempts > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const bestBadge =
    totalAttempts > 0
      ? Object.entries(BADGE_RANK).reduce<string>(
          (best, [b, rank]) =>
            attempts.some((a) => a.badge === b) &&
            rank > (BADGE_RANK[best] ?? 0)
              ? b
              : best,
          "Rookie",
        )
      : null;
  const totalQuestionsAnswered = attempts.reduce(
    (s, a) => s + a.totalQuestions,
    0,
  );
  const categoryScores = computeCategoryScores(attempts);
  const sortedWeakFirst = ALL_CATEGORIES.filter(
    (c) => categoryScores[c]?.total > 0,
  ).sort((a, b) => categoryScores[a].percentage - categoryScores[b].percentage);
  const strongest = [...sortedWeakFirst].reverse()[0] ?? null;
  const weakest = sortedWeakFirst[0] ?? null;
  const recentAttempts = [...attempts]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )
    .slice(0, 10);

  // ── overall stats cards data ──
  const statCards = [
    {
      label: "Exams Taken",
      value: String(totalAttempts),
      icon: <RefreshCw className="w-4 h-4" />,
    },
    {
      label: "Avg Score",
      value: `${avgScore}%`,
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: "Best Score",
      value: `${bestScore}%`,
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      label: "Questions Answered",
      value: String(totalQuestionsAnswered),
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Performance Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalAttempts > 0
              ? `${totalAttempts} attempt${totalAttempts !== 1 ? "s" : ""} — ${totalQuestionsAnswered} questions answered`
              : "Track your progress across all 4 exams"}
          </p>
        </div>
        {totalAttempts > 0 && bestBadge && (
          <div className="hidden sm:block">{badgePill(bestBadge)}</div>
        )}
      </div>

      {/* ── Empty state ── */}
      {totalAttempts === 0 ? (
        <Card
          className="p-12 text-center border border-dashed border-border"
          data-ocid="dashboard-empty"
        >
          <Shield className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h2 className="font-display font-semibold text-lg mb-2">
            No Exams Attempted Yet
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Complete your first exam to unlock performance analytics, category
            breakdowns, and badge progress.
          </p>
          <Link to="/">
            <Button className="gap-1" data-ocid="start-first-exam-btn">
              Start with Exam 1 <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* ── 1. Overall Stats Cards ── */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
            data-ocid="overall-stats"
          >
            {statCards.map((s) => (
              <Card
                key={s.label}
                className="p-4 text-center border border-border"
              >
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1 text-xs">
                  {s.icon}
                  <span>{s.label}</span>
                </div>
                <p className="font-display font-bold text-2xl">{s.value}</p>
              </Card>
            ))}
          </div>

          {/* Best badge banner */}
          {bestBadge && (
            <div
              className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
              data-ocid="best-badge-banner"
            >
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Best Badge Earned
                </p>
                {badgePill(bestBadge)}
              </div>
              <div className="text-right flex-1 max-w-xs">
                <p className="text-xs text-muted-foreground mb-1">
                  Average Score
                </p>
                <Progress value={avgScore} className="h-2 mb-1 progress-gold" />
                <p className="text-xs text-muted-foreground">
                  {avgScore}% (pass threshold 80%)
                </p>
              </div>
            </div>
          )}

          {/* ── 2. Exam Overview Cards ── */}
          <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Exam Overview
          </h2>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
            data-ocid="exam-overview"
          >
            {EXAM_CONFIGS.map((config) => {
              const examAttempts = attempts.filter(
                (a) => a.examId === config.id,
              );
              const sorted = [...examAttempts].sort(
                (a, b) =>
                  new Date(b.completedAt).getTime() -
                  new Date(a.completedAt).getTime(),
              );
              const best =
                examAttempts.length > 0
                  ? examAttempts.reduce(
                      (b, a) => (a.percentage > b.percentage ? a : b),
                      examAttempts[0],
                    )
                  : null;
              const lastAttempt = sorted[0] ?? null;
              const trend = examTrend(examAttempts);

              return (
                <Card
                  key={config.id}
                  className="p-4 border border-border"
                  data-ocid={`exam-card-${config.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-sm">{config.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {examAttempts.length} attempt
                        {examAttempts.length !== 1 ? "s" : ""}
                        {lastAttempt
                          ? ` — Last: ${new Date(lastAttempt.completedAt).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {trend === "up" && (
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      )}
                      {trend === "down" && (
                        <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                      )}
                      {trend === "flat" && examAttempts.length >= 2 && (
                        <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      {best && (
                        <Badge
                          className={`text-xs ${BADGE_COLORS[getBadge(best.percentage)]}`}
                        >
                          {getBadge(best.percentage)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {best ? (
                    <>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Best: {best.percentage}%</span>
                        <span>Time: {formatTime(best.timeSpentSeconds)}</span>
                      </div>
                      <Progress
                        value={best.percentage}
                        className="h-1.5 progress-gold mb-3"
                      />
                      <div className="flex gap-2">
                        <Link
                          to="/history/$examId"
                          params={{ examId: String(config.id) }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1"
                            data-ocid={`history-btn-${config.id}`}
                          >
                            View History <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Link
                          to="/exam/$examId"
                          params={{ examId: String(config.id) }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1"
                            data-ocid={`retake-btn-${config.id}`}
                          >
                            <RefreshCw className="w-3 h-3" /> Start Exam
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/exam/$examId"
                      params={{ examId: String(config.id) }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs mt-2"
                        data-ocid={`start-btn-${config.id}`}
                      >
                        Start Exam
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>

          {/* ── 3. Category Performance Chart ── */}
          <Card
            className="border border-border mb-3"
            data-ocid="category-chart"
          >
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Average Score by Category (All Exams)
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Red dashed line = 80% pass threshold
              </p>
            </CardHeader>
            <CardContent className="px-3 pb-4">
              <CategoryChart categoryScores={categoryScores} />
            </CardContent>
          </Card>

          {/* Category list sorted by score */}
          <Card className="border border-border mb-6" data-ocid="category-list">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="font-display text-sm font-semibold">
                Category Breakdown (Weakest First)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-3">
              {sortedWeakFirst.map((cat) => {
                const cs = categoryScores[cat];
                const colorClass =
                  cs.percentage >= 80
                    ? "text-green-500"
                    : cs.percentage >= 65
                      ? "text-primary"
                      : "text-destructive";
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground truncate mr-2">
                        {cat}
                      </span>
                      <span
                        className={`font-semibold whitespace-nowrap ${colorClass}`}
                      >
                        {cs.correct}/{cs.total} — {cs.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={cs.percentage}
                      className="h-1.5 progress-gold"
                    />
                  </div>
                );
              })}
              {sortedWeakFirst.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-3">
                  No category data yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ── 4. Recent Attempts Feed ── */}
          <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Recent Attempts
          </h2>
          <Card
            className="border border-border mb-6"
            data-ocid="recent-attempts"
          >
            <CardContent className="p-0">
              {recentAttempts.map((attempt, idx) => (
                <div key={attempt.id}>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {attempt.examTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(attempt.completedAt).toLocaleString()} —{" "}
                        {formatTime(attempt.timeSpentSeconds)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-sm font-bold ${attempt.passed ? "text-green-500" : "text-destructive"}`}
                      >
                        {attempt.percentage}%
                      </span>
                      {badgePill(attempt.badge)}
                      <Link
                        to="/review/$attemptId"
                        params={{ attemptId: attempt.id }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-0.5 h-7 px-2"
                          data-ocid={`review-btn-${attempt.id}`}
                        >
                          Review <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {idx < recentAttempts.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── 5. Study Recommendations ── */}
          <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" /> Study Recommendations
          </h2>
          <Card
            className="border border-border mb-6 bg-card"
            data-ocid="study-recommendations"
          >
            <CardContent className="p-5 space-y-4">
              {/* Motivational message */}
              <p className="text-sm text-muted-foreground italic">
                {motivationMsg(avgScore, totalAttempts)}
              </p>

              {strongest && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-semibold">Strongest area:</span>{" "}
                    {strongest} ({categoryScores[strongest].percentage}%) — Keep
                    it sharp.
                  </p>
                </div>
              )}

              {weakest && (
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-semibold">Weakest area:</span>{" "}
                    {weakest} ({categoryScores[weakest].percentage}%) —
                    Prioritize more practice here.
                  </p>
                </div>
              )}

              {/* Top 3 weakest */}
              {sortedWeakFirst.length >= 2 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Top Focus Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sortedWeakFirst.slice(0, 3).map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="text-xs border-destructive/30 text-destructive"
                      >
                        {cat} — {categoryScores[cat].percentage}%
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── 6. Settings ── */}
          <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Exam Settings
          </h2>
          <Card
            className="border border-border mb-6"
            data-ocid="settings-section"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    Randomize Question Order
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Shuffle questions each time you start an exam
                  </p>
                </div>
                <Switch
                  checked={settings.randomizeQuestions}
                  onCheckedChange={() => toggleSetting("randomizeQuestions")}
                  data-ocid="toggle-randomize-questions"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Randomize Answer Order</p>
                  <p className="text-xs text-muted-foreground">
                    Shuffle A/B/C/D options for each question
                  </p>
                </div>
                <Switch
                  checked={settings.randomizeAnswers}
                  onCheckedChange={() => toggleSetting("randomizeAnswers")}
                  data-ocid="toggle-randomize-answers"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Clear All History
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete all {totalAttempts} attempt(s)
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive border border-destructive/30 hover:bg-destructive/10"
                      data-ocid="clear-all-btn"
                    >
                      <Trash2 className="w-4 h-4" /> Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Attempts?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {totalAttempts}{" "}
                        attempt(s) across all 4 exams. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearAll}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-4" />
          <div className="flex gap-3 pb-4">
            <Link to="/">
              <Button variant="outline" data-ocid="back-to-home-btn">
                Back to Home
              </Button>
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
}

export default DashboardPage;
