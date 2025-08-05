import { ExamType } from "./enums";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ExamScheduleModel, ExamScheduleCreateInput } from "./exam-schedule";
import { ExamResultModel, ExamResultCreateInput } from "./exam-result";
import { AdmitCardModel, AdmitCardCreateInput } from "./admit-card";

export interface ExaminationModel {
  id: string;
  name: string;
  type: ExamType;
  academicYear?: AcademicSessionModel;
  academicYearId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  startDate: string;
  endDate: string;
  resultPublished: boolean;
  examSchedules?: ExamScheduleModel[];
  results?: ExamResultModel[];
  createdAt: string;
  updatedAt: string;
  AdmitCard?: AdmitCardModel[];
}

export interface ExaminationCreateInput {
  id?: string;
  name: string;
  type: ExamType;
  academicYearId?: string;
  campusId?: string;
  startDate: string;
  endDate: string;
  resultPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExaminationRelationalCreateInput extends ExaminationCreateInput {
  academicYear?: AcademicSessionCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  examSchedules?: ExamScheduleCreateInput | ExamScheduleCreateInput[];
  results?: ExamResultCreateInput | ExamResultCreateInput[];
  AdmitCard?: AdmitCardCreateInput | AdmitCardCreateInput[];
}

export type ExaminationUpdateInput = Partial<ExaminationCreateInput>;

