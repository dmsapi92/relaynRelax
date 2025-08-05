import { ClassTestModel, ClassTestCreateInput } from "./class-test";

export interface ClassTestResultModel {
  id: string;
  classTest?: ClassTestModel;
  classTestId: string;
  studentId: string;
  marksObtained: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClassTestResultCreateInput {
  id?: string;
  classTestId?: string;
  studentId: string;
  marksObtained: number;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassTestResultRelationalCreateInput extends ClassTestResultCreateInput {
  classTest?: ClassTestCreateInput;
}

export type ClassTestResultUpdateInput = Partial<ClassTestResultCreateInput>;

