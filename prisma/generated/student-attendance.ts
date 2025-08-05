import { DailyAttendanceRecordModel, DailyAttendanceRecordCreateInput } from "./daily-attendance-record";
import { StudentModel, StudentCreateInput } from "./student";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { CollegeYearModel, CollegeYearCreateInput } from "./college-year";
import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";
import { StudentAttendanceEntryModel, StudentAttendanceEntryCreateInput } from "./student-attendance-entry";

export interface StudentAttendanceModel {
  id: string;
  dailyRecord?: DailyAttendanceRecordModel;
  dailyRecordId: string;
  student?: StudentModel;
  studentId: string;
  schoolClass?: SchoolClassModel;
  classId: string | null;
  schoolSection?: SchoolSectionModel;
  sectionId: string | null;
  collegeYear?: CollegeYearModel;
  yearId: string | null;
  collegeStream?: CollegeStreamModel;
  streamId: string | null;
  collegeSection?: CollegeSectionModel;
  collegeSectionId: string | null;
  entries?: StudentAttendanceEntryModel[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentAttendanceCreateInput {
  id?: string;
  dailyRecordId?: string;
  studentId?: string;
  classId?: string | null;
  sectionId?: string | null;
  yearId?: string | null;
  streamId?: string | null;
  collegeSectionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAttendanceRelationalCreateInput extends StudentAttendanceCreateInput {
  dailyRecord?: DailyAttendanceRecordCreateInput;
  student?: StudentCreateInput;
  schoolClass?: SchoolClassCreateInput;
  schoolSection?: SchoolSectionCreateInput;
  collegeYear?: CollegeYearCreateInput;
  collegeStream?: CollegeStreamCreateInput;
  collegeSection?: CollegeSectionCreateInput;
  entries?: StudentAttendanceEntryCreateInput | StudentAttendanceEntryCreateInput[];
}

export type StudentAttendanceUpdateInput = Partial<StudentAttendanceCreateInput>;

