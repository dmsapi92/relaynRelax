import { BudgetItemStatus } from "./enums";
import { BudgetCategoryModel, BudgetCategoryCreateInput } from "./budget-category";

export interface BudgetItemModel {
  id: string;
  category?: BudgetCategoryModel;
  categoryId: string;
  name: string;
  description: string | null;
  amount: number;
  status: BudgetItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItemCreateInput {
  id?: string;
  categoryId?: string;
  name: string;
  description?: string | null;
  amount: number;
  status?: BudgetItemStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetItemRelationalCreateInput extends BudgetItemCreateInput {
  category?: BudgetCategoryCreateInput;
}

export type BudgetItemUpdateInput = Partial<BudgetItemCreateInput>;

