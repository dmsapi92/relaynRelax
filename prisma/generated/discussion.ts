import { CourseModel, CourseCreateInput } from "./course";
import { DiscussionReplyModel, DiscussionReplyCreateInput } from "./discussion-reply";

export interface DiscussionModel {
  id: string;
  title: string;
  content: string;
  course?: CourseModel;
  courseId: string;
  authorId: string;
  replies?: DiscussionReplyModel[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionCreateInput {
  id?: string;
  title: string;
  content: string;
  courseId?: string;
  authorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscussionRelationalCreateInput extends DiscussionCreateInput {
  course?: CourseCreateInput;
  replies?: DiscussionReplyCreateInput | DiscussionReplyCreateInput[];
}

export type DiscussionUpdateInput = Partial<DiscussionCreateInput>;

