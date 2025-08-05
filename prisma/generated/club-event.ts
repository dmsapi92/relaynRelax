import { EventStatus } from "./enums";
import { ClubActivityModel, ClubActivityCreateInput } from "./club-activity";

export interface ClubEventModel {
  id: string;
  club?: ClubActivityModel;
  clubId: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  participants: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClubEventCreateInput {
  id?: string;
  clubId?: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  participants: string[];
  status?: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubEventRelationalCreateInput extends ClubEventCreateInput {
  club?: ClubActivityCreateInput;
}

export type ClubEventUpdateInput = Partial<ClubEventCreateInput>;

