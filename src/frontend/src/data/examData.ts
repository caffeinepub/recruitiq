import { getExamConfig } from "../lib/examUtils";
import { exam1Questions } from "./exam1";
import { exam2Questions } from "./exam2";
import { exam3Questions } from "./exam3";
import { exam4Questions } from "./exam4";
import type { Question } from "./types";

export const EXAM_QUESTIONS: Record<number, Question[]> = {
  1: exam1Questions,
  2: exam2Questions,
  3: exam3Questions,
  4: exam4Questions,
};

export const ALL_CATEGORIES = [
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

export const EXAM_CONFIGS = [1, 2, 3, 4].map(getExamConfig);
