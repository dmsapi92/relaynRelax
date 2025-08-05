import { UserRole } from "./enums";
import { AddressModel, AddressCreateInput } from "./address";
import { VehicleModel, VehicleCreateInput } from "./vehicle";
import { DrivingLicenseModel, DrivingLicenseCreateInput } from "./driving-license";
import { ReminderModel, ReminderCreateInput } from "./reminder";
import { ActivityLogModel, ActivityLogCreateInput } from "./activity-log";
import { NotificationModel, NotificationCreateInput } from "./notification";

export interface UserModel {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  address?: AddressModel;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  verificationToken: string | null;
  resetToken: string | null;
  resetTokenExpiry: string | null;
  vehicles?: VehicleModel[];
  drivingLicenses?: DrivingLicenseModel[];
  reminders?: ReminderModel[];
  ActivityLog?: ActivityLogModel[];
  Notification?: NotificationModel[];
}

export interface UserCreateInput {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  verificationToken?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
}

export interface UserRelationalCreateInput extends UserCreateInput {
  address?: AddressCreateInput;
  vehicles?: VehicleCreateInput | VehicleCreateInput[];
  drivingLicenses?: DrivingLicenseCreateInput | DrivingLicenseCreateInput[];
  reminders?: ReminderCreateInput | ReminderCreateInput[];
  ActivityLog?: ActivityLogCreateInput | ActivityLogCreateInput[];
  Notification?: NotificationCreateInput | NotificationCreateInput[];
}

export type UserUpdateInput = Partial<UserCreateInput>;

