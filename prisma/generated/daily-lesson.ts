import { LessonStatus } from "./enums";
import { LessonPlanModel, LessonPlanCreateInput } from "./lesson-plan";

export interface DailyLessonModel {
  id: string;
  lessonPlan?: LessonPlanModel;
  lessonPlanId: string;
  date: string;
  startPage: number | null;
  endPage: number | null;
  chapter: string;
  status: LessonStatus;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyLessonCreateInput {
  id?: string;
  lessonPlanId?: string;
  date: string;
  startPage?: number | null;
  endPage?: number | null;
  chapter: string;
  status?: LessonStatus;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyLessonRelationalCreateInput extends DailyLessonCreateInput {
  lessonPlan?: LessonPlanCreateInput;
}

export type DailyLessonUpdateInput = Partial<DailyLessonCreateInput>;

