import { ReminderType } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { VehicleModel, VehicleCreateInput } from "./vehicle";
import { DrivingLicenseModel, DrivingLicenseCreateInput } from "./driving-license";

export interface ReminderModel {
  id: string;
  type: ReminderType;
  reminderDate: string;
  userId: string;
  user?: UserModel;
  vehicleId: string | null;
  vehicle?: VehicleModel;
  licenseId: string | null;
  license?: DrivingLicenseModel;
  notifyDaysBefore: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderCreateInput {
  id?: string;
  type: ReminderType;
  reminderDate: string;
  userId?: string;
  vehicleId?: string | null;
  licenseId?: string | null;
  notifyDaysBefore?: number;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReminderRelationalCreateInput extends ReminderCreateInput {
  user?: UserCreateInput;
  vehicle?: VehicleCreateInput;
  license?: DrivingLicenseCreateInput;
}

export type ReminderUpdateInput = Partial<ReminderCreateInput>;

