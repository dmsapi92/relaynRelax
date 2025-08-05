import { ValidationStatus } from "./enums";
import { GeoLocationModel, GeoLocationCreateInput } from "./geo-location";

export interface CertificateVerificationLogModel {
  id: string;
  certificateNo: string;
  verificationId: string;
  verifiedAt: string;
  verifiedBy: string | null;
  ipAddress: string | null;
  deviceInfo: string | null;
  status: ValidationStatus;
  reason: string | null;
  location?: GeoLocationModel;
  createdAt: string;
}

export interface CertificateVerificationLogCreateInput {
  id?: string;
  certificateNo: string;
  verificationId: string;
  verifiedAt?: string;
  verifiedBy?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  status: ValidationStatus;
  reason?: string | null;
  createdAt?: string;
}

export interface CertificateVerificationLogRelationalCreateInput extends CertificateVerificationLogCreateInput {
  location?: GeoLocationCreateInput;
}

export type CertificateVerificationLogUpdateInput = Partial<CertificateVerificationLogCreateInput>;

