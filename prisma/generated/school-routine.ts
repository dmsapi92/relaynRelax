import { RoutineStatus } from "./enums";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { RoutinePeriodModel, RoutinePeriodCreateInput } from "./routine-period";
import { RoutineScheduleModel, RoutineScheduleCreateInput } from "./routine-schedule";

export interface SchoolRoutineModel {
  id: string;
  name: string;
  academicYear?: AcademicSessionModel;
  academicYearId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  class?: SchoolClassModel;
  classId: string;
  section?: SchoolSectionModel;
  sectionId: string;
  periods?: RoutinePeriodModel[];
  schedules?: RoutineScheduleModel[];
  isActive: boolean;
  status: RoutineStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolRoutineCreateInput {
  id?: string;
  name: string;
  academicYearId?: string;
  campusId?: string;
  classId?: string;
  sectionId?: string;
  isActive?: boolean;
  status?: RoutineStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolRoutineRelationalCreateInput extends SchoolRoutineCreateInput {
  academicYear?: AcademicSessionCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  class?: SchoolClassCreateInput;
  section?: SchoolSectionCreateInput;
  periods?: RoutinePeriodCreateInput | RoutinePeriodCreateInput[];
  schedules?: RoutineScheduleCreateInput | RoutineScheduleCreateInput[];
}

export type SchoolRoutineUpdateInput = Partial<SchoolRoutineCreateInput>;

