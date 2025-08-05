import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";
import { StaffAttendanceModel, StaffAttendanceCreateInput } from "./staff-attendance";
import { TeacherAttendanceModel, TeacherAttendanceCreateInput } from "./teacher-attendance";

export interface DailyAttendanceRecordModel {
  id: string;
  date: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  academicSession?: AcademicSessionModel;
  academicSessionId: string | null;
  studentAttendances?: StudentAttendanceModel[];
  staffAttendances?: StaffAttendanceModel[];
  teacherAttendances?: TeacherAttendanceModel[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyAttendanceRecordCreateInput {
  id?: string;
  date?: string;
  campusId?: string | null;
  academicSessionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyAttendanceRecordRelationalCreateInput extends DailyAttendanceRecordCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  academicSession?: AcademicSessionCreateInput;
  studentAttendances?: StudentAttendanceCreateInput | StudentAttendanceCreateInput[];
  staffAttendances?: StaffAttendanceCreateInput | StaffAttendanceCreateInput[];
  teacherAttendances?: TeacherAttendanceCreateInput | TeacherAttendanceCreateInput[];
}

export type DailyAttendanceRecordUpdateInput = Partial<DailyAttendanceRecordCreateInput>;

