import { NoticeModel, NoticeCreateInput } from "./notice";
import { NoticeCategoryModel, NoticeCategoryCreateInput } from "./notice-category";

export interface NoticeCategoryRelationModel {
  id: string;
  noticeId: string;
  categoryId: string;
  notice?: NoticeModel;
  category?: NoticeCategoryModel;
  createdAt: string;
}

export interface NoticeCategoryRelationCreateInput {
  id?: string;
  noticeId?: string;
  categoryId?: string;
  createdAt?: string;
}

export interface NoticeCategoryRelationRelationalCreateInput extends NoticeCategoryRelationCreateInput {
  notice?: NoticeCreateInput;
  category?: NoticeCategoryCreateInput;
}

export type NoticeCategoryRelationUpdateInput = Partial<NoticeCategoryRelationCreateInput>;

