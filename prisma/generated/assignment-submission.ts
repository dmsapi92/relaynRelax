import { SubmissionStatus } from "./enums";
import { AssignmentModel, AssignmentCreateInput } from "./assignment";

export interface AssignmentSubmissionModel {
  id: string;
  assignment?: AssignmentModel;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments: string[];
  marks: number | null;
  feedback: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmissionCreateInput {
  id?: string;
  assignmentId?: string;
  studentId: string;
  content: string;
  attachments: string[];
  marks?: number | null;
  feedback?: string | null;
  status?: SubmissionStatus;
  submittedAt?: string;
  gradedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentSubmissionRelationalCreateInput extends AssignmentSubmissionCreateInput {
  assignment?: AssignmentCreateInput;
}

export type AssignmentSubmissionUpdateInput = Partial<AssignmentSubmissionCreateInput>;

