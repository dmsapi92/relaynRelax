import { ExaminationModel, ExaminationCreateInput } from "./examination";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { ExamResultModel, ExamResultCreateInput } from "./exam-result";

export interface ExamScheduleModel {
  id: string;
  examination?: ExaminationModel;
  examinationId: string;
  subject?: SchoolSubjectModel;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId: string;
  supervisors: string[];
  maxMarks: number;
  passingMarks: number;
  instructions: string | null;
  results?: ExamResultModel[];
  createdAt: string;
  updatedAt: string;
}

export interface ExamScheduleCreateInput {
  id?: string;
  examinationId?: string;
  subjectId?: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId: string;
  supervisors: string[];
  maxMarks: number;
  passingMarks: number;
  instructions?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamScheduleRelationalCreateInput extends ExamScheduleCreateInput {
  examination?: ExaminationCreateInput;
  subject?: SchoolSubjectCreateInput;
  results?: ExamResultCreateInput | ExamResultCreateInput[];
}

export type ExamScheduleUpdateInput = Partial<ExamScheduleCreateInput>;

