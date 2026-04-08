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
} from "@/components/ui/alert-dialog";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EXAM_QUESTIONS } from "@/data/examData";
import type { Question, ResumeState } from "@/data/types";
import {
  calculateScore,
  formatTime,
  generateAttemptId,
  getExamConfig,
  shuffleArray,
} from "@/lib/examUtils";
import {
  clearResumeState,
  getResumeState,
  getSettings,
  saveAttempt,
  saveResumeState,
} from "@/lib/storage";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ExamState {
  questionOrder: string[];
  answerOrders: Record<string, [string, string][]>;
  currentIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  initialized: boolean;
}

type InitMode = "idle" | "resume-prompt" | "running";

function buildFreshState(
  examIdNum: number,
  allQuestions: Question[],
): ExamState {
  const settings = getSettings();
  const allIds = allQuestions.map((q) => q.id);
  const order = settings.randomizeQuestions ? shuffleArray(allIds) : allIds;
  const orders: Record<string, [string, string][]> = {};
  for (const qId of order) {
    const q = allQuestions.find((x) => x.id === qId);
    if (!q) continue;
    const pairs = Object.entries(q.options) as [string, string][];
    orders[qId] = settings.randomizeAnswers ? shuffleArray(pairs) : pairs;
  }
  const config = getExamConfig(examIdNum);
  return {
    questionOrder: order,
    answerOrders: orders,
    currentIndex: 0,
    answers: {},
    timeRemaining: config.timeLimitMinutes * 60,
    initialized: true,
  };
}

function buildResumedState(resume: ResumeState): ExamState {
  return {
    questionOrder: resume.questionOrder,
    answerOrders: resume.answerOrders,
    currentIndex: resume.currentQuestion,
    answers: resume.answers,
    timeRemaining: resume.timeRemainingSeconds,
    initialized: true,
  };
}

