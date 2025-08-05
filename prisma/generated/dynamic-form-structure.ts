import { CampusType, UserType, dynamicFormType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { DynamicFormSectionModel, DynamicFormSectionCreateInput } from "./dynamic-form-section";

export interface DynamicFormStructureModel {
  id: string;
  name: string;
  description: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  campusType: CampusType;
  userType: UserType;
  formType: dynamicFormType;
  sections?: DynamicFormSectionModel[];
  createdAt: string;
  updatedAt: string;
}

export interface DynamicFormStructureCreateInput {
  id?: string;
  name: string;
  description?: string | null;
  campusId?: string | null;
  campusType: CampusType;
  userType: UserType;
  formType?: dynamicFormType;
  createdAt?: string;
  updatedAt?: string;
}

export interface DynamicFormStructureRelationalCreateInput extends DynamicFormStructureCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  sections?: DynamicFormSectionCreateInput | DynamicFormSectionCreateInput[];
}

export type DynamicFormStructureUpdateInput = Partial<DynamicFormStructureCreateInput>;

