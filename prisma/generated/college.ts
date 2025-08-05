import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { CollegeYearModel, CollegeYearCreateInput } from "./college-year";

export interface CollegeModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  years?: CollegeYearModel[];
  createdAt: string;
  updatedAt: string;
}

export interface CollegeCreateInput {
  id?: string;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeRelationalCreateInput extends CollegeCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  years?: CollegeYearCreateInput | CollegeYearCreateInput[];
}

export type CollegeUpdateInput = Partial<CollegeCreateInput>;

