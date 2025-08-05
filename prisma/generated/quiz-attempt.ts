import { AttemptStatus } from "./enums";
import { QuizModel, QuizCreateInput } from "./quiz";
import { QuizAnswerModel, QuizAnswerCreateInput } from "./quiz-answer";

export interface QuizAttemptModel {
  id: string;
  quiz?: QuizModel;
  quizId: string;
  studentId: string;
  answers?: QuizAnswerModel[];
  score: number;
  status: AttemptStatus;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttemptCreateInput {
  id?: string;
  quizId?: string;
  studentId: string;
  score: number;
  status?: AttemptStatus;
  startedAt?: string;
  endedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttemptRelationalCreateInput extends QuizAttemptCreateInput {
  quiz?: QuizCreateInput;
  answers?: QuizAnswerCreateInput | QuizAnswerCreateInput[];
}

export type QuizAttemptUpdateInput = Partial<QuizAttemptCreateInput>;

