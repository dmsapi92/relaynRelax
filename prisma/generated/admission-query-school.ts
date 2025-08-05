import { QueryType, QueryStatus, QuerySource, QueryPriority } from "./enums";
import { AdmissionQueryFollowUpSchoolModel, AdmissionQueryFollowUpSchoolCreateInput } from "./admission-query-follow-up-school";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AdmissionSchoolModel, AdmissionSchoolCreateInput } from "./admission-school";
import { AdmissionCollegeModel, AdmissionCollegeCreateInput } from "./admission-college";

export interface AdmissionQuerySchoolModel {
  id: string;
  queryNumber: string;
  queryType: QueryType;
  status: QueryStatus;
  source: QuerySource;
  priority: QueryPriority;
  followUps?: AdmissionQueryFollowUpSchoolModel[];
  notes: string | null;
  assignedTo: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  admission?: AdmissionSchoolModel;
  admissionSchoolId: string | null;
  admissionCollegeId: string | null;
  AdmissionCollege?: AdmissionCollegeModel;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionQuerySchoolCreateInput {
  id?: string;
  queryNumber: string;
  queryType?: QueryType;
  status?: QueryStatus;
  source?: QuerySource;
  priority?: QueryPriority;
  notes?: string | null;
  assignedTo?: string | null;
  campusId?: string;
  admissionSchoolId?: string | null;
  admissionCollegeId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionQuerySchoolRelationalCreateInput extends AdmissionQuerySchoolCreateInput {
  followUps?: AdmissionQueryFollowUpSchoolCreateInput | AdmissionQueryFollowUpSchoolCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
  admission?: AdmissionSchoolCreateInput;
  AdmissionCollege?: AdmissionCollegeCreateInput;
}

export type AdmissionQuerySchoolUpdateInput = Partial<AdmissionQuerySchoolCreateInput>;

