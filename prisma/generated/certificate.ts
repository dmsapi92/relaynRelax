import { CertificateStatus } from "./enums";


export interface CertificateModel {
  id: string;
  name: string;
  description: string | null;
  documentUrl: string | null;
  issuedBy: string;
  validFrom: string;
  validTo: string;
  certificateNumber: string | null;
  status: CertificateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateCreateInput {
  id?: string;
  name: string;
  description?: string | null;
  documentUrl?: string | null;
  issuedBy: string;
  validFrom: string;
  validTo: string;
  certificateNumber?: string | null;
  status?: CertificateStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificateRelationalCreateInput extends CertificateCreateInput {
  
}

export type CertificateUpdateInput = Partial<CertificateCreateInput>;

