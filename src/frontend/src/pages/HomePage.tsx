import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { EXAM_CONFIGS } from "@/data/examData";
import type { ExamAttempt } from "@/data/types";
import { formatTime, getBadge } from "@/lib/examUtils";
import {
  getAllAttempts,
  getResumeState,
  getSettings,
  saveSettings,
} from "@/lib/storage";
import type { UserSettings } from "@/lib/storage";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock,
  FlameIcon,
  Play,
  RotateCcw,
  Settings2,
  Shield,
  Star,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Badge tier definitions ────────────────────────────────────────────────
const BADGE_TIERS = [
  {
    name: "Rookie",
    icon: "🔰",
    range: "0 – 64%",
    min: 0,
    max: 64,
    cls: "bg-muted text-muted-foreground border border-border",
    glow: "",
  },
  {
    name: "Ready",
    icon: "⭐",
    range: "65 – 79%",
    min: 65,
    max: 79,
    cls: "bg-secondary text-secondary-foreground border border-primary/30",
    glow: "shadow-[0_0_12px_oklch(var(--primary)/0.25)]",
  },
  {
    name: "Academy Bound",
    icon: "🎖️",
    range: "80 – 89%",
    min: 80,
    max: 89,
    cls: "bg-primary/20 text-primary border border-primary/40",
    glow: "shadow-[0_0_16px_oklch(var(--primary)/0.35)]",
  },
  {
    name: "Top Candidate",
    icon: "🏆",
    range: "90 – 100%",
    min: 90,
    max: 100,
    cls: "bg-accent/20 text-accent-foreground border border-accent/50",
    glow: "shadow-[0_0_20px_oklch(var(--accent)/0.45)]",
  },
] as const;

const DIFFICULTY_VARIANTS: Record<string, { cls: string; label: string }> = {
  Easy: {
    cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    label: "Easy",
  },
  "Easy / Medium": {
    cls: "bg-accent/15 text-accent-foreground border border-accent/30",
    label: "Easy–Med",
  },
  "Medium / Hard": {
    cls: "bg-primary/15 text-primary border border-primary/30",
    label: "Med–Hard",
  },
  "Hard / Elite": {
    cls: "bg-destructive/20 text-destructive border border-destructive/40",
    label: "Elite",
  },
};

const BADGE_SCORE_CLS: Record<string, string> = {
  "Top Candidate":
    "bg-accent/20 text-accent-foreground border border-accent/40",
  "Academy Bound": "bg-primary/20 text-primary border border-primary/30",
  Ready: "bg-secondary text-secondary-foreground border border-border",
  Rookie: "bg-muted text-muted-foreground border border-border",
};

// ─── Overall stats helpers ─────────────────────────────────────────────────
function getStudyStreak(attempts: ExamAttempt[]): number {
  if (!attempts.length) return 0;
  const days = new Set(
    attempts.map((a) => new Date(a.completedAt).toDateString()),
  );
  const sorted = [...days].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const day of sorted) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round(
      (cursor.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff <= 1) {
      streak++;
      cursor = d;
    } else break;
  }
  return streak;
}

