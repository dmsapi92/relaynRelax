import { NoticeCommentStatus } from "./enums";
import { NoticeModel, NoticeCreateInput } from "./notice";
import { NoticeCommentModel, NoticeCommentCreateInput } from "./notice-comment";

export interface NoticeCommentModel {
  id: string;
  content: string;
  noticeId: string;
  notice?: NoticeModel;
  authorId: string;
  status: NoticeCommentStatus;
  parentId: string | null;
  parent?: NoticeCommentModel;
  replies?: NoticeCommentModel[];
  createdAt: string;
  updatedAt: string;
}

export interface NoticeCommentCreateInput {
  id?: string;
  content: string;
  noticeId?: string;
  authorId: string;
  status?: NoticeCommentStatus;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticeCommentRelationalCreateInput extends NoticeCommentCreateInput {
  notice?: NoticeCreateInput;
  parent?: NoticeCommentCreateInput;
  replies?: NoticeCommentCreateInput | NoticeCommentCreateInput[];
}

export type NoticeCommentUpdateInput = Partial<NoticeCommentCreateInput>;

