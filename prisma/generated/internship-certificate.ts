import { CertificateSystemStatus } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface InternshipCertificateModel {
  id: string;
  certificateNo: string;
  student?: StudentModel;
  studentId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  department: string;
  startDate: string;
  endDate: string;
  duration: string;
  projectTitle: string | null;
  skills: string[];
  performance: string | null;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InternshipCertificateCreateInput {
  id?: string;
  certificateNo: string;
  studentId?: string;
  campusId?: string;
  department: string;
  startDate: string;
  endDate: string;
  duration: string;
  projectTitle?: string | null;
  skills: string[];
  performance?: string | null;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InternshipCertificateRelationalCreateInput extends InternshipCertificateCreateInput {
  student?: StudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type InternshipCertificateUpdateInput = Partial<InternshipCertificateCreateInput>;

