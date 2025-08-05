import { ParticipantType, ParticipantStatus } from "./enums";
import { AppointmentModel, AppointmentCreateInput } from "./appointment";

export interface AppointmentParticipantModel {
  id: string;
  appointment?: AppointmentModel;
  appointmentId: string;
  userId: string | null;
  userType: ParticipantType;
  status: ParticipantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentParticipantCreateInput {
  id?: string;
  appointmentId?: string;
  userId?: string | null;
  userType: ParticipantType;
  status?: ParticipantStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentParticipantRelationalCreateInput extends AppointmentParticipantCreateInput {
  appointment?: AppointmentCreateInput;
}

export type AppointmentParticipantUpdateInput = Partial<AppointmentParticipantCreateInput>;

