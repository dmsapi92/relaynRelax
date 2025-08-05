import { UserType, CertificateSystemStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface WorkshopCertificateModel {
  id: string;
  certificateNo: string;
  issuedTo: string;
  issuedToType: UserType;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  workshopTitle: string;
  conductedBy: string;
  startDate: string;
  endDate: string;
  topics: string[];
  skills: string[];
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopCertificateCreateInput {
  id?: string;
  certificateNo: string;
  issuedTo: string;
  issuedToType: UserType;
  campusId?: string;
  workshopTitle: string;
  conductedBy: string;
  startDate: string;
  endDate: string;
  topics: string[];
  skills: string[];
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkshopCertificateRelationalCreateInput extends WorkshopCertificateCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type WorkshopCertificateUpdateInput = Partial<WorkshopCertificateCreateInput>;

