import { TeacherEntryType, AttendanceStatus, AttendanceTakeType } from "./enums";
import { TeacherAttendanceModel, TeacherAttendanceCreateInput } from "./teacher-attendance";
import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { GeoLocationModel, GeoLocationCreateInput } from "./geo-location";

export interface TeacherAttendanceEntryModel {
  id: string;
  attendance?: TeacherAttendanceModel;
  attendanceId: string;
  date: string;
  entryType: TeacherEntryType;
  inTime: string | null;
  outTime: string | null;
  section?: SchoolSectionModel;
  sectionId: string | null;
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

export interface TeacherAttendanceEntryCreateInput {
  id?: string;
  attendanceId?: string;
  date?: string;
  entryType: TeacherEntryType;
  inTime?: string | null;
  outTime?: string | null;
  sectionId?: string | null;
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

export interface TeacherAttendanceEntryRelationalCreateInput extends TeacherAttendanceEntryCreateInput {
  attendance?: TeacherAttendanceCreateInput;
  section?: SchoolSectionCreateInput;
  subject?: SchoolSubjectCreateInput;
  location?: GeoLocationCreateInput;
}

export type TeacherAttendanceEntryUpdateInput = Partial<TeacherAttendanceEntryCreateInput>;

