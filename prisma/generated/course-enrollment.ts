import { EnrollmentStatus } from "./enums";
import { CourseModel, CourseCreateInput } from "./course";

export interface CourseEnrollmentModel {
  id: string;
  course?: CourseModel;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  progress: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollmentCreateInput {
  id?: string;
  courseId?: string;
  studentId: string;
  status?: EnrollmentStatus;
  progress?: number;
  startDate?: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseEnrollmentRelationalCreateInput extends CourseEnrollmentCreateInput {
  course?: CourseCreateInput;
}

export type CourseEnrollmentUpdateInput = Partial<CourseEnrollmentCreateInput>;

