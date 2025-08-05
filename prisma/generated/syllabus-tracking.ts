import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SyllabusTopicModel, SyllabusTopicCreateInput } from "./syllabus-topic";

export interface SyllabusTrackingModel {
  id: string;
  subjectId: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  classId: string | null;
  sectionId: string | null;
  streamId: string | null;
  yearId: string | null;
  topics?: SyllabusTopicModel[];
  examinationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusTrackingCreateInput {
  id?: string;
  subjectId: string;
  campusId?: string;
  classId?: string | null;
  sectionId?: string | null;
  streamId?: string | null;
  yearId?: string | null;
  examinationId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyllabusTrackingRelationalCreateInput extends SyllabusTrackingCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  topics?: SyllabusTopicCreateInput | SyllabusTopicCreateInput[];
}

export type SyllabusTrackingUpdateInput = Partial<SyllabusTrackingCreateInput>;

