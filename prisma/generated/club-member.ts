import { ClubRole, MemberStatus } from "./enums";
import { ClubActivityModel, ClubActivityCreateInput } from "./club-activity";

export interface ClubMemberModel {
  id: string;
  club?: ClubActivityModel;
  clubId: string;
  studentId: string;
  role: ClubRole;
  joinDate: string;
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMemberCreateInput {
  id?: string;
  clubId?: string;
  studentId: string;
  role?: ClubRole;
  joinDate?: string;
  status?: MemberStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubMemberRelationalCreateInput extends ClubMemberCreateInput {
  club?: ClubActivityCreateInput;
}

export type ClubMemberUpdateInput = Partial<ClubMemberCreateInput>;

