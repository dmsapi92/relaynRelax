import { TodoPriority, TodoStatus, TodoCategory } from "./enums";


export interface ToDoModel {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  dueDate: string | null;
  priority: TodoPriority;
  status: TodoStatus;
  category: TodoCategory;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ToDoCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  userId: string;
  dueDate?: string | null;
  priority?: TodoPriority;
  status?: TodoStatus;
  category?: TodoCategory;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ToDoRelationalCreateInput extends ToDoCreateInput {
  
}

export type ToDoUpdateInput = Partial<ToDoCreateInput>;

