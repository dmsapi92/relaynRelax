import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AlumniEventModel, AlumniEventCreateInput } from "./alumni-event";
import { AlumniContributionModel, AlumniContributionCreateInput } from "./alumni-contribution";

export interface AlumniNetworkModel {
  id: string;
  name: string;
  batch: string;
  course: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  organization: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  events?: AlumniEventModel[];
  contributions?: AlumniContributionModel[];
  createdAt: string;
  updatedAt: string;
}

export interface AlumniNetworkCreateInput {
  id?: string;
  name: string;
  batch: string;
  course: string;
  email: string;
  phone?: string | null;
  occupation?: string | null;
  organization?: string | null;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlumniNetworkRelationalCreateInput extends AlumniNetworkCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  events?: AlumniEventCreateInput | AlumniEventCreateInput[];
  contributions?: AlumniContributionCreateInput | AlumniContributionCreateInput[];
}

export type AlumniNetworkUpdateInput = Partial<AlumniNetworkCreateInput>;

