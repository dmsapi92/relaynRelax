import { SubjectTeacherType } from "./enums";
import { TeacherModel, TeacherCreateInput } from "./teacher";
import { CollegeSubjectTeacherStreamConfigModel, CollegeSubjectTeacherStreamConfigCreateInput } from "./college-subject-teacher-stream-config";
import { CollegeSubjectModel, CollegeSubjectCreateInput } from "./college-subject";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";
import { CollegeRoutineScheduleModel, CollegeRoutineScheduleCreateInput } from "./college-routine-schedule";

export interface CollegeSubjectTeacherModel {
  id: string;
  userId: string;
  type: SubjectTeacherType;
  teacher?: TeacherModel;
  teacherId: string;
  streamConfigs?: CollegeSubjectTeacherStreamConfigModel[];
  subject?: CollegeSubjectModel;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
  CollegeSection?: CollegeSectionModel;
  collegeSectionId: string | null;
  CollegeRoutineSchedule?: CollegeRoutineScheduleModel[];
}

export interface CollegeSubjectTeacherCreateInput {
  id?: string;
  userId: string;
  type: SubjectTeacherType;
  teacherId?: string;
  subjectId?: string;
  createdAt?: string;
  updatedAt?: string;
  collegeSectionId?: string | null;
}

export interface CollegeSubjectTeacherRelationalCreateInput extends CollegeSubjectTeacherCreateInput {
  teacher?: TeacherCreateInput;
  streamConfigs?: CollegeSubjectTeacherStreamConfigCreateInput | CollegeSubjectTeacherStreamConfigCreateInput[];
  subject?: CollegeSubjectCreateInput;
  CollegeSection?: CollegeSectionCreateInput;
  CollegeRoutineSchedule?: CollegeRoutineScheduleCreateInput | CollegeRoutineScheduleCreateInput[];
}

export type CollegeSubjectTeacherUpdateInput = Partial<CollegeSubjectTeacherCreateInput>;

