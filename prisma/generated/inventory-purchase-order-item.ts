import { OrderItemStatus, QualityCheckStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { InventoryPurchaseOrderModel, InventoryPurchaseOrderCreateInput } from "./inventory-purchase-order";
import { InventoryModel, InventoryCreateInput } from "./inventory";

export interface InventoryPurchaseOrderItemModel {
  id: string;
  purchaseOrderId: string;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  purchaseOrder?: InventoryPurchaseOrderModel;
  inventoryId: string;
  inventory?: InventoryModel;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number | null;
  status: OrderItemStatus;
  qualityCheck: QualityCheckStatus;
}

export interface InventoryPurchaseOrderItemCreateInput {
  id?: string;
  purchaseOrderId?: string;
  campusId?: string | null;
  inventoryId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number | null;
  status?: OrderItemStatus;
  qualityCheck?: QualityCheckStatus;
}

export interface InventoryPurchaseOrderItemRelationalCreateInput extends InventoryPurchaseOrderItemCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  purchaseOrder?: InventoryPurchaseOrderCreateInput;
  inventory?: InventoryCreateInput;
}

export type InventoryPurchaseOrderItemUpdateInput = Partial<InventoryPurchaseOrderItemCreateInput>;

