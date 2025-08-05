import { AddressModel, AddressCreateInput } from "./address";
import { SystemModel, SystemCreateInput } from "./system";

export interface SystemAdminModel {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  SystemId: string;
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
  System?: SystemModel[];
  isSuperAdmin: boolean;
}

export interface SystemAdminCreateInput {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  SystemId: string;
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

export interface SystemAdminRelationalCreateInput extends SystemAdminCreateInput {
  address?: AddressCreateInput;
  System?: SystemCreateInput | SystemCreateInput[];
}

export type SystemAdminUpdateInput = Partial<SystemAdminCreateInput>;

