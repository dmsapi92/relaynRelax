import { CertificateSystemStatus } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface AppreciationCertificateModel {
  id: string;
  certificateNo: string;
  issuedTo?: UserModel;
  issuedToId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  achievement: string;
  event: string | null;
  date: string;
  description: string | null;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppreciationCertificateCreateInput {
  id?: string;
  certificateNo: string;
  issuedToId?: string;
  campusId?: string;
  achievement: string;
  event?: string | null;
  date: string;
  description?: string | null;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppreciationCertificateRelationalCreateInput extends AppreciationCertificateCreateInput {
  issuedTo?: UserCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type AppreciationCertificateUpdateInput = Partial<AppreciationCertificateCreateInput>;

