import { CourseModel, CourseCreateInput } from "./course";
import { AssignmentSubmissionModel, AssignmentSubmissionCreateInput } from "./assignment-submission";

export interface AssignmentModel {
  id: string;
  title: string;
  description: string;
  course?: CourseModel;
  courseId: string;
  dueDate: string;
  totalMarks: number;
  attachments: string[];
  submissions?: AssignmentSubmissionModel[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentCreateInput {
  id?: string;
  title: string;
  description: string;
  courseId?: string;
  dueDate: string;
  totalMarks: number;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentRelationalCreateInput extends AssignmentCreateInput {
  course?: CourseCreateInput;
  submissions?: AssignmentSubmissionCreateInput | AssignmentSubmissionCreateInput[];
}

export type AssignmentUpdateInput = Partial<AssignmentCreateInput>;

