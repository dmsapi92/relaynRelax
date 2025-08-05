import { DailyAttendanceRecordModel, DailyAttendanceRecordCreateInput } from "./daily-attendance-record";
import { StaffModel, StaffCreateInput } from "./staff";
import { StaffAttendanceEntryModel, StaffAttendanceEntryCreateInput } from "./staff-attendance-entry";

export interface StaffAttendanceModel {
  id: string;
  dailyRecord?: DailyAttendanceRecordModel;
  dailyRecordId: string;
  staff?: StaffModel;
  staffId: string;
  entries?: StaffAttendanceEntryModel[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffAttendanceCreateInput {
  id?: string;
  dailyRecordId?: string;
  staffId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffAttendanceRelationalCreateInput extends StaffAttendanceCreateInput {
  dailyRecord?: DailyAttendanceRecordCreateInput;
  staff?: StaffCreateInput;
  entries?: StaffAttendanceEntryCreateInput | StaffAttendanceEntryCreateInput[];
}

export type StaffAttendanceUpdateInput = Partial<StaffAttendanceCreateInput>;

