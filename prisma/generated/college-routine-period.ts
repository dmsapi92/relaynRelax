import { RoutinePeriodType, PeriodCategory } from "./enums";
import { CollegeRoutineModel, CollegeRoutineCreateInput } from "./college-routine";
import { CollegeRoutineScheduleModel, CollegeRoutineScheduleCreateInput } from "./college-routine-schedule";

export interface CollegeRoutinePeriodModel {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  type: RoutinePeriodType;
  category: PeriodCategory | null;
  description: string | null;
  orderIndex: number;
  routine?: CollegeRoutineModel;
  routineId: string;
  schedules?: CollegeRoutineScheduleModel[];
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CollegeRoutinePeriodCreateInput {
  id?: string;
  label: string;
  startTime: string;
  endTime: string;
  type: RoutinePeriodType;
  category?: PeriodCategory | null;
  description?: string | null;
  orderIndex: number;
  routineId?: string;
  isActive?: boolean;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeRoutinePeriodRelationalCreateInput extends CollegeRoutinePeriodCreateInput {
  routine?: CollegeRoutineCreateInput;
  schedules?: CollegeRoutineScheduleCreateInput | CollegeRoutineScheduleCreateInput[];
}

export type CollegeRoutinePeriodUpdateInput = Partial<CollegeRoutinePeriodCreateInput>;

