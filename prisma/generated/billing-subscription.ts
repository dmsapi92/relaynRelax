import { BillingSubscriptionPlan, BillingSubscriptionStatus } from "./enums";
import { BillingAddressModel, BillingAddressCreateInput } from "./billing-address";
import { BillingPaymentModel, BillingPaymentCreateInput } from "./billing-payment";
import { BillingInvoiceModel, BillingInvoiceCreateInput } from "./billing-invoice";

export interface BillingSubscriptionModel {
  id: string;
  planType: BillingSubscriptionPlan;
  status: BillingSubscriptionStatus;
  startDate: string;
  endDate: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  razorpayCustomerId: string | null;
  razorpaySubscriptionId: string | null;
  billingEmail: string;
  billingName: string;
  billingAddress?: BillingAddressModel;
  payments?: BillingPaymentModel[];
  invoices?: BillingInvoiceModel[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingSubscriptionCreateInput {
  id?: string;
  planType: BillingSubscriptionPlan;
  status: BillingSubscriptionStatus;
  startDate: string;
  endDate: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
  razorpayCustomerId?: string | null;
  razorpaySubscriptionId?: string | null;
  billingEmail: string;
  billingName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BillingSubscriptionRelationalCreateInput extends BillingSubscriptionCreateInput {
  billingAddress?: BillingAddressCreateInput;
  payments?: BillingPaymentCreateInput | BillingPaymentCreateInput[];
  invoices?: BillingInvoiceCreateInput | BillingInvoiceCreateInput[];
}

export type BillingSubscriptionUpdateInput = Partial<BillingSubscriptionCreateInput>;

