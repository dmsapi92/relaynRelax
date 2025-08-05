import { UserType, LeaveType } from "./enums";
import { UserModel, UserCreateInput } from "./user";

export interface LeaveBalanceModel {
  id: string;
  user?: UserModel;
  userId: string;
  userType: UserType;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalanceCreateInput {
  id?: string;
  userId?: string;
  userType: UserType;
  leaveType: LeaveType;
  totalDays: number;
  usedDays?: number;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveBalanceRelationalCreateInput extends LeaveBalanceCreateInput {
  user?: UserCreateInput;
}

export type LeaveBalanceUpdateInput = Partial<LeaveBalanceCreateInput>;

