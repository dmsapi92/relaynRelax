import { CourseModel, CourseCreateInput } from "./course";
import { CourseLessonModel, CourseLessonCreateInput } from "./course-lesson";

export interface CourseSectionModel {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  course?: CourseModel;
  courseId: string;
  lessons?: CourseLessonModel[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseSectionCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseSectionRelationalCreateInput extends CourseSectionCreateInput {
  course?: CourseCreateInput;
  lessons?: CourseLessonCreateInput | CourseLessonCreateInput[];
}

export type CourseSectionUpdateInput = Partial<CourseSectionCreateInput>;

