import { SchoolSubjectType } from "./enums";
import { SchoolSubjectTeacherModel, SchoolSubjectTeacherCreateInput } from "./school-subject-teacher";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { ExamScheduleModel, ExamScheduleCreateInput } from "./exam-schedule";
import { LessonPlanModel, LessonPlanCreateInput } from "./lesson-plan";
import { LogbookEntryModel, LogbookEntryCreateInput } from "./logbook-entry";
import { RoutineScheduleModel, RoutineScheduleCreateInput } from "./routine-schedule";
import { StudentAttendanceEntryModel, StudentAttendanceEntryCreateInput } from "./student-attendance-entry";
import { TeacherAttendanceEntryModel, TeacherAttendanceEntryCreateInput } from "./teacher-attendance-entry";

export interface SchoolSubjectModel {
  id: string;
  name: string;
  type: SchoolSubjectType;
  chapters: string[];
  subjectTeachers?: SchoolSubjectTeacherModel[];
  class?: SchoolClassModel;
  classId: string;
  academicDetailsIds: string[];
  createdAt: string;
  updatedAt: string;
  ExamSchedule?: ExamScheduleModel[];
  LessonPlan?: LessonPlanModel[];
  LogbookEntry?: LogbookEntryModel[];
  RoutineSchedule?: RoutineScheduleModel[];
  StudentAttendanceEntry?: StudentAttendanceEntryModel[];
  TeacherAttendanceEntry?: TeacherAttendanceEntryModel[];
}

export interface SchoolSubjectCreateInput {
  id?: string;
  name: string;
  type: SchoolSubjectType;
  chapters: string[];
  classId?: string;
  academicDetailsIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolSubjectRelationalCreateInput extends SchoolSubjectCreateInput {
  subjectTeachers?: SchoolSubjectTeacherCreateInput | SchoolSubjectTeacherCreateInput[];
  class?: SchoolClassCreateInput;
  ExamSchedule?: ExamScheduleCreateInput | ExamScheduleCreateInput[];
  LessonPlan?: LessonPlanCreateInput | LessonPlanCreateInput[];
  LogbookEntry?: LogbookEntryCreateInput | LogbookEntryCreateInput[];
  RoutineSchedule?: RoutineScheduleCreateInput | RoutineScheduleCreateInput[];
  StudentAttendanceEntry?: StudentAttendanceEntryCreateInput | StudentAttendanceEntryCreateInput[];
  TeacherAttendanceEntry?: TeacherAttendanceEntryCreateInput | TeacherAttendanceEntryCreateInput[];
}

export type SchoolSubjectUpdateInput = Partial<SchoolSubjectCreateInput>;

