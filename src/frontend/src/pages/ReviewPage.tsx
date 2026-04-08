import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EXAM_QUESTIONS } from "@/data/examData";
import type { Question } from "@/data/types";
import { getBadge } from "@/lib/examUtils";
import { getAllAttempts } from "@/lib/storage";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type FilterMode = "all" | "correct" | "incorrect";

function PassageBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="mb-3 border border-border rounded-lg overflow-hidden"
      data-ocid="review-passage-accordion"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4" /> Reading Passage
        </span>
        {open ? (
          <ChevronLeft className="w-4 h-4 rotate-90" />
        ) : (
          <ChevronRight className="w-4 h-4 rotate-90" />
        )}
      </button>
      {open && (
        <div className="px-4 py-3 text-sm italic leading-relaxed text-muted-foreground bg-muted/20">
          {text}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  q,
  userAnswer,
}: {
  q: Question;
  userAnswer: string | undefined;
}) {
  const isCorrect = userAnswer === q.correctAnswer;

  return (
    <Card
      className="border border-border overflow-hidden"
      data-ocid="review-question-card"
    >
      {/* Category & difficulty header */}
      <div className="flex flex-wrap gap-2 px-5 pt-4 pb-2">
        <Badge variant="secondary" className="text-xs">
          {q.category}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {q.difficulty}
        </Badge>
        {isCorrect ? (
          <Badge className="text-xs bg-accent/20 text-accent border border-accent/30">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Correct
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            <XCircle className="w-3 h-3 mr-1" /> Incorrect
          </Badge>
        )}
      </div>

      {/* Passage (if any) */}
      {q.passage && (
        <div className="px-5">
          <PassageBlock text={q.passage} />
        </div>
      )}

      {/* Question text */}
      <div className="px-5 pb-3">
        <p className="font-medium text-sm sm:text-base leading-relaxed">
          {q.text}
        </p>
      </div>

      {/* Answer options */}
      <div className="px-5 pb-4 space-y-2">
        {(Object.entries(q.options) as [string, string][]).map(
          ([key, text]) => {
            const isThisCorrect = key === q.correctAnswer;
            const isUserAns = userAnswer === key;
            let cls =
              "flex items-start gap-3 p-3 rounded-lg border text-sm transition-colors";
            if (isThisCorrect) {
              cls += " bg-accent/10 border-accent/40";
            } else if (isUserAns) {
              cls += " bg-destructive/10 border-destructive/40";
            } else {
              cls += " border-border text-muted-foreground";
            }
            return (
              <div key={key} className={cls} data-ocid={`review-option-${key}`}>
                <div className="shrink-0 mt-0.5">
                  {isThisCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  ) : isUserAns ? (
                    <XCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border" />
                  )}
                </div>
                <span className="min-w-0">
                  <strong className="mr-1">{key}.</strong>
                  {text}
                  {isThisCorrect && (
                    <span className="ml-2 text-xs font-semibold text-accent">
                      ✓ Correct Answer
                    </span>
                  )}
                  {!isThisCorrect && isUserAns && (
                    <span className="ml-2 text-xs font-semibold text-destructive">
                      ✗ Your Answer
                    </span>
                  )}
                </span>
              </div>
            );
          },
        )}
      </div>

      <Separator />

      {/* Explanation */}
      <div
        className="px-5 py-4 bg-primary/5 border-t border-border"
        data-ocid="review-explanation"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">
          Explanation
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {q.explanation}
        </p>
      </div>
    </Card>
  );
}

