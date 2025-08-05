import { UserModel, UserCreateInput } from "./user";

export interface BankAccountModel {
  id: string;
  userId: string;
  user?: UserModel;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  ifscCode: string;
  branchName: string | null;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountCreateInput {
  id?: string;
  userId?: string;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  ifscCode: string;
  branchName?: string | null;
  isDefault?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankAccountRelationalCreateInput extends BankAccountCreateInput {
  user?: UserCreateInput;
}

export type BankAccountUpdateInput = Partial<BankAccountCreateInput>;

