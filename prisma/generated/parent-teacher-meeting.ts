import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { PTMSlotModel, PTMSlotCreateInput } from "./ptmslot";

export interface ParentTeacherMeetingModel {
  id: string;
  title: string;
  description: string | null;
  date: string;
  duration: number;
  venue: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  slots?: PTMSlotModel[];
  createdAt: string;
  updatedAt: string;
}

export interface ParentTeacherMeetingCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  date: string;
  duration: number;
  venue: string;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentTeacherMeetingRelationalCreateInput extends ParentTeacherMeetingCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  slots?: PTMSlotCreateInput | PTMSlotCreateInput[];
}

export type ParentTeacherMeetingUpdateInput = Partial<ParentTeacherMeetingCreateInput>;

