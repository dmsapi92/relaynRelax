import { AnnouncementModel, AnnouncementCreateInput } from "./announcement";
import { AnnouncementCategoryModel, AnnouncementCategoryCreateInput } from "./announcement-category";

export interface AnnouncementCategoryRelationModel {
  id: string;
  noticeId: string;
  categoryId: string;
  notice?: AnnouncementModel;
  category?: AnnouncementCategoryModel;
  createdAt: string;
}

export interface AnnouncementCategoryRelationCreateInput {
  id?: string;
  noticeId?: string;
  categoryId?: string;
  createdAt?: string;
}

export interface AnnouncementCategoryRelationRelationalCreateInput extends AnnouncementCategoryRelationCreateInput {
  notice?: AnnouncementCreateInput;
  category?: AnnouncementCategoryCreateInput;
}

export type AnnouncementCategoryRelationUpdateInput = Partial<AnnouncementCategoryRelationCreateInput>;

