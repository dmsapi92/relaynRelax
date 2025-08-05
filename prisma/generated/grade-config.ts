export interface GradeConfigModel {
  id: string;
  name: string;
  advice: string | null;
  minPercentage: number;
  maxPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface GradeConfigCreateInput {
  id?: string;
  name: string;
  advice?: string | null;
  minPercentage: number;
  maxPercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GradeConfigRelationalCreateInput extends GradeConfigCreateInput {
  
}

export type GradeConfigUpdateInput = Partial<GradeConfigCreateInput>;

