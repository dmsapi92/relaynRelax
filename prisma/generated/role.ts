import { PermissionModel, PermissionCreateInput } from "./permission";
import { UserModel, UserCreateInput } from "./user";

export interface RoleModel {
  id: string;
  name: string;
  description: string | null;
  permissions?: PermissionModel;
  createdAt: string;
  updatedAt: string;
  User?: UserModel[];
}

export interface RoleCreateInput {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleRelationalCreateInput extends RoleCreateInput {
  permissions?: PermissionCreateInput;
  User?: UserCreateInput | UserCreateInput[];
}

export type RoleUpdateInput = Partial<RoleCreateInput>;

