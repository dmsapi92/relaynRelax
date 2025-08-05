import { KYCStatus } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { DocumentModel, DocumentCreateInput } from "./document";

export interface KYCModel {
  id: string;
  userId: string;
  user?: UserModel;
  aadharNumber: string | null;
  panNumber: string | null;
  aadharVerified: boolean;
  panVerified: boolean;
  kycStatus: KYCStatus;
  submittedAt: string;
  verifiedAt: string | null;
  documents?: DocumentModel[];
}

export interface KYCCreateInput {
  id?: string;
  userId?: string;
  aadharNumber?: string | null;
  panNumber?: string | null;
  aadharVerified?: boolean;
  panVerified?: boolean;
  kycStatus?: KYCStatus;
  submittedAt?: string;
  verifiedAt?: string | null;
}

export interface KYCRelationalCreateInput extends KYCCreateInput {
  user?: UserCreateInput;
  documents?: DocumentCreateInput | DocumentCreateInput[];
}

export type KYCUpdateInput = Partial<KYCCreateInput>;

