import { StorageType } from "./enums";
import { InventoryModel, InventoryCreateInput } from "./inventory";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { InventoryTemperatureLogModel, InventoryTemperatureLogCreateInput } from "./inventory-temperature-log";

export interface InventoryStorageLocationModel {
  id: string;
  name: string;
  type: StorageType;
  temperature: number | null;
  capacity: number | null;
  items?: InventoryModel[];
  notes: string | null;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  temperatureLog?: InventoryTemperatureLogModel[];
  buildingName: string | null;
  floorNumber: string | null;
  roomNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStorageLocationCreateInput {
  id?: string;
  name: string;
  type: StorageType;
  temperature?: number | null;
  capacity?: number | null;
  notes?: string | null;
  campusId?: string | null;
  buildingName?: string | null;
  floorNumber?: string | null;
  roomNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryStorageLocationRelationalCreateInput extends InventoryStorageLocationCreateInput {
  items?: InventoryCreateInput | InventoryCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
  temperatureLog?: InventoryTemperatureLogCreateInput | InventoryTemperatureLogCreateInput[];
}

export type InventoryStorageLocationUpdateInput = Partial<InventoryStorageLocationCreateInput>;

