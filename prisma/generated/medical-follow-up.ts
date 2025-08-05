import { FollowUpStatus } from "./enums";
import { MedicalRecordModel, MedicalRecordCreateInput } from "./medical-record";

export interface MedicalFollowUpModel {
  id: string;
  medicalRecord?: MedicalRecordModel;
  medicalRecordId: string;
  date: string;
  notes: string;
  status: FollowUpStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalFollowUpCreateInput {
  id?: string;
  medicalRecordId?: string;
  date: string;
  notes: string;
  status: FollowUpStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalFollowUpRelationalCreateInput extends MedicalFollowUpCreateInput {
  medicalRecord?: MedicalRecordCreateInput;
}

export type MedicalFollowUpUpdateInput = Partial<MedicalFollowUpCreateInput>;

