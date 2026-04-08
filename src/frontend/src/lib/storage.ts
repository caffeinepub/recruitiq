import type { ExamAttempt, ResumeState } from "../data/types";

export interface UserSettings {
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  darkMode: boolean;
}

const ATTEMPTS_KEY = "recruitiq_attempts";
const SETTINGS_KEY = "recruitiq_settings";

const resumeKey = (examId: number) => `recruitiq_resume_${examId}`;

export function saveAttempt(attempt: ExamAttempt): void {
  const existing = getAllAttempts();
  existing.push(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(existing));
}

export function getAttempts(examId?: number): ExamAttempt[] {
  const all = getAllAttempts();
  if (examId === undefined) return all;
  return all.filter((a) => a.examId === examId);
}

export function getAllAttempts(): ExamAttempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? (JSON.parse(raw) as ExamAttempt[]) : [];
  } catch {
    return [];
  }
}

export function deleteAllAttempts(): void {
  localStorage.removeItem(ATTEMPTS_KEY);
}

export function saveResumeState(state: ResumeState): void {
  localStorage.setItem(resumeKey(state.examId), JSON.stringify(state));
}

export function getResumeState(examId: number): ResumeState | null {
  try {
    const raw = localStorage.getItem(resumeKey(examId));
    return raw ? (JSON.parse(raw) as ResumeState) : null;
  } catch {
    return null;
  }
}

export function clearResumeState(examId: number): void {
  localStorage.removeItem(resumeKey(examId));
}

const DEFAULT_SETTINGS: UserSettings = {
  randomizeQuestions: false,
  randomizeAnswers: false,
  darkMode: true,
};

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as UserSettings) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
