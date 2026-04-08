import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { ExamAttempt } from "@/data/types";
import { formatTime, getBadge, getExamConfig } from "@/lib/examUtils";
import { getAllAttempts, saveAttempt } from "@/lib/storage";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  Target,
  Trash2,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const BADGE_STYLE: Record<string, string> = {
  "Top Candidate": "bg-accent/20 text-accent border border-accent/40",
  "Academy Bound": "bg-primary/20 text-primary border border-primary/30",
  Ready: "bg-secondary text-secondary-foreground border border-border",
  Rookie: "bg-muted text-muted-foreground border border-border",
};

const BADGE_EMOJI: Record<string, string> = {
  "Top Candidate": "🏆",
  "Academy Bound": "🎖️",
  Ready: "⭐",
  Rookie: "🔰",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="text-muted-foreground/70">{icon}</span>
      <span className="font-medium text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}

export function HistoryPage() {
  const { examId } = useParams({ from: "/history/$examId" });
  const examIdNum = Number.parseInt(examId, 10);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  // All hooks must be called unconditionally before any early return
  const [allAttempts, setAllAttempts] = useState<ExamAttempt[]>(() =>
    getAllAttempts(),
  );

  const validIds = [1, 2, 3, 4];
  if (!validIds.includes(examIdNum)) {
    return (
      <Layout>
        <div
          className="text-center py-24 space-y-4"
          data-ocid="history-invalid-exam"
        >
          <Target className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
          <p className="font-display font-semibold text-lg">Exam Not Found</p>
          <Link to="/">
            <Button className="mt-2">Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const config = getExamConfig(examIdNum);

  const attempts = allAttempts
    .filter((a) => a.examId === examIdNum)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  const bestAttempt =
    attempts.length > 0
      ? attempts.reduce(
          (best, a) => (a.percentage > best.percentage ? a : best),
          attempts[0],
        )
      : null;

  const avgPercentage =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length,
        )
      : 0;

  const passCount = attempts.filter((a) => a.passed).length;

  function clearThisExamHistory() {
    // Keep all other exams' attempts, remove this exam's
    const remaining = getAllAttempts().filter((a) => a.examId !== examIdNum);
    // Reset storage: delete all then re-save remaining
    localStorage.removeItem("police_exam_attempts");
    for (const a of remaining) {
      saveAttempt(a);
    }
    setAllAttempts(remaining);
    setConfirmOpen(false);
  }

  return (
    <Layout>
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/">
          <Button variant="ghost" size="icon" aria-label="Back to home">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-xl truncate">
            {config.title}
          </h1>
          <p className="text-xs text-muted-foreground">Attempt History</p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {attempts.length} {attempts.length === 1 ? "attempt" : "attempts"}
        </Badge>
      </div>

      {/* ─── STATS SUMMARY (shown if attempts exist) ───────── */}
      {attempts.length > 0 && bestAttempt && (
        <div
          className="grid grid-cols-3 gap-3 mb-5"
          data-ocid="history-stats-grid"
        >
          <Card className="p-4 border border-border text-center">
            <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="font-display font-bold text-xl">
              {bestAttempt.percentage}%
            </p>
            <p className="text-xs text-muted-foreground">Best Score</p>
          </Card>
          <Card className="p-4 border border-border text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="font-display font-bold text-xl">{avgPercentage}%</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </Card>
          <Card className="p-4 border border-border text-center">
            <CheckCircle2 className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="font-display font-bold text-xl">
              {passCount}/{attempts.length}
            </p>
            <p className="text-xs text-muted-foreground">Passes</p>
          </Card>
        </div>
      )}

      {/* ─── BEST BADGE BANNER ─────────────────────────────── */}
      {bestAttempt && (
        <div
          className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-5 flex items-center justify-between gap-3"
          data-ocid="best-score-banner"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl shrink-0">
              {BADGE_EMOJI[getBadge(bestAttempt.percentage)]}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Personal Best</p>
              <p className="font-display font-bold text-lg">
                {bestAttempt.percentage}%
              </p>
              <p className="text-xs text-muted-foreground">
                {bestAttempt.score}/{bestAttempt.totalQuestions} correct
              </p>
            </div>
          </div>
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 ${BADGE_STYLE[getBadge(bestAttempt.percentage)]}`}
          >
            {getBadge(bestAttempt.percentage)}
          </span>
        </div>
      )}

      {/* ─── ATTEMPTS LIST ──────────────────────────────────── */}
      {attempts.length === 0 ? (
        <Card
          className="p-12 text-center border border-dashed border-border"
          data-ocid="no-attempts"
        >
          <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <p className="font-display font-semibold text-lg mb-1">
            No Attempts Yet
          </p>
          <p className="text-muted-foreground text-sm mb-5">
            Take the exam to start building your history.
          </p>
          <Link to="/exam/$examId" params={{ examId }}>
            <Button data-ocid="start-exam-cta">
              <Target className="w-4 h-4 mr-2" /> Start Exam
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3" data-ocid="attempt-list">
          {attempts.map((attempt, idx) => {
            const badge = getBadge(attempt.percentage);
            const isBest = attempt.id === bestAttempt?.id;
            const attemptNumber = attempts.length - idx;
            return (
              <Card
                key={attempt.id}
                className={`border transition-smooth hover:border-primary/30 ${
                  isBest ? "border-accent/40 bg-accent/5" : "border-border"
                }`}
                data-ocid={`attempt-row-${idx}`}
              >
                <div className="p-4">
                  {/* Row 1: attempt # + date + badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                        <span>Attempt #{attemptNumber}</span>
                        {isBest && (
                          <span className="text-xs text-accent font-bold bg-accent/15 px-1.5 py-0.5 rounded">
                            🏆 Best
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <CalendarDays className="w-3 h-3 shrink-0" />
                        {formatDate(attempt.completedAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${BADGE_STYLE[badge]}`}
                    >
                      {BADGE_EMOJI[badge]} {badge}
                    </span>
                  </div>

                  {/* Row 2: score stats */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-2xl text-primary">
                        {attempt.percentage}%
                      </span>
                    </div>
                    <StatPill
                      icon={<Target className="w-3 h-3" />}
                      value={`${attempt.score}/${attempt.totalQuestions}`}
                      label="correct"
                    />
                    <StatPill
                      icon={<Clock className="w-3 h-3" />}
                      value={formatTime(attempt.timeSpentSeconds)}
                      label="time"
                    />
                    <div className="flex items-center gap-1">
                      {attempt.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-destructive" />
                      )}
                      <span
                        className={`text-xs font-bold ${attempt.passed ? "text-accent" : "text-destructive"}`}
                      >
                        {attempt.passed ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <Progress
                    value={attempt.percentage}
                    className="h-1.5 progress-gold mb-3"
                  />

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-wrap">
                    <Link
                      to="/results/$attemptId"
                      params={{ attemptId: attempt.id }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs h-8"
                        data-ocid={`view-results-${idx}`}
                      >
                        Results
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Link
                      to="/review/$attemptId"
                      params={{ attemptId: attempt.id }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs h-8"
                        data-ocid={`review-${idx}`}
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Separator className="my-6" />

      {/* ─── FOOTER ACTIONS ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <Button
            className="gap-2"
            data-ocid="retake-from-history"
            onClick={() =>
              void navigate({
                to: "/exam/$examId",
                params: { examId },
              })
            }
          >
            <RefreshCw className="w-4 h-4" /> Retake Exam
          </Button>
          <Link to="/dashboard">
            <Button variant="outline" data-ocid="dashboard-from-history">
              View Dashboard
            </Button>
          </Link>
        </div>

        {/* Clear history with confirmation */}
        {attempts.length > 0 && (
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                data-ocid="clear-history-btn"
              >
                <Trash2 className="w-4 h-4" /> Clear History
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="clear-history-dialog">
              <DialogHeader>
                <DialogTitle>Clear Attempt History?</DialogTitle>
                <DialogDescription>
                  This will permanently delete all {attempts.length} attempt
                  {attempts.length !== 1 ? "s" : ""} for {config.title}. History
                  from other exams will not be affected.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setConfirmOpen(false)}
                  data-ocid="clear-history-cancel"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={clearThisExamHistory}
                  data-ocid="clear-history-confirm"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
