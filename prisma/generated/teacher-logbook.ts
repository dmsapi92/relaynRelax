import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { LogbookEntryModel, LogbookEntryCreateInput } from "./logbook-entry";
import { UserModel, UserCreateInput } from "./user";

export interface TeacherLogbookModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  entries?: LogbookEntryModel[];
  user?: UserModel;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherLogbookCreateInput {
  id?: string;
  campusId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherLogbookRelationalCreateInput extends TeacherLogbookCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  entries?: LogbookEntryCreateInput | LogbookEntryCreateInput[];
  user?: UserCreateInput;
}

export type TeacherLogbookUpdateInput = Partial<TeacherLogbookCreateInput>;