export function ExamPage() {
  const { examId } = useParams({ from: "/exam/$examId" });
  const navigate = useNavigate();
  const examIdNum = Number.parseInt(examId, 10);

  // Guard invalid examId
  const isValidExam = [1, 2, 3, 4].includes(examIdNum);

  // Safe config — only call if valid
  const config = isValidExam ? getExamConfig(examIdNum) : null;
  const questions: Question[] = isValidExam
    ? (EXAM_QUESTIONS[examIdNum] ?? [])
    : [];

  const [initMode, setInitMode] = useState<InitMode>("idle");
  const [pendingResume, setPendingResume] = useState<ResumeState | null>(null);
  const [state, setState] = useState<ExamState>({
    questionOrder: [],
    answerOrders: {},
    currentIndex: 0,
    answers: {},
    timeRemaining: 0,
    initialized: false,
  });
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const startedAtRef = useRef(new Date().toISOString());
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);
  const stateRef = useRef(state);

  // Keep stateRef in sync for beforeunload
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Redirect to home if invalid
  useEffect(() => {
    if (!isValidExam) {
      void navigate({ to: "/" });
    }
  }, [isValidExam, navigate]);

  // On mount: check for resume state
  useEffect(() => {
    if (!isValidExam) return;
    const resume = getResumeState(examIdNum);
    if (resume && resume.questionOrder.length > 0) {
      setPendingResume(resume);
      setInitMode("resume-prompt");
    } else {
      const fresh = buildFreshState(examIdNum, questions);
      setState(fresh);
      setInitMode("running");
    }
  }, [examIdNum, isValidExam, questions]);

  const startFresh = useCallback(() => {
    clearResumeState(examIdNum);
    startedAtRef.current = new Date().toISOString();
    startTimeRef.current = Date.now();
    submittedRef.current = false;
    const fresh = buildFreshState(examIdNum, questions);
    setState(fresh);
    setPendingResume(null);
    setInitMode("running");
  }, [examIdNum, questions]);

  const resumeExam = useCallback(() => {
    if (!pendingResume) return;
    startedAtRef.current = pendingResume.startedAt;
    startTimeRef.current = Date.now();
    submittedRef.current = false;
    const resumed = buildResumedState(pendingResume);
    setState(resumed);
    setPendingResume(null);
    setInitMode("running");
  }, [pendingResume]);

  const doSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    clearResumeState(examIdNum);
    const settings = getSettings();
    const currentState = stateRef.current;
    const activeQuestions = currentState.questionOrder
      .map((id) => questions.find((q) => q.id === id))
      .filter(Boolean) as Question[];
    const result = calculateScore(currentState.answers, activeQuestions);
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const attempt = {
      id: generateAttemptId(),
      examId: examIdNum,
      examTitle: config?.title ?? "",
      startedAt: startedAtRef.current,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      answers: currentState.answers,
      score: result.score,
      totalQuestions: result.total,
      percentage: result.percentage,
      passed: result.passed,
      badge: result.badge,
      categoryScores: result.categoryScores,
      settings: {
        randomizeQuestions: settings.randomizeQuestions,
        randomizeAnswers: settings.randomizeAnswers,
      },
    };
    saveAttempt(attempt);
    void navigate({
      to: "/results/$attemptId",
      params: { attemptId: attempt.id },
    });
  }, [examIdNum, config, navigate, questions]);

  // Start timer once running
  useEffect(() => {
    if (initMode !== "running" || !state.initialized) return;
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timerRef.current!);
          setTimeout(() => doSubmit(), 0);
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initMode, state.initialized, doSubmit]);

  // Persist resume state on answer/position changes
  useEffect(() => {
    if (
      initMode !== "running" ||
      !state.initialized ||
      state.questionOrder.length === 0
    )
      return;
    const settings = getSettings();
    const resume: ResumeState = {
      examId: examIdNum,
      currentQuestion: state.currentIndex,
      answers: state.answers,
      startedAt: startedAtRef.current,
      timeRemainingSeconds: state.timeRemaining,
      questionOrder: state.questionOrder,
      answerOrders: state.answerOrders,
      settings: {
        randomizeQuestions: settings.randomizeQuestions,
        randomizeAnswers: settings.randomizeAnswers,
      },
    };
    saveResumeState(resume);
  }, [
    initMode,
    state.initialized,
    state.answers,
    state.currentIndex,
    state.questionOrder,
    state.answerOrders,
    state.timeRemaining,
    examIdNum,
  ]);

  // Save on beforeunload
  useEffect(() => {
    const handler = () => {
      if (submittedRef.current || initMode !== "running") return;
      const s = stateRef.current;
      if (s.questionOrder.length === 0) return;
      const settings = getSettings();
      const resume: ResumeState = {
        examId: examIdNum,
        currentQuestion: s.currentIndex,
        answers: s.answers,
        startedAt: startedAtRef.current,
        timeRemainingSeconds: s.timeRemaining,
        questionOrder: s.questionOrder,
        answerOrders: s.answerOrders,
        settings: {
          randomizeQuestions: settings.randomizeQuestions,
          randomizeAnswers: settings.randomizeAnswers,
        },
      };
      saveResumeState(resume);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [examIdNum, initMode]);

  // Keyboard shortcuts
  useEffect(() => {
    if (initMode !== "running") return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowLeft":
          setState((prev) => ({
            ...prev,
            currentIndex: Math.max(0, prev.currentIndex - 1),
          }));
          break;
        case "ArrowRight":
          setState((prev) => {
            const totalQ = Math.min(
              prev.questionOrder.length,
              config?.questionCount ?? 0,
            );
            return {
              ...prev,
              currentIndex: Math.min(totalQ - 1, prev.currentIndex + 1),
            };
          });
          break;
        case "a":
        case "A":
          setAnswerByKey("A");
          break;
        case "b":
        case "B":
          setAnswerByKey("B");
          break;
        case "c":
        case "C":
          setAnswerByKey("C");
          break;
        case "d":
        case "D":
          setAnswerByKey("D");
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initMode, config]);

  // Not valid or not loaded
  if (!isValidExam || !config) return null;

  const {
    questionOrder,
    answerOrders,
    currentIndex,
    answers,
    timeRemaining,
    initialized,
  } = state;

  // Resume prompt dialog
  if (initMode === "resume-prompt" && pendingResume) {
    const resumeQ = pendingResume.currentQuestion + 1;
    const resumeTotal = pendingResume.questionOrder.length;
    return (
      <Layout>
        <Dialog open>
          <DialogContent className="max-w-sm mx-auto" data-ocid="resume-dialog">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <DialogTitle className="text-lg">
                  Resume {config.title}?
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm space-y-1">
                <span className="block">
                  You left off at question{" "}
                  <strong className="text-foreground">
                    {resumeQ} of {resumeTotal}
                  </strong>
                </span>
                <span className="block text-muted-foreground">
                  Time remaining:{" "}
                  <strong className="text-foreground font-mono">
                    {formatTime(pendingResume.timeRemainingSeconds)}
                  </strong>
                </span>
                <span className="block text-muted-foreground">
                  Answers saved:{" "}
                  <strong className="text-foreground">
                    {Object.keys(pendingResume.answers).length}
                  </strong>
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={startFresh}
                data-ocid="start-fresh-btn"
              >
                Start Fresh
              </Button>
              <Button
                className="flex-1"
                onClick={resumeExam}
                data-ocid="resume-btn"
              >
                Resume Exam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    );
  }

  if (!initialized || questionOrder.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center space-y-3">
            <Shield className="w-12 h-12 text-primary mx-auto animate-pulse" />
            <p className="text-muted-foreground">Loading exam...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const currentQId = questionOrder[currentIndex];
  const currentQ = questions.find((q) => q.id === currentQId);
  const currentAnswerOrder = answerOrders[currentQId] ?? [];
  const totalQ = Math.min(questionOrder.length, config.questionCount);
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / totalQ) * 100);
  const isLowTime = timeRemaining < 300;
  const unanswered = totalQ - answered;

  if (!currentQ) return null;

  function setAnswerByKey(key: string) {
    const qId = stateRef.current.questionOrder[stateRef.current.currentIndex];
    if (!qId) return;
    // Validate the key exists in the answer order for this question
    const order = stateRef.current.answerOrders[qId] ?? [];
    const valid = order.some(([k]) => k === key);
    if (!valid) return;
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qId]: key },
    }));
  }

  const setAnswer = (key: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentQId]: key },
    }));
  };

  const goTo = (idx: number) =>
    setState((prev) => ({ ...prev, currentIndex: idx }));

  return (
    <Layout>
      {/* Sticky exam header */}
      <div
        className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border pb-3 mb-6 -mx-4 px-4 pt-3"
        data-ocid="exam-header"
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Badge
              variant="secondary"
              className="text-xs font-mono whitespace-nowrap shrink-0"
            >
              {currentIndex + 1} / {totalQ}
            </Badge>
            <span className="text-sm font-medium text-foreground truncate hidden sm:block">
              {config.title}
            </span>
            <Badge
              variant="outline"
              className="text-xs whitespace-nowrap hidden md:inline-flex"
            >
              {config.difficulty}
            </Badge>
          </div>

          <div
            className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1.5 rounded-full transition-colors ${
              isLowTime
                ? "bg-destructive/20 text-destructive border border-destructive/40 animate-pulse"
                : "bg-card border border-border text-foreground"
            }`}
            data-ocid="timer"
            aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <Progress
          value={progress}
          className="h-1.5 progress-gold"
          aria-label="Exam progress"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {answered} of {totalQ} answered
        </p>
      </div>

      {/* Question area */}
      <div className="space-y-4 pb-6">
        {/* Passage block */}
        {currentQ.passage && (
          <Card
            className="p-4 bg-muted/30 border border-border text-sm leading-relaxed italic"
            data-ocid="question-passage"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 not-italic">
              Read the following passage:
            </p>
            <p className="text-muted-foreground">{currentQ.passage}</p>
          </Card>
        )}

        {/* Question card */}
        <Card className="p-5 border border-border" data-ocid="question-card">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {currentQ.category}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  currentQ.difficulty === "Hard"
                    ? "border-destructive/60 text-destructive"
                    : currentQ.difficulty === "Medium"
                      ? "border-accent/60 text-accent-foreground"
                      : "border-primary/60 text-primary"
                }`}
              >
                {currentQ.difficulty}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              Q{currentIndex + 1}
            </span>
          </div>

          <p
            className="font-medium text-base leading-relaxed mb-5"
            data-ocid="question-text"
          >
            {currentQ.text}
          </p>

          <RadioGroup
            value={answers[currentQId] ?? ""}
            onValueChange={setAnswer}
            className="space-y-2.5"
            data-ocid="answer-options"
          >
            {currentAnswerOrder.map(([key, text]) => (
              <Label
                key={key}
                htmlFor={`opt-${key}`}
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-smooth min-h-[48px] ${
                  answers[currentQId] === key
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
                data-ocid={`answer-option-${key}`}
              >
                <RadioGroupItem
                  value={key}
                  id={`opt-${key}`}
                  className="mt-0.5 shrink-0"
                />
                <span className="leading-snug flex-1 min-w-0">
                  <span className="font-bold mr-2">{key}.</span>
                  {text}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </Card>

        {/* Navigation row */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="gap-1"
            data-ocid="prev-question"
            aria-label="Previous question"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>

          {/* Submit button — always visible */}
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowSubmitDialog(true)}
            data-ocid="submit-exam-btn"
          >
            <Flag className="w-4 h-4" /> Submit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goTo(Math.min(totalQ - 1, currentIndex + 1))}
            disabled={currentIndex >= totalQ - 1}
            className="gap-1"
            data-ocid="next-question"
            aria-label="Next question"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Submit confirmation dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent data-ocid="submit-confirm-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answered} of {totalQ} questions.{" "}
                {unanswered > 0 ? (
                  <>
                    {unanswered} {unanswered === 1 ? "question" : "questions"}{" "}
                    will be left unanswered.{" "}
                  </>
                ) : (
                  <>All questions answered. </>
                )}
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="cancel-submit-btn">
                Continue Exam
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={doSubmit}
                data-ocid="confirm-submit-btn"
              >
                Submit Now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Question grid nav */}
        <Card
          className="p-4 border border-border"
          data-ocid="question-grid-nav"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground font-medium">
              Jump to question
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-sm bg-primary/80 mr-1 align-middle" />
              Current
              <span className="inline-block w-3 h-3 rounded-sm bg-accent/80 ml-3 mr-1 align-middle" />
              Answered
            </p>
          </div>
          <div
            className="flex flex-wrap gap-1.5"
            aria-label="Question navigation"
          >
            {questionOrder.slice(0, totalQ).map((qId, idx) => (
              <button
                key={qId}
                type="button"
                onClick={() => goTo(idx)}
                className={`w-8 h-8 rounded text-xs font-medium transition-smooth ${
                  idx === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : answers[qId]
                      ? "bg-accent/80 text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
                aria-label={`Go to question ${idx + 1}${answers[qId] ? ", answered" : ""}`}
                aria-current={idx === currentIndex ? "true" : undefined}
                data-ocid={`jump-q-${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </Card>

        {/* Keyboard shortcut hint */}
        <p className="text-center text-xs text-muted-foreground/60 hidden sm:block">
          Keyboard: A/B/C/D to select answer — Arrow keys to navigate
        </p>
      </div>
    </Layout>
  );
}

export default ExamPage;
