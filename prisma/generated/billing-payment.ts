import { BillingPaymentStatus } from "./enums";
import { BillingSubscriptionModel, BillingSubscriptionCreateInput } from "./billing-subscription";

export interface BillingPaymentModel {
  id: string;
  subscription?: BillingSubscriptionModel;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: BillingPaymentStatus;
  razorpayPaymentId: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingPaymentCreateInput {
  id?: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: BillingPaymentStatus;
  razorpayPaymentId: string;
  paymentMethod: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BillingPaymentRelationalCreateInput extends BillingPaymentCreateInput {
  subscription?: BillingSubscriptionCreateInput;
}

export type BillingPaymentUpdateInput = Partial<BillingPaymentCreateInput>;

