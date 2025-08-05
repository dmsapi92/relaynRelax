import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ClassTestResultModel, ClassTestResultCreateInput } from "./class-test-result";

export interface ClassTestModel {
  id: string;
  title: string;
  description: string | null;
  subjectId: string;
  teacherId: string;
  testDate: string;
  maxMarks: number;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  classId: string | null;
  sectionId: string | null;
  streamId: string | null;
  yearId: string | null;
  results?: ClassTestResultModel[];
  createdAt: string;
  updatedAt: string;
}

export interface ClassTestCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  subjectId: string;
  teacherId: string;
  testDate: string;
  maxMarks: number;
  campusId?: string;
  classId?: string | null;
  sectionId?: string | null;
  streamId?: string | null;
  yearId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassTestRelationalCreateInput extends ClassTestCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  results?: ClassTestResultCreateInput | ClassTestResultCreateInput[];
}

export type ClassTestUpdateInput = Partial<ClassTestCreateInput>;

