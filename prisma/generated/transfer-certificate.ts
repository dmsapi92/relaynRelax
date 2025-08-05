import { PromotionStatus, CertificateSystemStatus } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface TransferCertificateModel {
  id: string;
  certificateNo: string;
  student?: StudentModel;
  studentId: string;
  admissionNo: string;
  dateOfAdmission: string;
  dateOfWithdrawal: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  academicSession?: AcademicSessionModel;
  academicSessionId: string;
  class?: SchoolClassModel;
  classId: string | null;
  stream?: CollegeStreamModel;
  streamId: string | null;
  attendance: number;
  moralCharacter: string;
  feePaidUpTo: string;
  promotionStatus: PromotionStatus;
  reason: string | null;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransferCertificateCreateInput {
  id?: string;
  certificateNo: string;
  studentId?: string;
  admissionNo: string;
  dateOfAdmission: string;
  dateOfWithdrawal: string;
  campusId?: string;
  academicSessionId?: string;
  classId?: string | null;
  streamId?: string | null;
  attendance: number;
  moralCharacter: string;
  feePaidUpTo: string;
  promotionStatus: PromotionStatus;
  reason?: string | null;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransferCertificateRelationalCreateInput extends TransferCertificateCreateInput {
  student?: StudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  academicSession?: AcademicSessionCreateInput;
  class?: SchoolClassCreateInput;
  stream?: CollegeStreamCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type TransferCertificateUpdateInput = Partial<TransferCertificateCreateInput>;

