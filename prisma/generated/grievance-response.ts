import { GrievanceModel, GrievanceCreateInput } from "./grievance";

export interface GrievanceResponseModel {
  id: string;
  grievance?: GrievanceModel;
  grievanceId: string;
  respondedBy: string;
  response: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GrievanceResponseCreateInput {
  id?: string;
  grievanceId?: string;
  respondedBy: string;
  response: string;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GrievanceResponseRelationalCreateInput extends GrievanceResponseCreateInput {
  grievance?: GrievanceCreateInput;
}

export type GrievanceResponseUpdateInput = Partial<GrievanceResponseCreateInput>;

