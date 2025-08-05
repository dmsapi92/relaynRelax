import { StudentModel, StudentCreateInput } from "./student";
import { SubjectPerformanceModel, SubjectPerformanceCreateInput } from "./subject-performance";

export interface StudentAcademicPerformanceModel {
  id: string;
  student?: StudentModel;
  studentId: string;
  examType: string;
  term: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  subjects?: SubjectPerformanceModel[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentAcademicPerformanceCreateInput {
  id?: string;
  studentId?: string;
  examType: string;
  term: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAcademicPerformanceRelationalCreateInput extends StudentAcademicPerformanceCreateInput {
  student?: StudentCreateInput;
  subjects?: SubjectPerformanceCreateInput | SubjectPerformanceCreateInput[];
}

export type StudentAcademicPerformanceUpdateInput = Partial<StudentAcademicPerformanceCreateInput>;

