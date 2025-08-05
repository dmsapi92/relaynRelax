import { ForumTopicModel, ForumTopicCreateInput } from "./forum-topic";

export interface ForumReplyModel {
  id: string;
  topic?: ForumTopicModel;
  topicId: string;
  content: string;
  author: string;
  parentReplyId: string | null;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumReplyCreateInput {
  id?: string;
  topicId?: string;
  content: string;
  author: string;
  parentReplyId?: string | null;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ForumReplyRelationalCreateInput extends ForumReplyCreateInput {
  topic?: ForumTopicCreateInput;
}

export type ForumReplyUpdateInput = Partial<ForumReplyCreateInput>;

