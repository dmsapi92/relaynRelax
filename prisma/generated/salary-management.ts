import { UserType, PaymentStatus, PaymentMethod } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SalaryPresetModel, SalaryPresetCreateInput } from "./salary-preset";
import { SalaryComponentModel, SalaryComponentCreateInput } from "./salary-component";

export interface SalaryManagementModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  userId: string;
  userType: UserType;
  month: string;
  salaryData?: SalaryPresetModel;
  salaryDataId: string | null;
  components?: SalaryComponentModel[];
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paymentDate: string | null;
  remarks: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryManagementCreateInput {
  id?: string;
  campusId?: string;
  userId: string;
  userType: UserType;
  month: string;
  salaryDataId?: string | null;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  paymentDate?: string | null;
  remarks?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryManagementRelationalCreateInput extends SalaryManagementCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  salaryData?: SalaryPresetCreateInput;
  components?: SalaryComponentCreateInput | SalaryComponentCreateInput[];
}

export type SalaryManagementUpdateInput = Partial<SalaryManagementCreateInput>;

