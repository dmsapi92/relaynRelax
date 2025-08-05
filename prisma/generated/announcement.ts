import { AnnouncementStatus, AnnouncementPriority } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AnnouncementCategoryRelationModel, AnnouncementCategoryRelationCreateInput } from "./announcement-category-relation";
import { AnnouncementTagRelationModel, AnnouncementTagRelationCreateInput } from "./announcement-tag-relation";
import { AnnouncementCommentModel, AnnouncementCommentCreateInput } from "./announcement-comment";
import { AnnouncementSeoMetadataModel, AnnouncementSeoMetadataCreateInput } from "./announcement-seo-metadata";

export interface AnnouncementModel {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  excerpt: string | null;
  featuredImage: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  author: string;
  status: AnnouncementStatus;
  priority: AnnouncementPriority;
  categories?: AnnouncementCategoryRelationModel[];
  tags?: AnnouncementTagRelationModel[];
  comments?: AnnouncementCommentModel[];
  likes: number;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seoMetadata?: AnnouncementSeoMetadataModel;
}

export interface AnnouncementCreateInput {
  id?: string;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  excerpt?: string | null;
  featuredImage?: string | null;
  campusId?: string;
  author: string;
  status?: AnnouncementStatus;
  priority?: AnnouncementPriority;
  likes?: number;
  views?: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementRelationalCreateInput extends AnnouncementCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  categories?: AnnouncementCategoryRelationCreateInput | AnnouncementCategoryRelationCreateInput[];
  tags?: AnnouncementTagRelationCreateInput | AnnouncementTagRelationCreateInput[];
  comments?: AnnouncementCommentCreateInput | AnnouncementCommentCreateInput[];
  seoMetadata?: AnnouncementSeoMetadataCreateInput;
}

export type AnnouncementUpdateInput = Partial<AnnouncementCreateInput>;

