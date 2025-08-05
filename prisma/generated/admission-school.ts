import { CampusType, AdmissionType, AdmissionStatus, PaymentStatus } from "./enums";
import { AdmissionSchoolStudentModel, AdmissionSchoolStudentCreateInput } from "./admission-school-student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AdmissionQuerySchoolModel, AdmissionQuerySchoolCreateInput } from "./admission-query-school";

export interface AdmissionSchoolModel {
  id: string;
  applicationNumber: string;
  academicSessionId: string;
  appliedUserId: string | null;
  campusType: CampusType;
  applicationType: AdmissionType;
  status: AdmissionStatus;
  AdmissionSchoolStudent?: AdmissionSchoolStudentModel;
  applicationDate: string;
  lastUpdated: string;
  campusId: string;
  campus?: InstitutionSetupCampusModel;
  notes: string | null;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  AdmissionQuery?: AdmissionQuerySchoolModel[];
  admissionSchoolStudentId: string;
}

export interface AdmissionSchoolCreateInput {
  id?: string;
  applicationNumber: string;
  academicSessionId: string;
  appliedUserId?: string | null;
  campusType?: CampusType;
  applicationType?: AdmissionType;
  status?: AdmissionStatus;
  applicationDate?: string;
  lastUpdated?: string;
  campusId?: string;
  notes?: string | null;
  paymentStatus?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
  admissionSchoolStudentId?: string;
}

export interface AdmissionSchoolRelationalCreateInput extends AdmissionSchoolCreateInput {
  AdmissionSchoolStudent?: AdmissionSchoolStudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  AdmissionQuery?: AdmissionQuerySchoolCreateInput | AdmissionQuerySchoolCreateInput[];
}

export type AdmissionSchoolUpdateInput = Partial<AdmissionSchoolCreateInput>;

