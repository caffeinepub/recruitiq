import type { ExamConfig, Question } from "../data/types";

export type BadgeType = "Rookie" | "Ready" | "Academy Bound" | "Top Candidate";

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getBadge(percentage: number): BadgeType {
  if (percentage >= 90) return "Top Candidate";
  if (percentage >= 80) return "Academy Bound";
  if (percentage >= 65) return "Ready";
  return "Rookie";
}

export function calculateScore(
  answers: Record<string, string>,
  questions: Question[],
): {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  badge: BadgeType;
  categoryScores: Record<
    string,
    { correct: number; total: number; percentage: number }
  >;
} {
  const categoryScores: Record<
    string,
    { correct: number; total: number; percentage: number }
  > = {};

  let score = 0;
  for (const q of questions) {
    if (!categoryScores[q.category]) {
      categoryScores[q.category] = { correct: 0, total: 0, percentage: 0 };
    }
    categoryScores[q.category].total++;
    if (answers[q.id] === q.correctAnswer) {
      score++;
      categoryScores[q.category].correct++;
    }
  }

  for (const cat of Object.keys(categoryScores)) {
    const cs = categoryScores[cat];
    cs.percentage =
      cs.total > 0 ? Math.round((cs.correct / cs.total) * 100) : 0;
  }

  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 80;
  const badge = getBadge(percentage);

  return { score, total, percentage, passed, badge, categoryScores };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function generateAttemptId(): string {
  return `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const ALL_CATEGORIES = [
  "Reading Comprehension",
  "Grammar and Spelling",
  "Vocabulary",
  "Report Writing",
  "Memory and Observation",
  "Arithmetic",
  "Word Problems",
  "Logic and Reasoning",
  "Map Reading",
  "Situational Judgment",
  "Ethical Decision Making",
  "Pattern Recognition",
  "Following Instructions",
  "Public Safety Communication",
  "Canadian Law Enforcement",
  "USA Law Enforcement",
];

const EXAM_CONFIGS: Record<number, ExamConfig> = {
  1: {
    id: 1,
    title: "Exam 1 – Foundation",
    description:
      "Entry-level police exam covering fundamental skills and knowledge.",
    difficulty: "Easy",
    questionCount: 100,
    timeLimitMinutes: 90,
    passThreshold: 80,
    categories: ALL_CATEGORIES,
  },
  2: {
    id: 2,
    title: "Exam 2 – Intermediate",
    description:
      "Building on fundamentals with medium-difficulty scenarios and reasoning.",
    difficulty: "Easy / Medium",
    questionCount: 100,
    timeLimitMinutes: 100,
    passThreshold: 80,
    categories: ALL_CATEGORIES,
  },
  3: {
    id: 3,
    title: "Exam 3 – Advanced",
    description:
      "Challenging exam with complex scenarios and advanced reasoning.",
    difficulty: "Medium / Hard",
    questionCount: 100,
    timeLimitMinutes: 110,
    passThreshold: 80,
    categories: ALL_CATEGORIES,
  },
  4: {
    id: 4,
    title: "Exam 4 – Elite",
    description:
      "Maximum difficulty exam for elite candidates targeting top scores.",
    difficulty: "Hard / Elite",
    questionCount: 100,
    timeLimitMinutes: 120,
    passThreshold: 80,
    categories: ALL_CATEGORIES,
  },
};

export function getExamConfig(examId: number): ExamConfig {
  const config = EXAM_CONFIGS[examId];
  if (!config) throw new Error(`Unknown exam ID: ${examId}`);
  return config;
}
