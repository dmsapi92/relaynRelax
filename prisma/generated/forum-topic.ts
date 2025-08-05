import { TopicStatus } from "./enums";
import { DiscussionForumModel, DiscussionForumCreateInput } from "./discussion-forum";
import { ForumReplyModel, ForumReplyCreateInput } from "./forum-reply";

export interface ForumTopicModel {
  id: string;
  forum?: DiscussionForumModel;
  forumId: string;
  title: string;
  content: string;
  author: string;
  status: TopicStatus;
  isPinned: boolean;
  isLocked: boolean;
  attachments: string[];
  replies?: ForumReplyModel[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumTopicCreateInput {
  id?: string;
  forumId?: string;
  title: string;
  content: string;
  author: string;
  status?: TopicStatus;
  isPinned?: boolean;
  isLocked?: boolean;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ForumTopicRelationalCreateInput extends ForumTopicCreateInput {
  forum?: DiscussionForumCreateInput;
  replies?: ForumReplyCreateInput | ForumReplyCreateInput[];
}

export type ForumTopicUpdateInput = Partial<ForumTopicCreateInput>;

