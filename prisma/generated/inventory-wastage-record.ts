import { WastageReason } from "./enums";
import { InventoryModel, InventoryCreateInput } from "./inventory";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { StaffModel, StaffCreateInput } from "./staff";

export interface InventoryWastageRecordModel {
  id: string;
  inventoryId: string;
  inventory?: InventoryModel;
  quantity: number;
  reason: WastageReason;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  cost: number;
  reportedBy: string | null;
  reportedByStaff?: StaffModel;
  date: string;
  notes: string | null;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryWastageRecordCreateInput {
  id?: string;
  inventoryId?: string;
  quantity: number;
  reason: WastageReason;
  campusId?: string | null;
  cost: number;
  reportedBy?: string | null;
  date: string;
  notes?: string | null;
  departmentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryWastageRecordRelationalCreateInput extends InventoryWastageRecordCreateInput {
  inventory?: InventoryCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  reportedByStaff?: StaffCreateInput;
}

export type InventoryWastageRecordUpdateInput = Partial<InventoryWastageRecordCreateInput>;

