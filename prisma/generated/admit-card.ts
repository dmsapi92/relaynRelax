import { AdmitStatus } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { ExaminationModel, ExaminationCreateInput } from "./examination";

export interface AdmitCardModel {
  id: string;
  student?: StudentModel;
  studentId: string;
  examination?: ExaminationModel;
  examinationId: string;
  rollNumber: string;
  seatNumber: string | null;
  roomNumber: string | null;
  centerCode: string | null;
  instructions: string[];
  status: AdmitStatus;
  issuedAt: string;
  validFrom: string;
  validTill: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmitCardCreateInput {
  id?: string;
  studentId?: string;
  examinationId?: string;
  rollNumber: string;
  seatNumber?: string | null;
  roomNumber?: string | null;
  centerCode?: string | null;
  instructions: string[];
  status?: AdmitStatus;
  issuedAt?: string;
  validFrom: string;
  validTill: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmitCardRelationalCreateInput extends AdmitCardCreateInput {
  student?: StudentCreateInput;
  examination?: ExaminationCreateInput;
}

export type AdmitCardUpdateInput = Partial<AdmitCardCreateInput>;

