import { NotificationType } from "./enums";
import { UserModel, UserCreateInput } from "./user";

export interface NotificationModel {
  id: string;
  userId: string;
  user?: UserModel;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationCreateInput {
  id?: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  createdAt?: string;
  readAt?: string | null;
}

export interface NotificationRelationalCreateInput extends NotificationCreateInput {
  user?: UserCreateInput;
}

export type NotificationUpdateInput = Partial<NotificationCreateInput>;

