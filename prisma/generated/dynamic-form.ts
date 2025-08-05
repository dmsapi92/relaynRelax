import { DynamicFormDataSectionModel, DynamicFormDataSectionCreateInput } from "./dynamic-form-data-section";
import { StudentModel, StudentCreateInput } from "./student";
import { StaffModel, StaffCreateInput } from "./staff";
import { TeacherModel, TeacherCreateInput } from "./teacher";
import { AdmissionSchoolStudentModel, AdmissionSchoolStudentCreateInput } from "./admission-school-student";
import { AdmissionCollegeStudentModel, AdmissionCollegeStudentCreateInput } from "./admission-college-student";

export interface DynamicFormModel {
  id: string;
  name: string;
  description: string | null;
  sections?: DynamicFormDataSectionModel[];
  createdAt: string;
  updatedAt: string;
  Student?: StudentModel;
  Staff?: StaffModel;
  Teacher?: TeacherModel;
  AdmissionSchoolStudent?: AdmissionSchoolStudentModel[];
  AdmissionCollegeStudent?: AdmissionCollegeStudentModel[];
}

export interface DynamicFormCreateInput {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DynamicFormRelationalCreateInput extends DynamicFormCreateInput {
  sections?: DynamicFormDataSectionCreateInput | DynamicFormDataSectionCreateInput[];
  Student?: StudentCreateInput;
  Staff?: StaffCreateInput;
  Teacher?: TeacherCreateInput;
  AdmissionSchoolStudent?: AdmissionSchoolStudentCreateInput | AdmissionSchoolStudentCreateInput[];
  AdmissionCollegeStudent?: AdmissionCollegeStudentCreateInput | AdmissionCollegeStudentCreateInput[];
}

export type DynamicFormUpdateInput = Partial<DynamicFormCreateInput>;

