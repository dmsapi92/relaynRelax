import { GuidanceType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { GuidanceSessionModel, GuidanceSessionCreateInput } from "./guidance-session";

export interface CareerGuidanceModel {
  id: string;
  title: string;
  description: string;
  type: GuidanceType;
  counselor: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  sessions?: GuidanceSessionModel[];
  resources: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CareerGuidanceCreateInput {
  id?: string;
  title: string;
  description: string;
  type: GuidanceType;
  counselor: string;
  campusId?: string;
  resources: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerGuidanceRelationalCreateInput extends CareerGuidanceCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  sessions?: GuidanceSessionCreateInput | GuidanceSessionCreateInput[];
}

export type CareerGuidanceUpdateInput = Partial<CareerGuidanceCreateInput>;

