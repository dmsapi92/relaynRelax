import { UserModel, UserCreateInput } from "./user";
import { ReminderModel, ReminderCreateInput } from "./reminder";

export interface DrivingLicenseModel {
  id: string;
  licenseNumber: string;
  userId: string;
  user?: UserModel;
  issuedDate: string | null;
  expiryDate: string | null;
  issuingAuthority: string | null;
  reminders?: ReminderModel[];
  createdAt: string;
  updatedAt: string;
}

export interface DrivingLicenseCreateInput {
  id?: string;
  licenseNumber: string;
  userId?: string;
  issuedDate?: string | null;
  expiryDate?: string | null;
  issuingAuthority?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DrivingLicenseRelationalCreateInput extends DrivingLicenseCreateInput {
  user?: UserCreateInput;
  reminders?: ReminderCreateInput | ReminderCreateInput[];
}

export type DrivingLicenseUpdateInput = Partial<DrivingLicenseCreateInput>;

