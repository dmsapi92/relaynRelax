import { PermissionDataModel, PermissionDataCreateInput } from "./permission-data";
import { RoleModel, RoleCreateInput } from "./role";

export interface PermissionModel {
  id: string;
  name: string;
  permissionsData?: PermissionDataModel[];
  role?: RoleModel;
  roleId: string;
}

export interface PermissionCreateInput {
  id?: string;
  name: string;
  roleId?: string;
}

export interface PermissionRelationalCreateInput extends PermissionCreateInput {
  permissionsData?: PermissionDataCreateInput | PermissionDataCreateInput[];
  role?: RoleCreateInput;
}

export type PermissionUpdateInput = Partial<PermissionCreateInput>;

