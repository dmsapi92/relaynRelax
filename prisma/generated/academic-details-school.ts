import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { StudentModel, StudentCreateInput } from "./student";
import { StudentPreviousSchoolModel, StudentPreviousSchoolCreateInput } from "./student-previous-school";

export interface AcademicDetailsSchoolModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  class?: SchoolClassModel;
  classId: string | null;
  section?: SchoolSectionModel;
  sectionId: string | null;
  rollNumber: string | null;
  subjectIds: string[];
  student?: StudentModel;
  students?: StudentPreviousSchoolModel[];
  admissionNumber: string | null;
  dateOfAdmission: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicDetailsSchoolCreateInput {
  id?: string;
  campusId?: string | null;
  classId?: string | null;
  sectionId?: string | null;
  rollNumber?: string | null;
  subjectIds: string[];
  admissionNumber?: string | null;
  dateOfAdmission?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicDetailsSchoolRelationalCreateInput extends AcademicDetailsSchoolCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  class?: SchoolClassCreateInput;
  section?: SchoolSectionCreateInput;
  student?: StudentCreateInput;
  students?: StudentPreviousSchoolCreateInput | StudentPreviousSchoolCreateInput[];
}

export type AcademicDetailsSchoolUpdateInput = Partial<AcademicDetailsSchoolCreateInput>;

