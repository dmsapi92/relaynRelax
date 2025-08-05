import { PaymentMethod, TransactionStatus } from "./enums";
import { FeeInvoiceModel, FeeInvoiceCreateInput } from "./fee-invoice";

export interface FeeTransactionModel {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  isOnline: boolean;
  reference: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  invoiceId: string | null;
  invoice?: FeeInvoiceModel;
}

export interface FeeTransactionCreateInput {
  id?: string;
  amount: number;
  method?: PaymentMethod;
  status?: TransactionStatus;
  isOnline?: boolean;
  reference?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  invoiceId?: string | null;
}

export interface FeeTransactionRelationalCreateInput extends FeeTransactionCreateInput {
  invoice?: FeeInvoiceCreateInput;
}

export type FeeTransactionUpdateInput = Partial<FeeTransactionCreateInput>;

