import { StudentModel, StudentCreateInput } from "./student";
import { ExaminationModel, ExaminationCreateInput } from "./examination";
import { ExamScheduleModel, ExamScheduleCreateInput } from "./exam-schedule";

export interface ExamResultModel {
  id: string;
  student?: StudentModel;
  studentId: string;
  examination?: ExaminationModel;
  examinationId: string;
  schedule?: ExamScheduleModel;
  scheduleId: string;
  marksObtained: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResultCreateInput {
  id?: string;
  studentId?: string;
  examinationId?: string;
  scheduleId?: string;
  marksObtained: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamResultRelationalCreateInput extends ExamResultCreateInput {
  student?: StudentCreateInput;
  examination?: ExaminationCreateInput;
  schedule?: ExamScheduleCreateInput;
}

export type ExamResultUpdateInput = Partial<ExamResultCreateInput>;

