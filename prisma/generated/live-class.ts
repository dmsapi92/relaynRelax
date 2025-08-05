import { ClassStatus } from "./enums";
import { CourseModel, CourseCreateInput } from "./course";
import { LiveClassAttendeeModel, LiveClassAttendeeCreateInput } from "./live-class-attendee";

export interface LiveClassModel {
  id: string;
  title: string;
  description: string;
  course?: CourseModel;
  courseId: string;
  startTime: string;
  duration: number;
  meetingUrl: string;
  recordingUrl: string | null;
  status: ClassStatus;
  attendees?: LiveClassAttendeeModel[];
  createdAt: string;
  updatedAt: string;
}

export interface LiveClassCreateInput {
  id?: string;
  title: string;
  description: string;
  courseId?: string;
  startTime: string;
  duration: number;
  meetingUrl: string;
  recordingUrl?: string | null;
  status?: ClassStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LiveClassRelationalCreateInput extends LiveClassCreateInput {
  course?: CourseCreateInput;
  attendees?: LiveClassAttendeeCreateInput | LiveClassAttendeeCreateInput[];
}

export type LiveClassUpdateInput = Partial<LiveClassCreateInput>;

