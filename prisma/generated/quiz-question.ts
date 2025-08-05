import { QuestionType } from "./enums";
import { QuizModel, QuizCreateInput } from "./quiz";

export interface QuizQuestionModel {
  id: string;
  quiz?: QuizModel;
  quizId: string;
  question: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  marks: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestionCreateInput {
  id?: string;
  quizId?: string;
  question: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  marks: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestionRelationalCreateInput extends QuizQuestionCreateInput {
  quiz?: QuizCreateInput;
}

export type QuizQuestionUpdateInput = Partial<QuizQuestionCreateInput>;

