import { BudgetType } from "./enums";
import { BudgetModel, BudgetCreateInput } from "./budget";
import { BudgetItemModel, BudgetItemCreateInput } from "./budget-item";

export interface BudgetCategoryModel {
  id: string;
  budget?: BudgetModel;
  budgetId: string;
  name: string;
  type: BudgetType;
  allocatedAmount: number;
  usedAmount: number;
  items?: BudgetItemModel[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategoryCreateInput {
  id?: string;
  budgetId?: string;
  name: string;
  type: BudgetType;
  allocatedAmount: number;
  usedAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetCategoryRelationalCreateInput extends BudgetCategoryCreateInput {
  budget?: BudgetCreateInput;
  items?: BudgetItemCreateInput | BudgetItemCreateInput[];
}

export type BudgetCategoryUpdateInput = Partial<BudgetCategoryCreateInput>;

