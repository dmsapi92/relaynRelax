import { NoticeTagRelationModel, NoticeTagRelationCreateInput } from "./notice-tag-relation";

export interface NoticeTagModel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  notices?: NoticeTagRelationModel[];
  createdAt: string;
  updatedAt: string;
}

export interface NoticeTagCreateInput {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticeTagRelationalCreateInput extends NoticeTagCreateInput {
  notices?: NoticeTagRelationCreateInput | NoticeTagRelationCreateInput[];
}

export type NoticeTagUpdateInput = Partial<NoticeTagCreateInput>;