export function ReviewPage() {
  const { attemptId } = useParams({ from: "/review/$attemptId" });
  const attempt = getAllAttempts().find((a) => a.id === attemptId);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!attempt) {
    return (
      <Layout>
        <div
          className="text-center py-24 space-y-4"
          data-ocid="review-not-found"
        >
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
          <p className="font-display font-semibold text-lg">
            Attempt Not Found
          </p>
          <p className="text-muted-foreground text-sm">
            This review session may have been cleared.
          </p>
          <Link to="/">
            <Button className="mt-2">Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const allQuestions: Question[] = EXAM_QUESTIONS[attempt.examId] ?? [];
  const badge = getBadge(attempt.percentage);

  const categories = Array.from(new Set(allQuestions.map((q) => q.category)));

  const filteredQuestions = allQuestions.filter((q) => {
    const userAns = attempt.answers[q.id];
    const passesResult =
      filter === "all" ||
      (filter === "correct" && userAns === q.correctAnswer) ||
      (filter === "incorrect" && userAns !== q.correctAnswer);
    const passesCat = categoryFilter === "all" || q.category === categoryFilter;
    return passesResult && passesCat;
  });

  const currentQ: Question | undefined = filteredQuestions[currentIdx];
  const correctCount = allQuestions.filter(
    (q) => attempt.answers[q.id] === q.correctAnswer,
  ).length;
  const incorrectCount = allQuestions.length - correctCount;

  function jumpTo(idx: number) {
    setCurrentIdx(Math.max(0, Math.min(filteredQuestions.length - 1, idx)));
  }

  return (
    <Layout>
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/results/$attemptId" params={{ attemptId }}>
          <Button variant="ghost" size="icon" aria-label="Back to results">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-xl truncate">
            Answer Review
          </h1>
          <p className="text-xs text-muted-foreground truncate">
            {attempt.examTitle}
          </p>
        </div>
        <Badge
          variant={attempt.passed ? "default" : "destructive"}
          className="shrink-0 text-xs"
          data-ocid="review-score-badge"
        >
          {attempt.score}/{attempt.totalQuestions} — {badge}
        </Badge>
      </div>

      {/* ─── FILTER CONTROLS ────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-5"
        data-ocid="review-filter-controls"
      >
        {/* Result filter */}
        <div className="flex gap-2 flex-wrap" data-ocid="review-filter-tabs">
          {(["all", "correct", "incorrect"] as FilterMode[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter(f);
                setCurrentIdx(0);
              }}
              className="gap-1 capitalize text-xs"
              data-ocid={`filter-${f}`}
            >
              {f === "correct" && (
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              )}
              {f === "incorrect" && (
                <XCircle className="w-3.5 h-3.5 text-destructive" />
              )}
              {f === "all" && <BookOpen className="w-3.5 h-3.5" />}
              {f === "all"
                ? `All (${allQuestions.length})`
                : f === "correct"
                  ? `Correct (${correctCount})`
                  : `Incorrect (${incorrectCount})`}
            </Button>
          ))}
        </div>

        {/* Category filter */}
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setCurrentIdx(0);
          }}
        >
          <SelectTrigger
            className="w-full sm:w-52 text-xs h-9"
            data-ocid="category-filter-select"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-xs">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ─── QUESTION AREA ──────────────────────────────────── */}
      {filteredQuestions.length === 0 ? (
        <Card className="p-10 text-center border border-dashed border-border">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground text-sm">
            No questions match this filter.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Question {currentIdx + 1} of {filteredQuestions.length}
            </span>
            <span>
              Q#{currentQ?.number} — {currentQ?.category}
            </span>
          </div>

          {currentQ && (
            <QuestionCard
              q={currentQ}
              userAnswer={attempt.answers[currentQ.id]}
            />
          )}

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpTo(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="gap-1"
              data-ocid="review-prev"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentIdx + 1} / {filteredQuestions.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpTo(currentIdx + 1)}
              disabled={currentIdx >= filteredQuestions.length - 1}
              className="gap-1"
              data-ocid="review-next"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Jump-to grid */}
          <Card
            className="p-4 border border-border"
            data-ocid="review-jump-grid"
          >
            <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">
              Jump to Question
            </p>
            <div className="flex flex-wrap gap-1.5">
              {filteredQuestions.map((q, idx) => {
                const isQCorrect = attempt.answers[q.id] === q.correctAnswer;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    aria-label={`Jump to question ${idx + 1}`}
                    className={`w-8 h-8 rounded text-xs font-medium transition-smooth focus-visible:ring-2 focus-visible:ring-ring ${
                      idx === currentIdx
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
                        : isQCorrect
                          ? "bg-accent/25 text-accent-foreground hover:bg-accent/40"
                          : "bg-destructive/20 text-destructive-foreground hover:bg-destructive/30"
                    }`}
                    data-ocid={`review-jump-${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      <Separator className="my-6" />

      {/* ─── BOTTOM ACTIONS ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3" data-ocid="review-bottom-actions">
        <Link to="/results/$attemptId" params={{ attemptId }}>
          <Button
            variant="outline"
            className="gap-2"
            data-ocid="back-to-results-btn"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </Button>
        </Link>
        <Link to="/exam/$examId" params={{ examId: String(attempt.examId) }}>
          <Button className="gap-2" data-ocid="retake-from-review-btn">
            <RefreshCw className="w-4 h-4" /> Retake Exam
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
