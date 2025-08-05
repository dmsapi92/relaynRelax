import { CertificateSystemStatus } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface ExperienceCertificateModel {
  id: string;
  certificateNo: string;
  user?: UserModel;
  userId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  designation: string;
  department: string | null;
  joiningDate: string;
  leavingDate: string | null;
  responsibilities: string[];
  performance: string | null;
  reason: string | null;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceCertificateCreateInput {
  id?: string;
  certificateNo: string;
  userId?: string;
  campusId?: string;
  designation: string;
  department?: string | null;
  joiningDate: string;
  leavingDate?: string | null;
  responsibilities: string[];
  performance?: string | null;
  reason?: string | null;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceCertificateRelationalCreateInput extends ExperienceCertificateCreateInput {
  user?: UserCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type ExperienceCertificateUpdateInput = Partial<ExperienceCertificateCreateInput>;

