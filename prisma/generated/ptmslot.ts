import { PTMSlotStatus } from "./enums";
import { ParentTeacherMeetingModel, ParentTeacherMeetingCreateInput } from "./parent-teacher-meeting";

export interface PTMSlotModel {
  id: string;
  meeting?: ParentTeacherMeetingModel;
  meetingId: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  studentId: string | null;
  parentId: string | null;
  status: PTMSlotStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PTMSlotCreateInput {
  id?: string;
  meetingId?: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  studentId?: string | null;
  parentId?: string | null;
  status?: PTMSlotStatus;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PTMSlotRelationalCreateInput extends PTMSlotCreateInput {
  meeting?: ParentTeacherMeetingCreateInput;
}

export type PTMSlotUpdateInput = Partial<PTMSlotCreateInput>;

