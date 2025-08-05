import { CertificateSystemStatus } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface BonafideCertificateModel {
  id: string;
  certificateNo: string;
  student?: StudentModel;
  studentId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  academicSession?: AcademicSessionModel;
  academicSessionId: string;
  purpose: string;
  class?: SchoolClassModel;
  classId: string | null;
  stream?: CollegeStreamModel;
  streamId: string | null;
  validityPeriod: number | null;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BonafideCertificateCreateInput {
  id?: string;
  certificateNo: string;
  studentId?: string;
  campusId?: string;
  academicSessionId?: string;
  purpose: string;
  classId?: string | null;
  streamId?: string | null;
  validityPeriod?: number | null;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BonafideCertificateRelationalCreateInput extends BonafideCertificateCreateInput {
  student?: StudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  academicSession?: AcademicSessionCreateInput;
  class?: SchoolClassCreateInput;
  stream?: CollegeStreamCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type BonafideCertificateUpdateInput = Partial<BonafideCertificateCreateInput>;

