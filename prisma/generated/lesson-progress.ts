import { ProgressStatus } from "./enums";
import { CourseLessonModel, CourseLessonCreateInput } from "./course-lesson";

export interface LessonProgressModel {
  id: string;
  lesson?: CourseLessonModel;
  lessonId: string;
  studentId: string;
  status: ProgressStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgressCreateInput {
  id?: string;
  lessonId?: string;
  studentId: string;
  status?: ProgressStatus;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonProgressRelationalCreateInput extends LessonProgressCreateInput {
  lesson?: CourseLessonCreateInput;
}

export type LessonProgressUpdateInput = Partial<LessonProgressCreateInput>;

