import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { AcademicDetailsSchoolModel, AcademicDetailsSchoolCreateInput } from "./academic-details-school";
import { SectionSubjectTeacherModel, SectionSubjectTeacherCreateInput } from "./section-subject-teacher";
import { LessonPlanModel, LessonPlanCreateInput } from "./lesson-plan";
import { LogbookEntryModel, LogbookEntryCreateInput } from "./logbook-entry";
import { SchoolRoutineModel, SchoolRoutineCreateInput } from "./school-routine";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";
import { TeacherAttendanceEntryModel, TeacherAttendanceEntryCreateInput } from "./teacher-attendance-entry";

export interface SchoolSectionModel {
  id: string;
  name: string;
  studentCapacity: number;
  class?: SchoolClassModel;
  classId: string;
  room: string | null;
  academicDetails?: AcademicDetailsSchoolModel[];
  subjectTeachers?: SectionSubjectTeacherModel[];
  createdAt: string;
  updatedAt: string;
  LessonPlan?: LessonPlanModel[];
  LogbookEntry?: LogbookEntryModel[];
  SchoolRoutine?: SchoolRoutineModel[];
  StudentAttendance?: StudentAttendanceModel[];
  TeacherAttendanceEntry?: TeacherAttendanceEntryModel[];
}

export interface SchoolSectionCreateInput {
  id?: string;
  name: string;
  studentCapacity: number;
  classId?: string;
  room?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolSectionRelationalCreateInput extends SchoolSectionCreateInput {
  class?: SchoolClassCreateInput;
  academicDetails?: AcademicDetailsSchoolCreateInput | AcademicDetailsSchoolCreateInput[];
  subjectTeachers?: SectionSubjectTeacherCreateInput | SectionSubjectTeacherCreateInput[];
  LessonPlan?: LessonPlanCreateInput | LessonPlanCreateInput[];
  LogbookEntry?: LogbookEntryCreateInput | LogbookEntryCreateInput[];
  SchoolRoutine?: SchoolRoutineCreateInput | SchoolRoutineCreateInput[];
  StudentAttendance?: StudentAttendanceCreateInput | StudentAttendanceCreateInput[];
  TeacherAttendanceEntry?: TeacherAttendanceEntryCreateInput | TeacherAttendanceEntryCreateInput[];
}

export type SchoolSectionUpdateInput = Partial<SchoolSectionCreateInput>;

