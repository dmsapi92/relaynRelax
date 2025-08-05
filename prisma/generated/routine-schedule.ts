import { DayOfWeek } from "./enums";
import { SchoolRoutineModel, SchoolRoutineCreateInput } from "./school-routine";
import { RoutinePeriodModel, RoutinePeriodCreateInput } from "./routine-period";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { SchoolSubjectTeacherModel, SchoolSubjectTeacherCreateInput } from "./school-subject-teacher";

export interface RoutineScheduleModel {
  id: string;
  routine?: SchoolRoutineModel;
  routineId: string;
  period?: RoutinePeriodModel;
  periodId: string;
  dayOfWeek: DayOfWeek;
  subject?: SchoolSubjectModel;
  subjectId: string | null;
  subjectTeacher?: SchoolSubjectTeacherModel;
  subjectTeacherId: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineScheduleCreateInput {
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

export interface RoutineScheduleRelationalCreateInput extends RoutineScheduleCreateInput {
  routine?: SchoolRoutineCreateInput;
  period?: RoutinePeriodCreateInput;
  subject?: SchoolSubjectCreateInput;
  subjectTeacher?: SchoolSubjectTeacherCreateInput;
}

export type RoutineScheduleUpdateInput = Partial<RoutineScheduleCreateInput>;

