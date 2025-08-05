export interface SystemSettingModel {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface SystemSettingCreateInput {
  id?: string;
  key: string;
  value: string;
  description?: string | null;
  updatedAt?: string;
  updatedBy?: string | null;
}

export interface SystemSettingRelationalCreateInput extends SystemSettingCreateInput {
  
}

export type SystemSettingUpdateInput = Partial<SystemSettingCreateInput>;

