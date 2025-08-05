import { MeritCategory, CertificateSystemStatus } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface MeritCertificateModel {
  id: string;
  certificateNo: string;
  student?: StudentModel;
  studentId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  academicSession?: AcademicSessionModel;
  academicSessionId: string;
  achievement: string;
  rank: number | null;
  score: number | null;
  remarks: string | null;
  category: MeritCategory;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeritCertificateCreateInput {
  id?: string;
  certificateNo: string;
  studentId?: string;
  campusId?: string;
  academicSessionId?: string;
  achievement: string;
  rank?: number | null;
  score?: number | null;
  remarks?: string | null;
  category: MeritCategory;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MeritCertificateRelationalCreateInput extends MeritCertificateCreateInput {
  student?: StudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  academicSession?: AcademicSessionCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type MeritCertificateUpdateInput = Partial<MeritCertificateCreateInput>;

