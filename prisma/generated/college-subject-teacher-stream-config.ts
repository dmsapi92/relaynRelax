import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";
import { CollegeSubjectTeacherModel, CollegeSubjectTeacherCreateInput } from "./college-subject-teacher";

export interface CollegeSubjectTeacherStreamConfigModel {
  id: string;
  stream?: CollegeStreamModel;
  streamId: string;
  section?: CollegeSectionModel;
  sectionId: string;
  subjectTeacher?: CollegeSubjectTeacherModel;
  subjectTeacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollegeSubjectTeacherStreamConfigCreateInput {
  id?: string;
  streamId?: string;
  sectionId?: string;
  subjectTeacherId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeSubjectTeacherStreamConfigRelationalCreateInput extends CollegeSubjectTeacherStreamConfigCreateInput {
  stream?: CollegeStreamCreateInput;
  section?: CollegeSectionCreateInput;
  subjectTeacher?: CollegeSubjectTeacherCreateInput;
}

export type CollegeSubjectTeacherStreamConfigUpdateInput = Partial<CollegeSubjectTeacherStreamConfigCreateInput>;

