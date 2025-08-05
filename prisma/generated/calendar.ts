import { CalendarType, CalendarVisibility } from "./enums";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { CalendarEventModel, CalendarEventCreateInput } from "./calendar-event";
import { CalendarSettingsModel, CalendarSettingsCreateInput } from "./calendar-settings";

export interface CalendarModel {
  id: string;
  name: string;
  type: CalendarType;
  academic?: AcademicSessionModel;
  academicId: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  events?: CalendarEventModel[];
  settings?: CalendarSettingsModel;
  visibility: CalendarVisibility;
  subscribers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarCreateInput {
  id?: string;
  name: string;
  type: CalendarType;
  academicId?: string | null;
  campusId?: string;
  visibility?: CalendarVisibility;
  subscribers: string[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarRelationalCreateInput extends CalendarCreateInput {
  academic?: AcademicSessionCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  events?: CalendarEventCreateInput | CalendarEventCreateInput[];
  settings?: CalendarSettingsCreateInput;
}

export type CalendarUpdateInput = Partial<CalendarCreateInput>;

