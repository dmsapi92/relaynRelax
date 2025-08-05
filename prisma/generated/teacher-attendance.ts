import { DailyAttendanceRecordModel, DailyAttendanceRecordCreateInput } from "./daily-attendance-record";
import { TeacherModel, TeacherCreateInput } from "./teacher";
import { TeacherAttendanceEntryModel, TeacherAttendanceEntryCreateInput } from "./teacher-attendance-entry";

export interface TeacherAttendanceModel {
  id: string;
  dailyRecord?: DailyAttendanceRecordModel;
  dailyRecordId: string;
  teacher?: TeacherModel;
  teacherId: string;
  entries?: TeacherAttendanceEntryModel[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAttendanceCreateInput {
  id?: string;
  dailyRecordId?: string;
  teacherId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherAttendanceRelationalCreateInput extends TeacherAttendanceCreateInput {
  dailyRecord?: DailyAttendanceRecordCreateInput;
  teacher?: TeacherCreateInput;
  entries?: TeacherAttendanceEntryCreateInput | TeacherAttendanceEntryCreateInput[];
}

export type TeacherAttendanceUpdateInput = Partial<TeacherAttendanceCreateInput>;

