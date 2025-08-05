import { LearningResourceType } from "./enums";
import { CourseModel, CourseCreateInput } from "./course";

export interface LearningResourceModel {
  id: string;
  title: string;
  description: string;
  type: LearningResourceType;
  url: string;
  course?: CourseModel;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningResourceCreateInput {
  id?: string;
  title: string;
  description: string;
  type: LearningResourceType;
  url: string;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LearningResourceRelationalCreateInput extends LearningResourceCreateInput {
  course?: CourseCreateInput;
}

export type LearningResourceUpdateInput = Partial<LearningResourceCreateInput>;

