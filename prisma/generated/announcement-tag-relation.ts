import { AnnouncementModel, AnnouncementCreateInput } from "./announcement";
import { AnnouncementTagModel, AnnouncementTagCreateInput } from "./announcement-tag";

export interface AnnouncementTagRelationModel {
  id: string;
  noticeId: string;
  tagId: string;
  notice?: AnnouncementModel;
  tag?: AnnouncementTagModel;
  createdAt: string;
}

export interface AnnouncementTagRelationCreateInput {
  id?: string;
  noticeId?: string;
  tagId?: string;
  createdAt?: string;
}

export interface AnnouncementTagRelationRelationalCreateInput extends AnnouncementTagRelationCreateInput {
  notice?: AnnouncementCreateInput;
  tag?: AnnouncementTagCreateInput;
}

export type AnnouncementTagRelationUpdateInput = Partial<AnnouncementTagRelationCreateInput>;

