import { AnnouncementTagRelationModel, AnnouncementTagRelationCreateInput } from "./announcement-tag-relation";

export interface AnnouncementTagModel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  notices?: AnnouncementTagRelationModel[];
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementTagCreateInput {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementTagRelationalCreateInput extends AnnouncementTagCreateInput {
  notices?: AnnouncementTagRelationCreateInput | AnnouncementTagRelationCreateInput[];
}

export type AnnouncementTagUpdateInput = Partial<AnnouncementTagCreateInput>;

