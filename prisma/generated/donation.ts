import { PaymentMethod, PaymentStatus } from "./enums";
import { DonorModel, DonorCreateInput } from "./donor";

export interface DonationModel {
  id: string;
  donor?: DonorModel;
  donorId: string;
  amount: number;
  purpose: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference: string | null;
  certificate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonationCreateInput {
  id?: string;
  donorId?: string;
  amount: number;
  purpose: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference?: string | null;
  certificate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DonationRelationalCreateInput extends DonationCreateInput {
  donor?: DonorCreateInput;
}

export type DonationUpdateInput = Partial<DonationCreateInput>;

