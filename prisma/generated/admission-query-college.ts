import { QueryType, QueryStatus, QuerySource, QueryPriority } from "./enums";
import { AdmissionQueryFollowUpCollegeModel, AdmissionQueryFollowUpCollegeCreateInput } from "./admission-query-follow-up-college";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AdmissionCollegeModel, AdmissionCollegeCreateInput } from "./admission-college";

export interface AdmissionQueryCollegeModel {
  id: string;
  queryNumber: string;
  queryType: QueryType;
  status: QueryStatus;
  source: QuerySource;
  priority: QueryPriority;
  followUps?: AdmissionQueryFollowUpCollegeModel[];
  notes: string | null;
  assignedTo: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  admission?: AdmissionCollegeModel;
  admissionCollegeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionQueryCollegeCreateInput {
  id?: string;
  queryNumber: string;
  queryType?: QueryType;
  status?: QueryStatus;
  source?: QuerySource;
  priority?: QueryPriority;
  notes?: string | null;
  assignedTo?: string | null;
  campusId?: string;
  admissionCollegeId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionQueryCollegeRelationalCreateInput extends AdmissionQueryCollegeCreateInput {
  followUps?: AdmissionQueryFollowUpCollegeCreateInput | AdmissionQueryFollowUpCollegeCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
  admission?: AdmissionCollegeCreateInput;
}

export type AdmissionQueryCollegeUpdateInput = Partial<AdmissionQueryCollegeCreateInput>;

