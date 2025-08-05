import { AnnouncementCategoryRelationModel, AnnouncementCategoryRelationCreateInput } from "./announcement-category-relation";

export interface AnnouncementCategoryModel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  notices?: AnnouncementCategoryRelationModel[];
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementCategoryCreateInput {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementCategoryRelationalCreateInput extends AnnouncementCategoryCreateInput {
  notices?: AnnouncementCategoryRelationCreateInput | AnnouncementCategoryRelationCreateInput[];
}

export type AnnouncementCategoryUpdateInput = Partial<AnnouncementCategoryCreateInput>;

