import { TeacherModel, TeacherCreateInput } from "./teacher";
import { StaffModel, StaffCreateInput } from "./staff";
import { VariousSalaryDataModel, VariousSalaryDataCreateInput } from "./various-salary-data";
import { SalaryManagementModel, SalaryManagementCreateInput } from "./salary-management";

export interface SalaryPresetModel {
  id: string;
  teacher?: TeacherModel;
  staff?: StaffModel;
  salaryData?: VariousSalaryDataModel[];
  createdAt: string;
  updatedAt: string;
  SalaryManagement?: SalaryManagementModel[];
}

export interface SalaryPresetCreateInput {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryPresetRelationalCreateInput extends SalaryPresetCreateInput {
  teacher?: TeacherCreateInput;
  staff?: StaffCreateInput;
  salaryData?: VariousSalaryDataCreateInput | VariousSalaryDataCreateInput[];
  SalaryManagement?: SalaryManagementCreateInput | SalaryManagementCreateInput[];
}

export type SalaryPresetUpdateInput = Partial<SalaryPresetCreateInput>;

