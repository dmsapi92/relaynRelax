import { TransactionType, PaymentMethod, TransactionStatus } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { InvestmentModel, InvestmentCreateInput } from "./investment";

export interface TransactionModel {
  id: string;
  userId: string;
  investmentId: string | null;
  user?: UserModel;
  investment?: InvestmentModel;
  amount: number;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCreateInput {
  id?: string;
  userId?: string;
  investmentId?: string | null;
  amount: number;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  status?: TransactionStatus;
  referenceId?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionRelationalCreateInput extends TransactionCreateInput {
  user?: UserCreateInput;
  investment?: InvestmentCreateInput;
}

export type TransactionUpdateInput = Partial<TransactionCreateInput>;

