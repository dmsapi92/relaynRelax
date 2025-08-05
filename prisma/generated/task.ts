import { TaskPriority, TaskStatus } from "./enums";
import { UserModel, UserCreateInput } from "./user";

export interface TaskModel {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  assignedTo?: UserModel;
  assignedToId: string | null;
  createdBy?: UserModel;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  assignedToId?: string | null;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskRelationalCreateInput extends TaskCreateInput {
  assignedTo?: UserCreateInput;
  createdBy?: UserCreateInput;
}

export type TaskUpdateInput = Partial<TaskCreateInput>;