// ─── Component ─────────────────────────────────────────────────────────────
export function HomePage() {
  const [settings, setSettings] = useState<UserSettings>(() => getSettings());
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [badgesOpen, setBadgesOpen] = useState(false);

  useEffect(() => {
    setAttempts(getAllAttempts());
  }, []);

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    val: UserSettings[K],
  ) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    saveSettings(next);
  };

  const getBestAttempt = (examId: number) =>
    attempts
      .filter((a) => a.examId === examId)
      .sort((a, b) => b.percentage - a.percentage)[0] ?? null;

  const getLastAttempt = (examId: number) =>
    attempts
      .filter((a) => a.examId === examId)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      )[0] ?? null;

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts,
        )
      : 0;
  const passRate =
    totalAttempts > 0
      ? Math.round(
          (attempts.filter((a) => a.passed).length / totalAttempts) * 100,
        )
      : 0;
  const bestBadge =
    totalAttempts > 0
      ? getBadge(Math.max(...attempts.map((a) => a.percentage)))
      : null;
  const streak = getStudyStreak(attempts);

  return (
    <Layout>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative text-center py-10 md:py-14 mb-6 overflow-hidden">
        {/* Background shield watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <Shield className="w-72 h-72 text-primary" strokeWidth={0.8} />
        </div>

        {/* Badge icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-5 shadow-[0_0_32px_oklch(var(--primary)/0.3)]">
          <Shield className="w-10 h-10 text-primary" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
            <Star
              className="w-3 h-3 text-accent-foreground"
              fill="currentColor"
            />
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          RecruitIQ
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-5">
          Train hard. Score high. Serve with distinction.
        </p>

        {/* Stats pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { icon: BookOpen, text: "400+ Questions" },
            { icon: Shield, text: "4 Exams" },
            { icon: BarChart3, text: "16 Categories" },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground"
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ── SETTINGS STRIP ──────────────────────────────────────────── */}
      <div
        className="bg-card border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between"
        data-ocid="settings-strip"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Settings2 className="w-4 h-4 text-primary" />
          Exam Options
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <Switch
              id="randomize-questions"
              checked={settings.randomizeQuestions}
              onCheckedChange={(v) => updateSetting("randomizeQuestions", v)}
              data-ocid="toggle-randomize-questions"
            />
            <Label
              htmlFor="randomize-questions"
              className="text-sm cursor-pointer"
            >
              Randomize Questions
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="randomize-answers"
              checked={settings.randomizeAnswers}
              onCheckedChange={(v) => updateSetting("randomizeAnswers", v)}
              data-ocid="toggle-randomize-answers"
            />
            <Label
              htmlFor="randomize-answers"
              className="text-sm cursor-pointer"
            >
              Randomize Answers
            </Label>
          </div>
        </div>
      </div>

      {/* ── EXAM CARDS GRID ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6" data-ocid="exam-list">
        {EXAM_CONFIGS.map((config) => {
          const best = getBestAttempt(config.id);
          const last = getLastAttempt(config.id);
          const resume = getResumeState(config.id);
          const attemptCount = attempts.filter(
            (a) => a.examId === config.id,
          ).length;
          const diffVariant = DIFFICULTY_VARIANTS[config.difficulty] ?? {
            cls: "bg-muted text-muted-foreground border border-border",
            label: config.difficulty,
          };

          return (
            <Card
              key={config.id}
              className="relative flex flex-col gap-0 border border-border hover:border-primary/50 transition-smooth overflow-hidden group"
              data-ocid={`exam-card-${config.id}`}
            >
              {/* Top accent line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 via-accent/60 to-transparent" />

              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                        {config.id}
                      </span>
                      <h2 className="font-display font-bold text-base leading-tight truncate">
                        {config.title}
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${diffVariant.cls}`}
                  >
                    {diffVariant.label}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary/70" />
                    {config.timeLimitMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary/70" />
                    {config.questionCount} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-accent/80" />
                    Pass: {config.passThreshold}%
                  </span>
                  {attemptCount > 0 && (
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                      {attemptCount} attempt{attemptCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Best score bar */}
                {best ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Best score</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full text-xs ${BADGE_SCORE_CLS[getBadge(best.percentage)]}`}
                      >
                        {best.percentage}% — {getBadge(best.percentage)}
                      </span>
                    </div>
                    <Progress
                      value={best.percentage}
                      className="h-2 progress-gold"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/40 border border-dashed border-border/60 p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      No attempts yet
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Start to track your progress
                    </p>
                  </div>
                )}

                {/* Last attempt + pass/fail chip */}
                {last && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Last: {last.percentage}% •{" "}
                      {new Date(last.completedAt).toLocaleDateString()} •{" "}
                      {formatTime(last.timeSpentSeconds)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        last.passed
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-destructive/15 text-destructive border border-destructive/30"
                      }`}
                    >
                      {last.passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                )}

                <Separator />

                {/* CTA row */}
                <div className="flex gap-2">
                  {resume && (
                    <Link
                      to="/exam/$examId"
                      params={{ examId: String(config.id) }}
                      className="flex-1"
                      data-ocid={`resume-exam-${config.id}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Resume
                      </Button>
                    </Link>
                  )}
                  <Link
                    to="/exam/$examId"
                    params={{ examId: String(config.id) }}
                    className="flex-1"
                    data-ocid={`start-exam-${config.id}`}
                  >
                    <Button size="sm" className="w-full gap-1.5 font-semibold">
                      {attemptCount > 0 ? "Retake Exam" : "Start Exam"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* View history link */}
                {attemptCount > 0 && (
                  <Link
                    to="/history/$examId"
                    params={{ examId: String(config.id) }}
                    className="text-xs text-primary hover:underline text-center -mt-2"
                    data-ocid={`view-history-${config.id}`}
                  >
                    View attempt history →
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── OVERALL STATS ───────────────────────────────────────────── */}
      {totalAttempts > 0 && (
        <div
          className="mb-6 rounded-xl border border-border bg-card overflow-hidden"
          data-ocid="stats-strip"
        >
          <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BarChart3 className="w-4 h-4 text-primary" />
              Your Progress
            </div>
            <Link to="/dashboard" data-ocid="view-dashboard-btn">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs h-7 text-primary"
              >
                Full Dashboard <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
            {[
              {
                icon: BookOpen,
                label: "Total Attempts",
                value: String(totalAttempts),
              },
              {
                icon: BarChart3,
                label: "Avg Score",
                value: `${avgScore}%`,
              },
              {
                icon: Trophy,
                label: "Pass Rate",
                value: `${passRate}%`,
              },
              {
                icon: FlameIcon,
                label: "Study Streak",
                value: `${streak} ${streak === 1 ? "day" : "days"}`,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="px-4 py-4 text-center">
                <Icon className="w-4 h-4 text-primary mx-auto mb-1.5 opacity-70" />
                <p className="font-display font-bold text-xl">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          {bestBadge && (
            <div className="px-5 py-2.5 border-t border-border bg-muted/20 flex items-center gap-2 text-xs text-muted-foreground">
              <Award className="w-3.5 h-3.5 text-accent" />
              Best badge earned:
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${BADGE_SCORE_CLS[bestBadge]}`}
              >
                {bestBadge}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── BADGE SYSTEM EXPLAINER ──────────────────────────────────── */}
      <div
        className="rounded-xl border border-border bg-card overflow-hidden"
        data-ocid="badge-explainer"
      >
        <button
          type="button"
          onClick={() => setBadgesOpen((o) => !o)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-sm font-semibold hover:bg-muted/30 transition-colors"
          data-ocid="toggle-badge-explainer"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            Achievement Badges
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${badgesOpen ? "rotate-90" : ""}`}
          />
        </button>

        {badgesOpen && (
          <>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y sm:divide-y-0 divide-border">
              {BADGE_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className="p-4 flex flex-col items-center text-center gap-2"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${tier.glow}`}
                  >
                    {tier.icon}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.cls}`}
                    >
                      {tier.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tier.range}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
              Earn{" "}
              <span className="text-primary font-medium">Academy Bound</span> or
              higher to demonstrate exam readiness. Pass threshold is{" "}
              <span className="text-accent font-medium">80%</span> on all exams.
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default HomePage;
