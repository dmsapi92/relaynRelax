import { DayOfWeek } from "./enums";
import { SportActivityModel, SportActivityCreateInput } from "./sport-activity";

export interface SportScheduleModel {
  id: string;
  activity?: SportActivityModel;
  activityId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  venue: string;
  createdAt: string;
  updatedAt: string;
}

export interface SportScheduleCreateInput {
  id?: string;
  activityId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  venue: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SportScheduleRelationalCreateInput extends SportScheduleCreateInput {
  activity?: SportActivityCreateInput;
}

export type SportScheduleUpdateInput = Partial<SportScheduleCreateInput>;

