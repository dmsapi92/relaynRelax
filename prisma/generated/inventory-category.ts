import { InventoryCategoryType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { InventoryModel, InventoryCreateInput } from "./inventory";

export interface InventoryCategoryModel {
  id: string;
  name: string;
  description: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  type: InventoryCategoryType;
  items?: InventoryModel[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCategoryCreateInput {
  id?: string;
  name: string;
  description?: string | null;
  campusId?: string | null;
  type?: InventoryCategoryType;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryCategoryRelationalCreateInput extends InventoryCategoryCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  items?: InventoryCreateInput | InventoryCreateInput[];
}

export type InventoryCategoryUpdateInput = Partial<InventoryCategoryCreateInput>;

