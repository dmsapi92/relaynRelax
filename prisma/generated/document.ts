import { DocumentType, DocumentStatus } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { KYCModel, KYCCreateInput } from "./kyc";

export interface DocumentModel {
  id: string;
  userId: string;
  kycId: string | null;
  user?: UserModel;
  kyc?: KYCModel;
  documentType: DocumentType;
  documentUrl: string;
  uploadedAt: string;
  verifiedAt: string | null;
  status: DocumentStatus;
}

export interface DocumentCreateInput {
  id?: string;
  userId?: string;
  kycId?: string | null;
  documentType: DocumentType;
  documentUrl: string;
  uploadedAt?: string;
  verifiedAt?: string | null;
  status?: DocumentStatus;
}

export interface DocumentRelationalCreateInput extends DocumentCreateInput {
  user?: UserCreateInput;
  kyc?: KYCCreateInput;
}

export type DocumentUpdateInput = Partial<DocumentCreateInput>;

