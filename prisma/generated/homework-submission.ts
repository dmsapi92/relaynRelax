import { SubmissionStatus } from "./enums";
import { HomeworkModel, HomeworkCreateInput } from "./homework";

export interface HomeworkSubmissionModel {
  id: string;
  homework?: HomeworkModel;
  homeworkId: string;
  studentId: string;
  submittedAt: string;
  status: SubmissionStatus;
  files: string[];
  remarks: string | null;
  grade: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkSubmissionCreateInput {
  id?: string;
  homeworkId?: string;
  studentId: string;
  submittedAt?: string;
  status: SubmissionStatus;
  files: string[];
  remarks?: string | null;
  grade?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeworkSubmissionRelationalCreateInput extends HomeworkSubmissionCreateInput {
  homework?: HomeworkCreateInput;
}

export type HomeworkSubmissionUpdateInput = Partial<HomeworkSubmissionCreateInput>;

