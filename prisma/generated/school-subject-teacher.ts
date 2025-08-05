import { SubjectTeacherType } from "./enums";
import { TeacherModel, TeacherCreateInput } from "./teacher";
import { SectionSubjectTeacherModel, SectionSubjectTeacherCreateInput } from "./section-subject-teacher";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { RoutineScheduleModel, RoutineScheduleCreateInput } from "./routine-schedule";

export interface SchoolSubjectTeacherModel {
  id: string;
  userId: string;
  type: SubjectTeacherType;
  teacher?: TeacherModel;
  teacherId: string;
  sections?: SectionSubjectTeacherModel[];
  subject?: SchoolSubjectModel;
  schoolSubjectId: string;
  createdAt: string;
  updatedAt: string;
  RoutineSchedule?: RoutineScheduleModel[];
}

export interface SchoolSubjectTeacherCreateInput {
  id?: string;
  userId: string;
  type: SubjectTeacherType;
  teacherId?: string;
  schoolSubjectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolSubjectTeacherRelationalCreateInput extends SchoolSubjectTeacherCreateInput {
  teacher?: TeacherCreateInput;
  sections?: SectionSubjectTeacherCreateInput | SectionSubjectTeacherCreateInput[];
  subject?: SchoolSubjectCreateInput;
  RoutineSchedule?: RoutineScheduleCreateInput | RoutineScheduleCreateInput[];
}

export type SchoolSubjectTeacherUpdateInput = Partial<SchoolSubjectTeacherCreateInput>;

