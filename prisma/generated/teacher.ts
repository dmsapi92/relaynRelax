import { CampusType } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { DynamicFormModel, DynamicFormCreateInput } from "./dynamic-form";
import { SalaryPresetModel, SalaryPresetCreateInput } from "./salary-preset";
import { SchoolSubjectTeacherModel, SchoolSubjectTeacherCreateInput } from "./school-subject-teacher";
import { CollegeSubjectTeacherModel, CollegeSubjectTeacherCreateInput } from "./college-subject-teacher";
import { TeacherAttendanceModel, TeacherAttendanceCreateInput } from "./teacher-attendance";

export interface TeacherModel {
  id: string;
  user?: UserModel;
  userId: string;
  campusType: CampusType;
  qualification: string | null;
  specialization: string | null;
  experience: number | null;
  dynamicForm?: DynamicFormModel;
  dynamicFormId: string | null;
  salaryPreset?: SalaryPresetModel;
  salaryPresetId: string | null;
  createdAt: string;
  updatedAt: string;
  SubjectTeacher?: SchoolSubjectTeacherModel[];
  CollegeSubjectTeacher?: CollegeSubjectTeacherModel[];
  TeacherAttendance?: TeacherAttendanceModel[];
}

export interface TeacherCreateInput {
  id?: string;
  userId?: string;
  campusType?: CampusType;
  qualification?: string | null;
  specialization?: string | null;
  experience?: number | null;
  dynamicFormId?: string | null;
  salaryPresetId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherRelationalCreateInput extends TeacherCreateInput {
  user?: UserCreateInput;
  dynamicForm?: DynamicFormCreateInput;
  salaryPreset?: SalaryPresetCreateInput;
  SubjectTeacher?: SchoolSubjectTeacherCreateInput | SchoolSubjectTeacherCreateInput[];
  CollegeSubjectTeacher?: CollegeSubjectTeacherCreateInput | CollegeSubjectTeacherCreateInput[];
  TeacherAttendance?: TeacherAttendanceCreateInput | TeacherAttendanceCreateInput[];
}

export type TeacherUpdateInput = Partial<TeacherCreateInput>;

