import { InvestmentType, InvestmentStatus } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { TransactionModel, TransactionCreateInput } from "./transaction";

export interface InvestmentModel {
  id: string;
  userId: string;
  user?: UserModel;
  amount: number;
  goldWeight: number;
  ratePerGram: number;
  investmentType: InvestmentType;
  status: InvestmentStatus;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  transactions?: TransactionModel[];
}

export interface InvestmentCreateInput {
  id?: string;
  userId?: string;
  amount: number;
  goldWeight: number;
  ratePerGram: number;
  investmentType: InvestmentType;
  status?: InvestmentStatus;
  startDate?: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvestmentRelationalCreateInput extends InvestmentCreateInput {
  user?: UserCreateInput;
  transactions?: TransactionCreateInput | TransactionCreateInput[];
}

export type InvestmentUpdateInput = Partial<InvestmentCreateInput>;

