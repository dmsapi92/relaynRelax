import { AddressModel, AddressCreateInput } from "./address";
import { InstitutionModel, InstitutionCreateInput } from "./institution";

export interface InstitutionAdminModel {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  institutionId: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  verificationToken: string | null;
  verificationTokenExpiry: string | null;
  address?: AddressModel;
  planId: number;
  planName: string;
  monthlyPrice: number;
  authProvider: string;
  FcmToken: string | null;
  Institution?: InstitutionModel[];
  isSuperAdmin: boolean;
}

export interface InstitutionAdminCreateInput {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  institutionId: string;
  createdAt?: string;
  updatedAt?: string;
  verified?: boolean;
  verificationToken?: string | null;
  verificationTokenExpiry?: string | null;
  planId: number;
  planName: string;
  monthlyPrice: number;
  authProvider?: string;
  FcmToken?: string | null;
  isSuperAdmin?: boolean;
}

export interface InstitutionAdminRelationalCreateInput extends InstitutionAdminCreateInput {
  address?: AddressCreateInput;
  Institution?: InstitutionCreateInput | InstitutionCreateInput[];
}

export type InstitutionAdminUpdateInput = Partial<InstitutionAdminCreateInput>;

