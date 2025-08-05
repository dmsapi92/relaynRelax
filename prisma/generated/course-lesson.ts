import { LessonType } from "./enums";
import { CourseSectionModel, CourseSectionCreateInput } from "./course-section";
import { LessonProgressModel, LessonProgressCreateInput } from "./lesson-progress";

export interface CourseLessonModel {
  id: string;
  title: string;
  content: string;
  duration: number;
  type: LessonType;
  videoUrl: string | null;
  attachments: string[];
  section?: CourseSectionModel;
  sectionId: string;
  progress?: LessonProgressModel[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseLessonCreateInput {
  id?: string;
  title: string;
  content: string;
  duration: number;
  type: LessonType;
  videoUrl?: string | null;
  attachments: string[];
  sectionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseLessonRelationalCreateInput extends CourseLessonCreateInput {
  section?: CourseSectionCreateInput;
  progress?: LessonProgressCreateInput | LessonProgressCreateInput[];
}

export type CourseLessonUpdateInput = Partial<CourseLessonCreateInput>;

