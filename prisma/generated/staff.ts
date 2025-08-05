import { UserModel, UserCreateInput } from "./user";
import { DynamicFormModel, DynamicFormCreateInput } from "./dynamic-form";
import { SalaryPresetModel, SalaryPresetCreateInput } from "./salary-preset";
import { InventoryWastageRecordModel, InventoryWastageRecordCreateInput } from "./inventory-wastage-record";
import { StaffAttendanceModel, StaffAttendanceCreateInput } from "./staff-attendance";

export interface StaffModel {
  id: string;
  user?: UserModel;
  userId: string;
  department: string | null;
  designation: string | null;
  dynamicForm?: DynamicFormModel;
  dynamicFormId: string | null;
  salaryPreset?: SalaryPresetModel;
  salaryPresetId: string | null;
  experience: number | null;
  createdAt: string;
  updatedAt: string;
  WastageRecord?: InventoryWastageRecordModel[];
  StaffAttendance?: StaffAttendanceModel[];
}

export interface StaffCreateInput {
  id?: string;
  userId?: string;
  department?: string | null;
  designation?: string | null;
  dynamicFormId?: string | null;
  salaryPresetId?: string | null;
  experience?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffRelationalCreateInput extends StaffCreateInput {
  user?: UserCreateInput;
  dynamicForm?: DynamicFormCreateInput;
  salaryPreset?: SalaryPresetCreateInput;
  WastageRecord?: InventoryWastageRecordCreateInput | InventoryWastageRecordCreateInput[];
  StaffAttendance?: StaffAttendanceCreateInput | StaffAttendanceCreateInput[];
}

export type StaffUpdateInput = Partial<StaffCreateInput>;

