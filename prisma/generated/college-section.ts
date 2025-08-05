import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { AcademicDetailsCollegeModel, AcademicDetailsCollegeCreateInput } from "./academic-details-college";
import { CollegeSubjectTeacherModel, CollegeSubjectTeacherCreateInput } from "./college-subject-teacher";
import { CollegeSubjectTeacherStreamConfigModel, CollegeSubjectTeacherStreamConfigCreateInput } from "./college-subject-teacher-stream-config";
import { LessonPlanModel, LessonPlanCreateInput } from "./lesson-plan";
import { LogbookEntryModel, LogbookEntryCreateInput } from "./logbook-entry";
import { CollegeRoutineModel, CollegeRoutineCreateInput } from "./college-routine";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";

export interface CollegeSectionModel {
  id: string;
  name: string;
  studentCapacity: number;
  room: string | null;
  stream?: CollegeStreamModel;
  streamId: string;
  academicDetails?: AcademicDetailsCollegeModel[];
  createdAt: string;
  updatedAt: string;
  CollegeSubjectTeacher?: CollegeSubjectTeacherModel[];
  CollegeSubjectTeacherStreamConfig?: CollegeSubjectTeacherStreamConfigModel[];
  LessonPlan?: LessonPlanModel[];
  LogbookEntry?: LogbookEntryModel[];
  CollegeRoutine?: CollegeRoutineModel[];
  StudentAttendance?: StudentAttendanceModel[];
}

export interface CollegeSectionCreateInput {
  id?: string;
  name: string;
  studentCapacity: number;
  room?: string | null;
  streamId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeSectionRelationalCreateInput extends CollegeSectionCreateInput {
  stream?: CollegeStreamCreateInput;
  academicDetails?: AcademicDetailsCollegeCreateInput | AcademicDetailsCollegeCreateInput[];
  CollegeSubjectTeacher?: CollegeSubjectTeacherCreateInput | CollegeSubjectTeacherCreateInput[];
  CollegeSubjectTeacherStreamConfig?: CollegeSubjectTeacherStreamConfigCreateInput | CollegeSubjectTeacherStreamConfigCreateInput[];
  LessonPlan?: LessonPlanCreateInput | LessonPlanCreateInput[];
  LogbookEntry?: LogbookEntryCreateInput | LogbookEntryCreateInput[];
  CollegeRoutine?: CollegeRoutineCreateInput | CollegeRoutineCreateInput[];
  StudentAttendance?: StudentAttendanceCreateInput | StudentAttendanceCreateInput[];
}

export type CollegeSectionUpdateInput = Partial<CollegeSectionCreateInput>;

