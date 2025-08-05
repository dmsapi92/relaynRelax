import { InventoryCategoryModel, InventoryCategoryCreateInput } from "./inventory-category";
import { InventorySupplierModel, InventorySupplierCreateInput } from "./inventory-supplier";
import { InventoryStorageLocationModel, InventoryStorageLocationCreateInput } from "./inventory-storage-location";
import { InventoryStockTransactionModel, InventoryStockTransactionCreateInput } from "./inventory-stock-transaction";
import { InventoryPurchaseOrderItemModel, InventoryPurchaseOrderItemCreateInput } from "./inventory-purchase-order-item";
import { InventoryWastageRecordModel, InventoryWastageRecordCreateInput } from "./inventory-wastage-record";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { MaintenanceScheduleModel, MaintenanceScheduleCreateInput } from "./maintenance-schedule";
import { StudentSaleItemModel, StudentSaleItemCreateInput } from "./student-sale-item";
import { StudentCartItemModel, StudentCartItemCreateInput } from "./student-cart-item";

export interface InventoryModel {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  unit: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number | null;
  categoryId: string;
  category?: InventoryCategoryModel;
  supplierId: string | null;
  supplier?: InventorySupplierModel;
  storageLocationId: string | null;
  storageLocation?: InventoryStorageLocationModel;
  expiryDate: string | null;
  lastRestockDate: string | null;
  stockTransactions?: InventoryStockTransactionModel[];
  purchaseOrders?: InventoryPurchaseOrderItemModel[];
  wastageRecords?: InventoryWastageRecordModel[];
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  departmentId: string | null;
  isConsumable: boolean;
  assetTag: string | null;
  warrantyExpiry: string | null;
  maintenanceSchedule?: MaintenanceScheduleModel;
  createdAt: string;
  updatedAt: string;
  saleItems?: StudentSaleItemModel[];
  cartItems?: StudentCartItemModel[];
}

export interface InventoryCreateInput {
  id?: string;
  name: string;
  sku: string;
  description?: string | null;
  unit: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number | null;
  categoryId?: string;
  supplierId?: string | null;
  storageLocationId?: string | null;
  expiryDate?: string | null;
  lastRestockDate?: string | null;
  campusId?: string | null;
  departmentId?: string | null;
  isConsumable?: boolean;
  assetTag?: string | null;
  warrantyExpiry?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryRelationalCreateInput extends InventoryCreateInput {
  category?: InventoryCategoryCreateInput;
  supplier?: InventorySupplierCreateInput;
  storageLocation?: InventoryStorageLocationCreateInput;
  stockTransactions?: InventoryStockTransactionCreateInput | InventoryStockTransactionCreateInput[];
  purchaseOrders?: InventoryPurchaseOrderItemCreateInput | InventoryPurchaseOrderItemCreateInput[];
  wastageRecords?: InventoryWastageRecordCreateInput | InventoryWastageRecordCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
  maintenanceSchedule?: MaintenanceScheduleCreateInput;
  saleItems?: StudentSaleItemCreateInput | StudentSaleItemCreateInput[];
  cartItems?: StudentCartItemCreateInput | StudentCartItemCreateInput[];
}

export type InventoryUpdateInput = Partial<InventoryCreateInput>;

