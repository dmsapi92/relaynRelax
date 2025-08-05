import { AnnouncementCommentStatus } from "./enums";
import { AnnouncementModel, AnnouncementCreateInput } from "./announcement";
import { AnnouncementCommentModel, AnnouncementCommentCreateInput } from "./announcement-comment";

export interface AnnouncementCommentModel {
  id: string;
  content: string;
  noticeId: string;
  notice?: AnnouncementModel;
  authorId: string;
  status: AnnouncementCommentStatus;
  parentId: string | null;
  parent?: AnnouncementCommentModel;
  replies?: AnnouncementCommentModel[];
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementCommentCreateInput {
  id?: string;
  content: string;
  noticeId?: string;
  authorId: string;
  status?: AnnouncementCommentStatus;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementCommentRelationalCreateInput extends AnnouncementCommentCreateInput {
  notice?: AnnouncementCreateInput;
  parent?: AnnouncementCommentCreateInput;
  replies?: AnnouncementCommentCreateInput | AnnouncementCommentCreateInput[];
}

export type AnnouncementCommentUpdateInput = Partial<AnnouncementCommentCreateInput>;

