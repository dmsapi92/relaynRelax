import { UserType, LoanStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { UserModel, UserCreateInput } from "./user";
import { LoanInstallmentModel, LoanInstallmentCreateInput } from "./loan-installment";

export interface LoanManagementModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  userType: UserType;
  loanAmount: number;
  interestRate: number | null;
  totalAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string | null;
  user?: UserModel;
  userId: string;
  installments?: LoanInstallmentModel[];
  status: LoanStatus;
  purpose: string | null;
  remarks: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoanManagementCreateInput {
  id?: string;
  campusId?: string;
  userType: UserType;
  loanAmount: number;
  interestRate?: number | null;
  totalAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate?: string | null;
  userId?: string;
  status?: LoanStatus;
  purpose?: string | null;
  remarks?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoanManagementRelationalCreateInput extends LoanManagementCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  user?: UserCreateInput;
  installments?: LoanInstallmentCreateInput | LoanInstallmentCreateInput[];
}

export type LoanManagementUpdateInput = Partial<LoanManagementCreateInput>;

