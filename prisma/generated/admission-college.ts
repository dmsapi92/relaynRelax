import { CampusType, AdmissionType, AdmissionStatus, PaymentStatus } from "./enums";
import { AdmissionCollegeStudentModel, AdmissionCollegeStudentCreateInput } from "./admission-college-student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AdmissionQueryCollegeModel, AdmissionQueryCollegeCreateInput } from "./admission-query-college";
import { AdmissionQuerySchoolModel, AdmissionQuerySchoolCreateInput } from "./admission-query-school";

export interface AdmissionCollegeModel {
  id: string;
  applicationNumber: string;
  academicSessionId: string;
  appliedUserId: string | null;
  campusType: CampusType;
  applicationType: AdmissionType;
  status: AdmissionStatus;
  AdmissionCollegeStudent?: AdmissionCollegeStudentModel;
  applicationDate: string;
  lastUpdated: string;
  campusId: string;
  campus?: InstitutionSetupCampusModel;
  notes: string | null;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  AdmissionQuery?: AdmissionQueryCollegeModel[];
  admissionCollegeStudentId: string;
  AdmissionQuerySchool?: AdmissionQuerySchoolModel[];
}

export interface AdmissionCollegeCreateInput {
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
  admissionCollegeStudentId?: string;
}

export interface AdmissionCollegeRelationalCreateInput extends AdmissionCollegeCreateInput {
  AdmissionCollegeStudent?: AdmissionCollegeStudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  AdmissionQuery?: AdmissionQueryCollegeCreateInput | AdmissionQueryCollegeCreateInput[];
  AdmissionQuerySchool?: AdmissionQuerySchoolCreateInput | AdmissionQuerySchoolCreateInput[];
}

export type AdmissionCollegeUpdateInput = Partial<AdmissionCollegeCreateInput>;

