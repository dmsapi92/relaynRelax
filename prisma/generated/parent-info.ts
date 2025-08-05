import { StudentModel, StudentCreateInput } from "./student";

export interface ParentInfoModel {
  id: string;
  fatherName: string | null;
  fatherPhone: string | null;
  fatherEmail: string | null;
  fatherOccupation: string | null;
  motherName: string | null;
  motherPhone: string | null;
  motherEmail: string | null;
  motherOccupation: string | null;
  student?: StudentModel;
  createdAt: string;
  updatedAt: string;
}

export interface ParentInfoCreateInput {
  id?: string;
  fatherName?: string | null;
  fatherPhone?: string | null;
  fatherEmail?: string | null;
  fatherOccupation?: string | null;
  motherName?: string | null;
  motherPhone?: string | null;
  motherEmail?: string | null;
  motherOccupation?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentInfoRelationalCreateInput extends ParentInfoCreateInput {
  student?: StudentCreateInput;
}

export type ParentInfoUpdateInput = Partial<ParentInfoCreateInput>;

