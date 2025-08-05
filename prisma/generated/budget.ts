import { BudgetStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { BudgetCategoryModel, BudgetCategoryCreateInput } from "./budget-category";

export interface BudgetModel {
  id: string;
  name: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  categories?: BudgetCategoryModel[];
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCreateInput {
  id?: string;
  name: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  campusId?: string;
  status?: BudgetStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetRelationalCreateInput extends BudgetCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  categories?: BudgetCategoryCreateInput | BudgetCategoryCreateInput[];
}

export type BudgetUpdateInput = Partial<BudgetCreateInput>;

