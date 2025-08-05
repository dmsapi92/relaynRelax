import { StaffEntryType, AttendanceStatus, AttendanceTakeType } from "./enums";
import { StaffAttendanceModel, StaffAttendanceCreateInput } from "./staff-attendance";
import { GeoLocationModel, GeoLocationCreateInput } from "./geo-location";

export interface StaffAttendanceEntryModel {
  id: string;
  attendance?: StaffAttendanceModel;
  attendanceId: string;
  date: string;
  entryType: StaffEntryType;
  inTime: string | null;
  outTime: string | null;
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

export interface StaffAttendanceEntryCreateInput {
  id?: string;
  attendanceId?: string;
  date?: string;
  entryType: StaffEntryType;
  inTime?: string | null;
  outTime?: string | null;
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

export interface StaffAttendanceEntryRelationalCreateInput extends StaffAttendanceEntryCreateInput {
  attendance?: StaffAttendanceCreateInput;
  location?: GeoLocationCreateInput;
}

export type StaffAttendanceEntryUpdateInput = Partial<StaffAttendanceEntryCreateInput>;

