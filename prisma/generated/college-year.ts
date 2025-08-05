import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { CollegeSubjectModel, CollegeSubjectCreateInput } from "./college-subject";
import { AcademicDetailsCollegeModel, AcademicDetailsCollegeCreateInput } from "./academic-details-college";
import { CollegeModel, CollegeCreateInput } from "./college";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";

export interface CollegeYearModel {
  id: string;
  name: string;
  index: number | null;
  streams?: CollegeStreamModel[];
  subjects?: CollegeSubjectModel[];
  academicDetails?: AcademicDetailsCollegeModel[];
  college?: CollegeModel;
  collegeId: string;
  createdAt: string;
  updatedAt: string;
  StudentAttendance?: StudentAttendanceModel[];
}

export interface CollegeYearCreateInput {
  id?: string;
  name: string;
  index?: number | null;
  collegeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeYearRelationalCreateInput extends CollegeYearCreateInput {
  streams?: CollegeStreamCreateInput | CollegeStreamCreateInput[];
  subjects?: CollegeSubjectCreateInput | CollegeSubjectCreateInput[];
  academicDetails?: AcademicDetailsCollegeCreateInput | AcademicDetailsCollegeCreateInput[];
  college?: CollegeCreateInput;
  StudentAttendance?: StudentAttendanceCreateInput | StudentAttendanceCreateInput[];
}

export type CollegeYearUpdateInput = Partial<CollegeYearCreateInput>;

