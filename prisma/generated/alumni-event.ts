import { EventStatus } from "./enums";
import { AlumniNetworkModel, AlumniNetworkCreateInput } from "./alumni-network";

export interface AlumniEventModel {
  id: string;
  alumni?: AlumniNetworkModel;
  alumniId: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  participants: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniEventCreateInput {
  id?: string;
  alumniId?: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  participants: string[];
  status?: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlumniEventRelationalCreateInput extends AlumniEventCreateInput {
  alumni?: AlumniNetworkCreateInput;
}

export type AlumniEventUpdateInput = Partial<AlumniEventCreateInput>;

