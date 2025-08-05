import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";

export interface SchoolModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  classes?: SchoolClassModel[];
  createdAt: string;
  updatedAt: string;
}

export interface SchoolCreateInput {
  id?: string;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolRelationalCreateInput extends SchoolCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  classes?: SchoolClassCreateInput | SchoolClassCreateInput[];
}

export type SchoolUpdateInput = Partial<SchoolCreateInput>;

