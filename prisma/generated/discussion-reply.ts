import { DiscussionModel, DiscussionCreateInput } from "./discussion";

export interface DiscussionReplyModel {
  id: string;
  discussion?: DiscussionModel;
  discussionId: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReplyCreateInput {
  id?: string;
  discussionId?: string;
  content: string;
  authorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscussionReplyRelationalCreateInput extends DiscussionReplyCreateInput {
  discussion?: DiscussionCreateInput;
}

export type DiscussionReplyUpdateInput = Partial<DiscussionReplyCreateInput>;

