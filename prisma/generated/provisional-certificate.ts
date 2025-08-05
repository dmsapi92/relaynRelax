import { CertificateSystemStatus } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface ProvisionalCertificateModel {
  id: string;
  certificateNo: string;
  student?: StudentModel;
  studentId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  academicSession?: AcademicSessionModel;
  academicSessionId: string;
  program: string;
  duration: string;
  completionDate: string;
  grade: string | null;
  remarks: string | null;
  validUntil: string;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProvisionalCertificateCreateInput {
  id?: string;
  certificateNo: string;
  studentId?: string;
  campusId?: string;
  academicSessionId?: string;
  program: string;
  duration: string;
  completionDate: string;
  grade?: string | null;
  remarks?: string | null;
  validUntil: string;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProvisionalCertificateRelationalCreateInput extends ProvisionalCertificateCreateInput {
  student?: StudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  academicSession?: AcademicSessionCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type ProvisionalCertificateUpdateInput = Partial<ProvisionalCertificateCreateInput>;

