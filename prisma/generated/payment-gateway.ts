import { PaymentCredentialsModel, PaymentCredentialsCreateInput } from "./payment-credentials";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface PaymentGatewayModel {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  credentials?: PaymentCredentialsModel;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGatewayCreateInput {
  id?: string;
  name: string;
  provider: string;
  isActive?: boolean;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentGatewayRelationalCreateInput extends PaymentGatewayCreateInput {
  credentials?: PaymentCredentialsCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
}

export type PaymentGatewayUpdateInput = Partial<PaymentGatewayCreateInput>;

