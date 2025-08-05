import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { HomeworkSubmissionModel, HomeworkSubmissionCreateInput } from "./homework-submission";
import { LogbookEntryModel, LogbookEntryCreateInput } from "./logbook-entry";

export interface HomeworkModel {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  dueDate: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  classId: string | null;
  sectionId: string | null;
  streamId: string | null;
  yearId: string | null;
  attachments: string[];
  submissions?: HomeworkSubmissionModel[];
  createdAt: string;
  updatedAt: string;
  LogbookEntry?: LogbookEntryModel[];
}

export interface HomeworkCreateInput {
  id?: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  dueDate: string;
  campusId?: string;
  classId?: string | null;
  sectionId?: string | null;
  streamId?: string | null;
  yearId?: string | null;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeworkRelationalCreateInput extends HomeworkCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  submissions?: HomeworkSubmissionCreateInput | HomeworkSubmissionCreateInput[];
  LogbookEntry?: LogbookEntryCreateInput | LogbookEntryCreateInput[];
}

export type HomeworkUpdateInput = Partial<HomeworkCreateInput>;

