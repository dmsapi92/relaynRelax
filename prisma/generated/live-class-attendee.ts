import { LiveClassModel, LiveClassCreateInput } from "./live-class";

export interface LiveClassAttendeeModel {
  id: string;
  liveClass?: LiveClassModel;
  liveClassId: string;
  studentId: string;
  joinedAt: string | null;
  leftAt: string | null;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LiveClassAttendeeCreateInput {
  id?: string;
  liveClassId?: string;
  studentId: string;
  joinedAt?: string | null;
  leftAt?: string | null;
  duration?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LiveClassAttendeeRelationalCreateInput extends LiveClassAttendeeCreateInput {
  liveClass?: LiveClassCreateInput;
}

export type LiveClassAttendeeUpdateInput = Partial<LiveClassAttendeeCreateInput>;

