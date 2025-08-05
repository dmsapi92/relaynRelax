import { SalaryDataType } from "./enums";
import { SalaryPresetModel, SalaryPresetCreateInput } from "./salary-preset";

export interface VariousSalaryDataModel {
  id: string;
  name: string;
  amount: number;
  type: SalaryDataType;
  salaryPreset?: SalaryPresetModel;
  salaryPresetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VariousSalaryDataCreateInput {
  id?: string;
  name: string;
  amount: number;
  type: SalaryDataType;
  salaryPresetId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VariousSalaryDataRelationalCreateInput extends VariousSalaryDataCreateInput {
  salaryPreset?: SalaryPresetCreateInput;
}

export type VariousSalaryDataUpdateInput = Partial<VariousSalaryDataCreateInput>;

