import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { CollegeYearModel, CollegeYearCreateInput } from "./college-year";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";
import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { StudentModel, StudentCreateInput } from "./student";
import { StudentPreviousCollegeModel, StudentPreviousCollegeCreateInput } from "./student-previous-college";

export interface AcademicDetailsCollegeModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  year?: CollegeYearModel;
  yearId: string | null;
  section?: CollegeSectionModel;
  sectionId: string | null;
  stream?: CollegeStreamModel;
  streamId: string | null;
  rollNumber: string | null;
  subjectIds: string[];
  student?: StudentModel;
  students?: StudentPreviousCollegeModel[];
  createdAt: string;
  updatedAt: string;
}

export interface AcademicDetailsCollegeCreateInput {
  id?: string;
  campusId?: string | null;
  yearId?: string | null;
  sectionId?: string | null;
  streamId?: string | null;
  rollNumber?: string | null;
  subjectIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicDetailsCollegeRelationalCreateInput extends AcademicDetailsCollegeCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  year?: CollegeYearCreateInput;
  section?: CollegeSectionCreateInput;
  stream?: CollegeStreamCreateInput;
  student?: StudentCreateInput;
  students?: StudentPreviousCollegeCreateInput | StudentPreviousCollegeCreateInput[];
}

export type AcademicDetailsCollegeUpdateInput = Partial<AcademicDetailsCollegeCreateInput>;

