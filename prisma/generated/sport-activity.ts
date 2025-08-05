import { SportType } from "./enums";
import { SportScheduleModel, SportScheduleCreateInput } from "./sport-schedule";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SportAchievementModel, SportAchievementCreateInput } from "./sport-achievement";

export interface SportActivityModel {
  id: string;
  name: string;
  type: SportType;
  coach: string;
  schedule?: SportScheduleModel[];
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  participants: string[];
  achievements?: SportAchievementModel[];
  createdAt: string;
  updatedAt: string;
}

export interface SportActivityCreateInput {
  id?: string;
  name: string;
  type: SportType;
  coach: string;
  campusId?: string;
  participants: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SportActivityRelationalCreateInput extends SportActivityCreateInput {
  schedule?: SportScheduleCreateInput | SportScheduleCreateInput[];
  campus?: InstitutionSetupCampusCreateInput;
  achievements?: SportAchievementCreateInput | SportAchievementCreateInput[];
}

export type SportActivityUpdateInput = Partial<SportActivityCreateInput>;

