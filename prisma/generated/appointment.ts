import { AppointmentStatus, AppointmentType } from "./enums";
import { AppointmentParticipantModel, AppointmentParticipantCreateInput } from "./appointment-participant";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface AppointmentModel {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  organizer: string;
  participants?: AppointmentParticipantModel[];
  location: string | null;
  notes: string | null;
  reminder: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  institutionId: string;
  campusId: string;
  campus?: InstitutionSetupCampusModel;
}

export interface AppointmentCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status?: AppointmentStatus;
  type: AppointmentType;
  organizer: string;
  location?: string | null;
  notes?: string | null;
  reminder?: boolean;
  reminderSent?: boolean;
  createdAt?: string;
  updatedAt?: string;
  institutionId: string;
  campusId?: string;
}

export interface AppointmentRelationalCreateInput extends AppointmentCreateInput {
  participants?: AppointmentParticipantCreateInput | AppointmentParticipantCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
}

export type AppointmentUpdateInput = Partial<AppointmentCreateInput>;

