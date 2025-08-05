import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { InventoryStorageLocationModel, InventoryStorageLocationCreateInput } from "./inventory-storage-location";

export interface InventoryTemperatureLogModel {
  id: string;
  locationId: string;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  location?: InventoryStorageLocationModel;
  temperature: number;
  timestamp: string;
  alert: boolean;
  notes: string | null;
  checkedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTemperatureLogCreateInput {
  id?: string;
  locationId?: string;
  campusId?: string | null;
  temperature: number;
  timestamp: string;
  alert?: boolean;
  notes?: string | null;
  checkedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryTemperatureLogRelationalCreateInput extends InventoryTemperatureLogCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  location?: InventoryStorageLocationCreateInput;
}

export type InventoryTemperatureLogUpdateInput = Partial<InventoryTemperatureLogCreateInput>;

