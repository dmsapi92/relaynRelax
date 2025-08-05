import { StudentEntryType, AttendanceStatus, AttendanceTakeType } from "./enums";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { GeoLocationModel, GeoLocationCreateInput } from "./geo-location";

export interface StudentAttendanceEntryModel {
  id: string;
  attendance?: StudentAttendanceModel;
  attendanceId: string;
  date: string;
  entryType: StudentEntryType;
  inTime: string | null;
  outTime: string | null;
  subject?: SchoolSubjectModel;
  subjectId: string | null;
  status: AttendanceStatus;
  markingMethod: AttendanceTakeType;
  markedBy: string;
  verifiedBy: string | null;
  lateMinutes: number | null;
  earlyExitMinutes: number | null;
  reason: string | null;
  attachments: string[];
  location?: GeoLocationModel;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAttendanceEntryCreateInput {
  id?: string;
  attendanceId?: string;
  date?: string;
  entryType: StudentEntryType;
  inTime?: string | null;
  outTime?: string | null;
  subjectId?: string | null;
  status?: AttendanceStatus;
  markingMethod?: AttendanceTakeType;
  markedBy: string;
  verifiedBy?: string | null;
  lateMinutes?: number | null;
  earlyExitMinutes?: number | null;
  reason?: string | null;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAttendanceEntryRelationalCreateInput extends StudentAttendanceEntryCreateInput {
  attendance?: StudentAttendanceCreateInput;
  subject?: SchoolSubjectCreateInput;
  location?: GeoLocationCreateInput;
}

export type StudentAttendanceEntryUpdateInput = Partial<StudentAttendanceEntryCreateInput>;

