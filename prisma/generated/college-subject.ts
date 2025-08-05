import { CollegeSubjectType } from "./enums";
import { CollegeSubjectTeacherModel, CollegeSubjectTeacherCreateInput } from "./college-subject-teacher";
import { CollegeYearModel, CollegeYearCreateInput } from "./college-year";
import { CollegeRoutineScheduleModel, CollegeRoutineScheduleCreateInput } from "./college-routine-schedule";

export interface CollegeSubjectModel {
  id: string;
  name: string;
  type: CollegeSubjectType;
  chapters: string[];
  subjectTeachers?: CollegeSubjectTeacherModel[];
  year?: CollegeYearModel;
  yearId: string;
  academicDetailsIds: string[];
  createdAt: string;
  updatedAt: string;
  CollegeRoutineSchedule?: CollegeRoutineScheduleModel[];
}

export interface CollegeSubjectCreateInput {
  id?: string;
  name: string;
  type: CollegeSubjectType;
  chapters: string[];
  yearId?: string;
  academicDetailsIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeSubjectRelationalCreateInput extends CollegeSubjectCreateInput {
  subjectTeachers?: CollegeSubjectTeacherCreateInput | CollegeSubjectTeacherCreateInput[];
  year?: CollegeYearCreateInput;
  CollegeRoutineSchedule?: CollegeRoutineScheduleCreateInput | CollegeRoutineScheduleCreateInput[];
}

export type CollegeSubjectUpdateInput = Partial<CollegeSubjectCreateInput>;

