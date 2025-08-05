import { ClubType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ClubMemberModel, ClubMemberCreateInput } from "./club-member";
import { ClubEventModel, ClubEventCreateInput } from "./club-event";

export interface ClubActivityModel {
  id: string;
  name: string;
  description: string;
  type: ClubType;
  coordinator: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  members?: ClubMemberModel[];
  events?: ClubEventModel[];
  createdAt: string;
  updatedAt: string;
}

export interface ClubActivityCreateInput {
  id?: string;
  name: string;
  description: string;
  type: ClubType;
  coordinator: string;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubActivityRelationalCreateInput extends ClubActivityCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  members?: ClubMemberCreateInput | ClubMemberCreateInput[];
  events?: ClubEventCreateInput | ClubEventCreateInput[];
}

export type ClubActivityUpdateInput = Partial<ClubActivityCreateInput>;

