import { StudentModel, StudentCreateInput } from "./student";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { AcademicDetailsSchoolModel, AcademicDetailsSchoolCreateInput } from "./academic-details-school";

export interface StudentPreviousSchoolModel {
  id: string;
  student?: StudentModel;
  studentId: string;
  session?: AcademicSessionModel;
  sessionId: string;
  academicDetailsSchool?: AcademicDetailsSchoolModel;
  academicDetailsSchoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPreviousSchoolCreateInput {
  id?: string;
  studentId?: string;
  sessionId?: string;
  academicDetailsSchoolId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentPreviousSchoolRelationalCreateInput extends StudentPreviousSchoolCreateInput {
  student?: StudentCreateInput;
  session?: AcademicSessionCreateInput;
  academicDetailsSchool?: AcademicDetailsSchoolCreateInput;
}

export type StudentPreviousSchoolUpdateInput = Partial<StudentPreviousSchoolCreateInput>;

