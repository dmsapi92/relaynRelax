import { InventoryTransactionType } from "./enums";
import { InventoryModel, InventoryCreateInput } from "./inventory";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface InventoryStockTransactionModel {
  id: string;
  inventoryId: string;
  inventory?: InventoryModel;
  type: InventoryTransactionType;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  quantity: number;
  unitPrice: number | null;
  totalPrice: number | null;
  reference: string | null;
  notes: string | null;
  departmentId: string | null;
  requestedBy: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStockTransactionCreateInput {
  id?: string;
  inventoryId?: string;
  type: InventoryTransactionType;
  campusId?: string | null;
  quantity: number;
  unitPrice?: number | null;
  totalPrice?: number | null;
  reference?: string | null;
  notes?: string | null;
  departmentId?: string | null;
  requestedBy?: string | null;
  approvedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryStockTransactionRelationalCreateInput extends InventoryStockTransactionCreateInput {
  inventory?: InventoryCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
}

export type InventoryStockTransactionUpdateInput = Partial<InventoryStockTransactionCreateInput>;

