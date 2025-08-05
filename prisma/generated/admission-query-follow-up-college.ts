import { FollowUpType, FollowUpStatus } from "./enums";
import { AdmissionQueryCollegeModel, AdmissionQueryCollegeCreateInput } from "./admission-query-college";

export interface AdmissionQueryFollowUpCollegeModel {
  id: string;
  query?: AdmissionQueryCollegeModel;
  queryId: string;
  followUpType: FollowUpType;
  status: FollowUpStatus;
  scheduledDate: string;
  actualDate: string | null;
  response: string | null;
  nextFollowUpDate: string | null;
  handledBy: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionQueryFollowUpCollegeCreateInput {
  id?: string;
  queryId?: string;
  followUpType: FollowUpType;
  status?: FollowUpStatus;
  scheduledDate: string;
  actualDate?: string | null;
  response?: string | null;
  nextFollowUpDate?: string | null;
  handledBy: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionQueryFollowUpCollegeRelationalCreateInput extends AdmissionQueryFollowUpCollegeCreateInput {
  query?: AdmissionQueryCollegeCreateInput;
}

export type AdmissionQueryFollowUpCollegeUpdateInput = Partial<AdmissionQueryFollowUpCollegeCreateInput>;

