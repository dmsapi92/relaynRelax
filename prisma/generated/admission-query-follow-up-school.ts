import { FollowUpType, FollowUpStatus } from "./enums";
import { AdmissionQuerySchoolModel, AdmissionQuerySchoolCreateInput } from "./admission-query-school";

export interface AdmissionQueryFollowUpSchoolModel {
  id: string;
  query?: AdmissionQuerySchoolModel;
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

export interface AdmissionQueryFollowUpSchoolCreateInput {
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

export interface AdmissionQueryFollowUpSchoolRelationalCreateInput extends AdmissionQueryFollowUpSchoolCreateInput {
  query?: AdmissionQuerySchoolCreateInput;
}

export type AdmissionQueryFollowUpSchoolUpdateInput = Partial<AdmissionQueryFollowUpSchoolCreateInput>;

