import { ExpenseStatus, PaymentStatus, ExpensePaymentMethod } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ExpenseCategoryModel, ExpenseCategoryCreateInput } from "./expense-category";
import { ExpenseItemModel, ExpenseItemCreateInput } from "./expense-item";

export interface ExpenseModel {
  id: string;
  expenseNumber: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  category?: ExpenseCategoryModel;
  categoryId: string;
  items?: ExpenseItemModel[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: ExpenseStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: ExpensePaymentMethod | null;
  paymentDate: string | null;
  notes: string | null;
  attachments: string[];
  requestedBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCreateInput {
  id?: string;
  expenseNumber: string;
  campusId?: string | null;
  categoryId?: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status?: ExpenseStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: ExpensePaymentMethod | null;
  paymentDate?: string | null;
  notes?: string | null;
  attachments: string[];
  requestedBy: string;
  approvedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseRelationalCreateInput extends ExpenseCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  category?: ExpenseCategoryCreateInput;
  items?: ExpenseItemCreateInput | ExpenseItemCreateInput[];
}

export type ExpenseUpdateInput = Partial<ExpenseCreateInput>;

