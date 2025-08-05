import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { SchoolSubjectTeacherModel, SchoolSubjectTeacherCreateInput } from "./school-subject-teacher";

export interface SectionSubjectTeacherModel {
  id: string;
  section?: SchoolSectionModel;
  sectionId: string;
  subjectTeacher?: SchoolSubjectTeacherModel;
  subjectTeacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionSubjectTeacherCreateInput {
  id?: string;
  sectionId?: string;
  subjectTeacherId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionSubjectTeacherRelationalCreateInput extends SectionSubjectTeacherCreateInput {
  section?: SchoolSectionCreateInput;
  subjectTeacher?: SchoolSubjectTeacherCreateInput;
}

export type SectionSubjectTeacherUpdateInput = Partial<SectionSubjectTeacherCreateInput>;

