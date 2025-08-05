import { GoldType } from "./enums";


export interface GoldRateModel {
  id: string;
  ratePerGram: number;
  date: string;
  type: GoldType;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoldRateCreateInput {
  id?: string;
  ratePerGram: number;
  date?: string;
  type: GoldType;
  source: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoldRateRelationalCreateInput extends GoldRateCreateInput {
  
}

export type GoldRateUpdateInput = Partial<GoldRateCreateInput>;

