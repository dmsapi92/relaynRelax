import { ExpenseCategoryType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ExpenseModel, ExpenseCreateInput } from "./expense";

export interface ExpenseCategoryModel {
  id: string;
  name: string;
  description: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  type: ExpenseCategoryType;
  expenses?: ExpenseModel[];
  budget: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategoryCreateInput {
  id?: string;
  name: string;
  description?: string | null;
  campusId?: string | null;
  type?: ExpenseCategoryType;
  budget?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseCategoryRelationalCreateInput extends ExpenseCategoryCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  expenses?: ExpenseCreateInput | ExpenseCreateInput[];
}

export type ExpenseCategoryUpdateInput = Partial<ExpenseCategoryCreateInput>;

