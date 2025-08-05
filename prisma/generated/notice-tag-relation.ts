import { NoticeModel, NoticeCreateInput } from "./notice";
import { NoticeTagModel, NoticeTagCreateInput } from "./notice-tag";

export interface NoticeTagRelationModel {
  id: string;
  noticeId: string;
  tagId: string;
  notice?: NoticeModel;
  tag?: NoticeTagModel;
  createdAt: string;
}

export interface NoticeTagRelationCreateInput {
  id?: string;
  noticeId?: string;
  tagId?: string;
  createdAt?: string;
}

export interface NoticeTagRelationRelationalCreateInput extends NoticeTagRelationCreateInput {
  notice?: NoticeCreateInput;
  tag?: NoticeTagCreateInput;
}

export type NoticeTagRelationUpdateInput = Partial<NoticeTagRelationCreateInput>;

