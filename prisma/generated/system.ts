import { AddressModel, AddressCreateInput } from "./address";
import { SystemAdminModel, SystemAdminCreateInput } from "./system-admin";

export interface SystemModel {
  id: string;
  name: string;
  shortName: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  isInitialSystem: boolean;
  address?: AddressModel;
  isTwoFactorAuth: boolean;
  establishmentYear: number | null;
  website: string | null;
  registrationNumber: string | null;
  slogan: string | null;
  description: string | null;
  logo: string | null;
  admins?: SystemAdminModel;
  SystemAdminId: string | null;
  vision: string | null;
  mission: string | null;
  planId: number;
  isVerified: boolean;
  lastLoginAt: string | null;
  loginAttempts: number;
  lockUntil: string | null;
  createdAt: string;
  updatedAt: string;
  razorpaySubscriptionIds: string[];
}

export interface SystemCreateInput {
  id?: string;
  name: string;
  shortName?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone: string;
  isInitialSystem?: boolean;
  isTwoFactorAuth?: boolean;
  establishmentYear?: number | null;
  website?: string | null;
  registrationNumber?: string | null;
  slogan?: string | null;
  description?: string | null;
  logo?: string | null;
  SystemAdminId?: string | null;
  vision?: string | null;
  mission?: string | null;
  planId: number;
  isVerified?: boolean;
  lastLoginAt?: string | null;
  loginAttempts?: number;
  lockUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
  razorpaySubscriptionIds: string[];
}

export interface SystemRelationalCreateInput extends SystemCreateInput {
  address?: AddressCreateInput;
  admins?: SystemAdminCreateInput;
}

export type SystemUpdateInput = Partial<SystemCreateInput>;

