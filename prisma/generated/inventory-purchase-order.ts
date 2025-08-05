import { PurchaseOrderStatus, PaymentStatus } from "./enums";
import { InventorySupplierModel, InventorySupplierCreateInput } from "./inventory-supplier";
import { InventoryPurchaseOrderItemModel, InventoryPurchaseOrderItemCreateInput } from "./inventory-purchase-order-item";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface InventoryPurchaseOrderModel {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: InventorySupplierModel;
  status: PurchaseOrderStatus;
  items?: InventoryPurchaseOrderItemModel[];
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  totalAmount: number;
  deliveryDate: string | null;
  paymentStatus: PaymentStatus;
  paymentDueDate: string | null;
  notes: string | null;
  departmentId: string | null;
  requestedBy: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryPurchaseOrderCreateInput {
  id?: string;
  orderNumber: string;
  supplierId?: string;
  status?: PurchaseOrderStatus;
  campusId?: string | null;
  totalAmount: number;
  deliveryDate?: string | null;
  paymentStatus: PaymentStatus;
  paymentDueDate?: string | null;
  notes?: string | null;
  departmentId?: string | null;
  requestedBy?: string | null;
  approvedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryPurchaseOrderRelationalCreateInput extends InventoryPurchaseOrderCreateInput {
  supplier?: InventorySupplierCreateInput;
  items?: InventoryPurchaseOrderItemCreateInput | InventoryPurchaseOrderItemCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
}

export type InventoryPurchaseOrderUpdateInput = Partial<InventoryPurchaseOrderCreateInput>;

