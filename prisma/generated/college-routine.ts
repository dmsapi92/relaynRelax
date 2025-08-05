import { RoutineStatus } from "./enums";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";
import { CollegeRoutinePeriodModel, CollegeRoutinePeriodCreateInput } from "./college-routine-period";
import { CollegeRoutineScheduleModel, CollegeRoutineScheduleCreateInput } from "./college-routine-schedule";

export interface CollegeRoutineModel {
  id: string;
  name: string;
  academicYear?: AcademicSessionModel;
  academicYearId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  stream?: CollegeStreamModel;
  streamId: string;
  section?: CollegeSectionModel;
  sectionId: string;
  periods?: CollegeRoutinePeriodModel[];
  schedules?: CollegeRoutineScheduleModel[];
  isActive: boolean;
  status: RoutineStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CollegeRoutineCreateInput {
  id?: string;
  name: string;
  academicYearId?: string;
  campusId?: string;
  streamId?: string;
  sectionId?: string;
  isActive?: boolean;
  status?: RoutineStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeRoutineRelationalCreateInput extends CollegeRoutineCreateInput {
  academicYear?: AcademicSessionCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  stream?: CollegeStreamCreateInput;
  section?: CollegeSectionCreateInput;
  periods?: CollegeRoutinePeriodCreateInput | CollegeRoutinePeriodCreateInput[];
  schedules?: CollegeRoutineScheduleCreateInput | CollegeRoutineScheduleCreateInput[];
}

export type CollegeRoutineUpdateInput = Partial<CollegeRoutineCreateInput>;

