import { DayOfWeek } from "./enums";
import { CollegeRoutineModel, CollegeRoutineCreateInput } from "./college-routine";
import { CollegeRoutinePeriodModel, CollegeRoutinePeriodCreateInput } from "./college-routine-period";
import { CollegeSubjectModel, CollegeSubjectCreateInput } from "./college-subject";
import { CollegeSubjectTeacherModel, CollegeSubjectTeacherCreateInput } from "./college-subject-teacher";

export interface CollegeRoutineScheduleModel {
  id: string;
  routine?: CollegeRoutineModel;
  routineId: string;
  period?: CollegeRoutinePeriodModel;
  periodId: string;
  dayOfWeek: DayOfWeek;
  subject?: CollegeSubjectModel;
  subjectId: string | null;
  subjectTeacher?: CollegeSubjectTeacherModel;
  subjectTeacherId: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CollegeRoutineScheduleCreateInput {
  id?: string;
  routineId?: string;
  periodId?: string;
  dayOfWeek: DayOfWeek;
  subjectId?: string | null;
  subjectTeacherId?: string | null;
  isActive?: boolean;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeRoutineScheduleRelationalCreateInput extends CollegeRoutineScheduleCreateInput {
  routine?: CollegeRoutineCreateInput;
  period?: CollegeRoutinePeriodCreateInput;
  subject?: CollegeSubjectCreateInput;
  subjectTeacher?: CollegeSubjectTeacherCreateInput;
}

export type CollegeRoutineScheduleUpdateInput = Partial<CollegeRoutineScheduleCreateInput>;

