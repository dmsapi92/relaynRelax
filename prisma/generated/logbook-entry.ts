import { LogbookEntryStatus } from "./enums";
import { TeacherLogbookModel, TeacherLogbookCreateInput } from "./teacher-logbook";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { HomeworkModel, HomeworkCreateInput } from "./homework";
import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";

export interface LogbookEntryModel {
  id: string;
  logbook?: TeacherLogbookModel;
  logbookId: string;
  date: string;
  subject?: SchoolSubjectModel;
  subjectId: string | null;
  period: number | null;
  chapter: string | null;
  description: string | null;
  homework?: HomeworkModel;
  homeworkId: string | null;
  attendance: number | null;
  status: LogbookEntryStatus;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  SchoolSection?: SchoolSectionModel;
  schoolSectionId: string | null;
  CollegeSection?: CollegeSectionModel;
  collegeSectionId: string | null;
}

export interface LogbookEntryCreateInput {
  id?: string;
  logbookId?: string;
  date: string;
  subjectId?: string | null;
  period?: number | null;
  chapter?: string | null;
  description?: string | null;
  homeworkId?: string | null;
  attendance?: number | null;
  status?: LogbookEntryStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  schoolSectionId?: string | null;
  collegeSectionId?: string | null;
}

export interface LogbookEntryRelationalCreateInput extends LogbookEntryCreateInput {
  logbook?: TeacherLogbookCreateInput;
  subject?: SchoolSubjectCreateInput;
  homework?: HomeworkCreateInput;
  SchoolSection?: SchoolSectionCreateInput;
  CollegeSection?: CollegeSectionCreateInput;
}

export type LogbookEntryUpdateInput = Partial<LogbookEntryCreateInput>;

