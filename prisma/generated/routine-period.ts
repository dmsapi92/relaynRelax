import { RoutinePeriodType, PeriodCategory } from "./enums";
import { SchoolRoutineModel, SchoolRoutineCreateInput } from "./school-routine";
import { RoutineScheduleModel, RoutineScheduleCreateInput } from "./routine-schedule";

export interface RoutinePeriodModel {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  type: RoutinePeriodType;
  category: PeriodCategory | null;
  description: string | null;
  orderIndex: number;
  routine?: SchoolRoutineModel;
  routineId: string;
  schedules?: RoutineScheduleModel[];
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoutinePeriodCreateInput {
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

export interface RoutinePeriodRelationalCreateInput extends RoutinePeriodCreateInput {
  routine?: SchoolRoutineCreateInput;
  schedules?: RoutineScheduleCreateInput | RoutineScheduleCreateInput[];
}

export type RoutinePeriodUpdateInput = Partial<RoutinePeriodCreateInput>;

