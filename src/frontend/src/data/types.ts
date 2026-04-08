export interface Question {
  id: string;
  examId: number;
  number: number;
  text: string;
  passage?: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface ExamConfig {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  questionCount: number;
  timeLimitMinutes: number;
  passThreshold: number;
  categories: string[];
}

export interface ExamAttempt {
  id: string;
  examId: number;
  examTitle: string;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
  answers: Record<string, string>; // questionId -> selectedOption
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  badge: "Rookie" | "Ready" | "Academy Bound" | "Top Candidate";
  categoryScores: Record<
    string,
    { correct: number; total: number; percentage: number }
  >;
  settings: { randomizeQuestions: boolean; randomizeAnswers: boolean };
}

export interface ResumeState {
  examId: number;
  currentQuestion: number;
  answers: Record<string, string>;
  startedAt: string;
  timeRemainingSeconds: number;
  questionOrder: string[];
  answerOrders: Record<string, [string, string][]>;
  settings: { randomizeQuestions: boolean; randomizeAnswers: boolean };
}
