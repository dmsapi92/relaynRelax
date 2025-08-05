import { StudentModel, StudentCreateInput } from "./student";
import { InventoryModel, InventoryCreateInput } from "./inventory";

export interface StudentCartItemModel {
  id: string;
  student?: StudentModel;
  studentId: string;
  inventory?: InventoryModel;
  inventoryId: string;
  quantity: number;
  addedAt: string;
  updatedAt: string;
}

export interface StudentCartItemCreateInput {
  id?: string;
  studentId?: string;
  inventoryId?: string;
  quantity: number;
  addedAt?: string;
  updatedAt?: string;
}

export interface StudentCartItemRelationalCreateInput extends StudentCartItemCreateInput {
  student?: StudentCreateInput;
  inventory?: InventoryCreateInput;
}

export type StudentCartItemUpdateInput = Partial<StudentCartItemCreateInput>;

