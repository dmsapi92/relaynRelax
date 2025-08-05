import { StudentModel, StudentCreateInput } from "./student";

export interface FamilyRelationModel {
  id: string;
  relationshipType: string;
  student?: StudentModel;
  studentId: string;
  sibling?: StudentModel;
  siblingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyRelationCreateInput {
  id?: string;
  relationshipType: string;
  studentId?: string;
  siblingId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FamilyRelationRelationalCreateInput extends FamilyRelationCreateInput {
  student?: StudentCreateInput;
  sibling?: StudentCreateInput;
}

export type FamilyRelationUpdateInput = Partial<FamilyRelationCreateInput>;

