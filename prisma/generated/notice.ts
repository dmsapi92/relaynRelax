import { UserType, NoticePriority, NoticeStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { noticeTargetAcadamicModel, noticeTargetAcadamicCreateInput } from "./notice-target-acadamic";
import { NoticeCategoryRelationModel, NoticeCategoryRelationCreateInput } from "./notice-category-relation";
import { NoticeTagRelationModel, NoticeTagRelationCreateInput } from "./notice-tag-relation";
import { NoticeCommentModel, NoticeCommentCreateInput } from "./notice-comment";

export interface NoticeModel {
  id: string;
  title: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  slug: string;
  description: string | null;
  content: string | null;
  excerpt: string | null;
  featuredImage: string | null;
  author: string;
  targetUserTypes: UserType[];
  targetUsers: string[];
  targetAcadamic?: noticeTargetAcadamicModel[];
  priority: NoticePriority;
  status: NoticeStatus;
  categories?: NoticeCategoryRelationModel[];
  tags?: NoticeTagRelationModel[];
  comments?: NoticeCommentModel[];
  likes: number;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeCreateInput {
  id?: string;
  title: string;
  campusId?: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  excerpt?: string | null;
  featuredImage?: string | null;
  author: string;
  targetUserTypes: UserType[];
  targetUsers: string[];
  priority?: NoticePriority;
  status?: NoticeStatus;
  likes?: number;
  views?: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticeRelationalCreateInput extends NoticeCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  targetAcadamic?: noticeTargetAcadamicCreateInput | noticeTargetAcadamicCreateInput[];
  categories?: NoticeCategoryRelationCreateInput | NoticeCategoryRelationCreateInput[];
  tags?: NoticeTagRelationCreateInput | NoticeTagRelationCreateInput[];
  comments?: NoticeCommentCreateInput | NoticeCommentCreateInput[];
}

export type NoticeUpdateInput = Partial<NoticeCreateInput>;

