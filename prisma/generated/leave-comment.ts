import { LeaveRequestModel, LeaveRequestCreateInput } from "./leave-request";
import { UserModel, UserCreateInput } from "./user";

export interface LeaveCommentModel {
  id: string;
  leaveRequest?: LeaveRequestModel;
  leaveRequestId: string;
  comment: string;
  commentedBy?: UserModel;
  commentedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveCommentCreateInput {
  id?: string;
  leaveRequestId?: string;
  comment: string;
  commentedById?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveCommentRelationalCreateInput extends LeaveCommentCreateInput {
  leaveRequest?: LeaveRequestCreateInput;
  commentedBy?: UserCreateInput;
}

export type LeaveCommentUpdateInput = Partial<LeaveCommentCreateInput>;

