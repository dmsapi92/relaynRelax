import { CertificateSystemStatus } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface CharacterCertificateModel {
  id: string;
  certificateNo: string;
  student?: StudentModel;
  studentId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  academicSession?: AcademicSessionModel;
  academicSessionId: string;
  behavior: string;
  conduct: string;
  extracurricular: string | null;
  remarks: string | null;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterCertificateCreateInput {
  id?: string;
  certificateNo: string;
  studentId?: string;
  campusId?: string;
  academicSessionId?: string;
  behavior: string;
  conduct: string;
  extracurricular?: string | null;
  remarks?: string | null;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CharacterCertificateRelationalCreateInput extends CharacterCertificateCreateInput {
  student?: StudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  academicSession?: AcademicSessionCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type CharacterCertificateUpdateInput = Partial<CharacterCertificateCreateInput>;

