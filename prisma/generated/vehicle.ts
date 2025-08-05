import { UserModel, UserCreateInput } from "./user";
import { ReminderModel, ReminderCreateInput } from "./reminder";

export interface VehicleModel {
  id: string;
  registrationNumber: string;
  userId: string;
  user?: UserModel;
  make: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  reminders?: ReminderModel[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCreateInput {
  id?: string;
  registrationNumber: string;
  userId?: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleRelationalCreateInput extends VehicleCreateInput {
  user?: UserCreateInput;
  reminders?: ReminderCreateInput | ReminderCreateInput[];
}

export type VehicleUpdateInput = Partial<VehicleCreateInput>;

