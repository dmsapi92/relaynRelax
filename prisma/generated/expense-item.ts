import { ExpenseItemStatus } from "./enums";
import { ExpenseModel, ExpenseCreateInput } from "./expense";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface ExpenseItemModel {
  id: string;
  expense?: ExpenseModel;
  expenseId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tax: number | null;
  finalPrice: number;
  status: ExpenseItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItemCreateInput {
  id?: string;
  expenseId?: string;
  campusId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tax?: number | null;
  finalPrice: number;
  status?: ExpenseItemStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseItemRelationalCreateInput extends ExpenseItemCreateInput {
  expense?: ExpenseCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
}

export type ExpenseItemUpdateInput = Partial<ExpenseItemCreateInput>;

