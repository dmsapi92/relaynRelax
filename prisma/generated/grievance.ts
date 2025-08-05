import { GrievanceType, GrievancePriority, GrievanceStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { GrievanceResponseModel, GrievanceResponseCreateInput } from "./grievance-response";

export interface GrievanceModel {
  id: string;
  title: string;
  description: string;
  type: GrievanceType;
  priority: GrievancePriority;
  status: GrievanceStatus;
  raisedBy: string;
  assignedTo: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  responses?: GrievanceResponseModel[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GrievanceCreateInput {
  id?: string;
  title: string;
  description: string;
  type: GrievanceType;
  priority?: GrievancePriority;
  status?: GrievanceStatus;
  raisedBy: string;
  assignedTo?: string | null;
  campusId?: string;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GrievanceRelationalCreateInput extends GrievanceCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  responses?: GrievanceResponseCreateInput | GrievanceResponseCreateInput[];
}

export type GrievanceUpdateInput = Partial<GrievanceCreateInput>;

