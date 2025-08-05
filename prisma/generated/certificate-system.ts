import { CertificateType, UserType, CertificateSystemStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { CertificateDetailsModel, CertificateDetailsCreateInput } from "./certificate-details";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";
import { CustomFieldModel, CustomFieldCreateInput } from "./custom-field";
import { CertificateValidationModel, CertificateValidationCreateInput } from "./certificate-validation";

export interface CertificateSystemModel {
  id: string;
  certificateNo: string;
  type: CertificateType;
  issuedTo: string;
  issuedToType: UserType;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  academicSession?: AcademicSessionModel;
  academicSessionId: string | null;
  details?: CertificateDetailsModel;
  signatories?: SignatoryModel[];
  customFields?: CustomFieldModel[];
  validation?: CertificateValidationModel;
  status: CertificateSystemStatus;
  issuedDate: string;
  validUntil: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateSystemCreateInput {
  id?: string;
  certificateNo: string;
  type: CertificateType;
  issuedTo: string;
  issuedToType: UserType;
  campusId?: string;
  academicSessionId?: string | null;
  status?: CertificateSystemStatus;
  issuedDate: string;
  validUntil?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificateSystemRelationalCreateInput extends CertificateSystemCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  academicSession?: AcademicSessionCreateInput;
  details?: CertificateDetailsCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
  customFields?: CustomFieldCreateInput | CustomFieldCreateInput[];
  validation?: CertificateValidationCreateInput;
}

export type CertificateSystemUpdateInput = Partial<CertificateSystemCreateInput>;

