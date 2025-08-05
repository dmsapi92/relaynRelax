import { ApplicationStatus } from "./enums";
import { ScholarshipModel, ScholarshipCreateInput } from "./scholarship";

export interface ScholarshipApplicationModel {
  id: string;
  scholarship?: ScholarshipModel;
  scholarshipId: string;
  studentId: string;
  status: ApplicationStatus;
  documents: string[];
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipApplicationCreateInput {
  id?: string;
  scholarshipId?: string;
  studentId: string;
  status?: ApplicationStatus;
  documents: string[];
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScholarshipApplicationRelationalCreateInput extends ScholarshipApplicationCreateInput {
  scholarship?: ScholarshipCreateInput;
}

export type ScholarshipApplicationUpdateInput = Partial<ScholarshipApplicationCreateInput>;

