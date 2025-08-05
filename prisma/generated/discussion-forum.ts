import { ForumCategory } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ForumTopicModel, ForumTopicCreateInput } from "./forum-topic";

export interface DiscussionForumModel {
  id: string;
  title: string;
  description: string;
  category: ForumCategory;
  moderators: string[];
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  topics?: ForumTopicModel[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionForumCreateInput {
  id?: string;
  title: string;
  description: string;
  category: ForumCategory;
  moderators: string[];
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscussionForumRelationalCreateInput extends DiscussionForumCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  topics?: ForumTopicCreateInput | ForumTopicCreateInput[];
}

export type DiscussionForumUpdateInput = Partial<DiscussionForumCreateInput>;

