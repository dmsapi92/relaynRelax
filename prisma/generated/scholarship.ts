import { ScholarshipType } from "./enums";
import { ScholarshipCriteriaModel, ScholarshipCriteriaCreateInput } from "./scholarship-criteria";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ScholarshipApplicationModel, ScholarshipApplicationCreateInput } from "./scholarship-application";
import { DonorModel, DonorCreateInput } from "./donor";

export interface ScholarshipModel {
  id: string;
  name: string;
  description: string;
  type: ScholarshipType;
  amount: number;
  criteria?: ScholarshipCriteriaModel[];
  duration: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  applications?: ScholarshipApplicationModel[];
  donor?: DonorModel;
  donorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipCreateInput {
  id?: string;
  name: string;
  description: string;
  type: ScholarshipType;
  amount: number;
  duration: string;
  campusId?: string;
  donorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScholarshipRelationalCreateInput extends ScholarshipCreateInput {
  criteria?: ScholarshipCriteriaCreateInput | ScholarshipCriteriaCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
  applications?: ScholarshipApplicationCreateInput | ScholarshipApplicationCreateInput[];
  donor?: DonorCreateInput;
}

export type ScholarshipUpdateInput = Partial<ScholarshipCreateInput>;

