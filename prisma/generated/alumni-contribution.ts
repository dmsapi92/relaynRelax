import { ContributionType, ContributionStatus } from "./enums";
import { AlumniNetworkModel, AlumniNetworkCreateInput } from "./alumni-network";

export interface AlumniContributionModel {
  id: string;
  alumni?: AlumniNetworkModel;
  alumniId: string;
  type: ContributionType;
  description: string;
  date: string;
  value: number | null;
  status: ContributionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniContributionCreateInput {
  id?: string;
  alumniId?: string;
  type: ContributionType;
  description: string;
  date: string;
  value?: number | null;
  status?: ContributionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlumniContributionRelationalCreateInput extends AlumniContributionCreateInput {
  alumni?: AlumniNetworkCreateInput;
}

export type AlumniContributionUpdateInput = Partial<AlumniContributionCreateInput>;

