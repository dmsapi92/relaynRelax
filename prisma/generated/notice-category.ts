import { NoticeCategoryRelationModel, NoticeCategoryRelationCreateInput } from "./notice-category-relation";

export interface NoticeCategoryModel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  notices?: NoticeCategoryRelationModel[];
  createdAt: string;
  updatedAt: string;
}

export interface NoticeCategoryCreateInput {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticeCategoryRelationalCreateInput extends NoticeCategoryCreateInput {
  notices?: NoticeCategoryRelationCreateInput | NoticeCategoryRelationCreateInput[];
}

export type NoticeCategoryUpdateInput = Partial<NoticeCategoryCreateInput>;

