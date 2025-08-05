import { CourseModel, CourseCreateInput } from "./course";
import { QuizQuestionModel, QuizQuestionCreateInput } from "./quiz-question";
import { QuizAttemptModel, QuizAttemptCreateInput } from "./quiz-attempt";

export interface QuizModel {
  id: string;
  title: string;
  description: string;
  course?: CourseModel;
  courseId: string;
  duration: number;
  totalMarks: number;
  questions?: QuizQuestionModel[];
  attempts?: QuizAttemptModel[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizCreateInput {
  id?: string;
  title: string;
  description: string;
  courseId?: string;
  duration: number;
  totalMarks: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizRelationalCreateInput extends QuizCreateInput {
  course?: CourseCreateInput;
  questions?: QuizQuestionCreateInput | QuizQuestionCreateInput[];
  attempts?: QuizAttemptCreateInput | QuizAttemptCreateInput[];
}

export type QuizUpdateInput = Partial<QuizCreateInput>;

