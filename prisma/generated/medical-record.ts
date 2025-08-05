import { MedicalRecordType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { MedicalFollowUpModel, MedicalFollowUpCreateInput } from "./medical-follow-up";

export interface MedicalRecordModel {
  id: string;
  student: string;
  type: MedicalRecordType;
  description: string;
  diagnosis: string | null;
  prescription: string | null;
  attachments: string[];
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  followUps?: MedicalFollowUpModel[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordCreateInput {
  id?: string;
  student: string;
  type: MedicalRecordType;
  description: string;
  diagnosis?: string | null;
  prescription?: string | null;
  attachments: string[];
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecordRelationalCreateInput extends MedicalRecordCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  followUps?: MedicalFollowUpCreateInput | MedicalFollowUpCreateInput[];
}

export type MedicalRecordUpdateInput = Partial<MedicalRecordCreateInput>;

