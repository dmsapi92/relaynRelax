import { StudentModel, StudentCreateInput } from "./student";
import { AcademicDetailsCollegeModel, AcademicDetailsCollegeCreateInput } from "./academic-details-college";

export interface StudentPreviousCollegeModel {
  id: string;
  student?: StudentModel;
  studentId: string;
  academicDetailsCollege?: AcademicDetailsCollegeModel;
  academicDetailsCollegeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPreviousCollegeCreateInput {
  id?: string;
  studentId?: string;
  academicDetailsCollegeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentPreviousCollegeRelationalCreateInput extends StudentPreviousCollegeCreateInput {
  student?: StudentCreateInput;
  academicDetailsCollege?: AcademicDetailsCollegeCreateInput;
}

export type StudentPreviousCollegeUpdateInput = Partial<StudentPreviousCollegeCreateInput>;

