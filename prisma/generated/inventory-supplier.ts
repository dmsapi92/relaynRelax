import { SupplierStatus, SupplierType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AddressModel, AddressCreateInput } from "./address";
import { InventoryModel, InventoryCreateInput } from "./inventory";
import { InventoryPurchaseOrderModel, InventoryPurchaseOrderCreateInput } from "./inventory-purchase-order";

export interface InventorySupplierModel {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  address?: AddressModel;
  items?: InventoryModel[];
  rating: number | null;
  status: SupplierStatus;
  paymentTerms: string | null;
  taxId: string | null;
  notes: string | null;
  purchaseOrders?: InventoryPurchaseOrderModel[];
  supplierType: SupplierType[];
  createdAt: string;
  updatedAt: string;
}

export interface InventorySupplierCreateInput {
  id?: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone: string;
  campusId?: string | null;
  rating?: number | null;
  status?: SupplierStatus;
  paymentTerms?: string | null;
  taxId?: string | null;
  notes?: string | null;
  supplierType: SupplierType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InventorySupplierRelationalCreateInput extends InventorySupplierCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  address?: AddressCreateInput;
  items?: InventoryCreateInput | InventoryCreateInput[];
  purchaseOrders?: InventoryPurchaseOrderCreateInput | InventoryPurchaseOrderCreateInput[];
}

export type InventorySupplierUpdateInput = Partial<InventorySupplierCreateInput>;

