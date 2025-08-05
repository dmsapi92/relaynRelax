import { SportActivityModel, SportActivityCreateInput } from "./sport-activity";

export interface SportAchievementModel {
  id: string;
  activity?: SportActivityModel;
  activityId: string;
  title: string;
  description: string;
  date: string;
  participants: string[];
  position: string | null;
  certificate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SportAchievementCreateInput {
  id?: string;
  activityId?: string;
  title: string;
  description: string;
  date: string;
  participants: string[];
  position?: string | null;
  certificate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SportAchievementRelationalCreateInput extends SportAchievementCreateInput {
  activity?: SportActivityCreateInput;
}

export type SportAchievementUpdateInput = Partial<SportAchievementCreateInput>;

