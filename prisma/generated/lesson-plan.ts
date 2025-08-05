import { PlanStatus } from "./enums";
import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { DailyLessonModel, DailyLessonCreateInput } from "./daily-lesson";

export interface LessonPlanModel {
  id: string;
  title: string;
  schoolSection?: SchoolSectionModel;
  schoolSectionId: string | null;
  collegeSection?: CollegeSectionModel;
  collegeSectionId: string | null;
  subject?: SchoolSubjectModel;
  subjectId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  lessons?: DailyLessonModel[];
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlanCreateInput {
  id?: string;
  title: string;
  schoolSectionId?: string | null;
  collegeSectionId?: string | null;
  subjectId?: string;
  campusId?: string;
  status?: PlanStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonPlanRelationalCreateInput extends LessonPlanCreateInput {
  schoolSection?: SchoolSectionCreateInput;
  collegeSection?: CollegeSectionCreateInput;
  subject?: SchoolSubjectCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  lessons?: DailyLessonCreateInput | DailyLessonCreateInput[];
}

export type LessonPlanUpdateInput = Partial<LessonPlanCreateInput>;

