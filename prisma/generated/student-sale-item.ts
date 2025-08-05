import { SaleItemStatus } from "./enums";
import { StudentSaleModel, StudentSaleCreateInput } from "./student-sale";
import { InventoryModel, InventoryCreateInput } from "./inventory";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface StudentSaleItemModel {
  id: string;
  sale?: StudentSaleModel;
  saleId: string;
  inventory?: InventoryModel;
  inventoryId: string;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number | null;
  finalPrice: number;
  status: SaleItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSaleItemCreateInput {
  id?: string;
  saleId?: string;
  inventoryId?: string;
  campusId?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number | null;
  finalPrice: number;
  status?: SaleItemStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentSaleItemRelationalCreateInput extends StudentSaleItemCreateInput {
  sale?: StudentSaleCreateInput;
  inventory?: InventoryCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
}

export type StudentSaleItemUpdateInput = Partial<StudentSaleItemCreateInput>;

