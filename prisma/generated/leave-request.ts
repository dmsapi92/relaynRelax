import { LeaveType, LeaveStatus, UserType } from "./enums";
import { LeaveCommentModel, LeaveCommentCreateInput } from "./leave-comment";
import { UserModel, UserCreateInput } from "./user";

export interface LeaveRequestModel {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  documents: string[];
  comments?: LeaveCommentModel[];
  user?: UserModel;
  userId: string;
  userType: UserType;
  approverId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequestCreateInput {
  id?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status?: LeaveStatus;
  documents: string[];
  userId?: string;
  userType: UserType;
  approverId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveRequestRelationalCreateInput extends LeaveRequestCreateInput {
  comments?: LeaveCommentCreateInput | LeaveCommentCreateInput[];
  user?: UserCreateInput;
}

export type LeaveRequestUpdateInput = Partial<LeaveRequestCreateInput>;

