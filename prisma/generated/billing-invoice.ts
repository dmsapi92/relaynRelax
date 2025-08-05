import { BillingInvoiceStatus } from "./enums";
import { BillingSubscriptionModel, BillingSubscriptionCreateInput } from "./billing-subscription";
import { BillingInvoiceItemModel, BillingInvoiceItemCreateInput } from "./billing-invoice-item";

export interface BillingInvoiceModel {
  id: string;
  subscription?: BillingSubscriptionModel;
  subscriptionId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: BillingInvoiceStatus;
  dueDate: string;
  paidAt: string | null;
  items?: BillingInvoiceItemModel[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingInvoiceCreateInput {
  id?: string;
  subscriptionId?: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: BillingInvoiceStatus;
  dueDate: string;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BillingInvoiceRelationalCreateInput extends BillingInvoiceCreateInput {
  subscription?: BillingSubscriptionCreateInput;
  items?: BillingInvoiceItemCreateInput | BillingInvoiceItemCreateInput[];
}

export type BillingInvoiceUpdateInput = Partial<BillingInvoiceCreateInput>;

