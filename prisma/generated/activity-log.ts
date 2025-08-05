import { EntityType, ActivityAction } from "./enums";
import { UserModel, UserCreateInput } from "./user";

export interface ActivityLogModel {
  id: string;
  userId: string | null;
  user?: UserModel;
  entityId: string;
  entityType: EntityType;
  action: ActivityAction;
  details: any | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  metadata: any | null;
}

export interface ActivityLogCreateInput {
  id?: string;
  userId?: string | null;
  entityId: string;
  entityType: EntityType;
  action: ActivityAction;
  details?: any | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
  metadata?: any | null;
}

export interface ActivityLogRelationalCreateInput extends ActivityLogCreateInput {
  user?: UserCreateInput;
}

export type ActivityLogUpdateInput = Partial<ActivityLogCreateInput>;

