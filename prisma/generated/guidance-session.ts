import { GuidanceSessionStatus } from "./enums";
import { CareerGuidanceModel, CareerGuidanceCreateInput } from "./career-guidance";

export interface GuidanceSessionModel {
  id: string;
  guidance?: CareerGuidanceModel;
  guidanceId: string;
  studentId: string;
  date: string;
  notes: string | null;
  followUp: string | null;
  status: GuidanceSessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GuidanceSessionCreateInput {
  id?: string;
  guidanceId?: string;
  studentId: string;
  date: string;
  notes?: string | null;
  followUp?: string | null;
  status?: GuidanceSessionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuidanceSessionRelationalCreateInput extends GuidanceSessionCreateInput {
  guidance?: CareerGuidanceCreateInput;
}

export type GuidanceSessionUpdateInput = Partial<GuidanceSessionCreateInput>;

