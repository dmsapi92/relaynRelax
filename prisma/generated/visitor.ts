import { VisitorStatus } from "./enums";
import { VisitorDetailsModel, VisitorDetailsCreateInput } from "./visitor-details";
import { VisitInfoModel, VisitInfoCreateInput } from "./visit-info";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { VisitCheckpointModel, VisitCheckpointCreateInput } from "./visit-checkpoint";

export interface VisitorModel {
  id: string;
  visitorPass: string;
  details?: VisitorDetailsModel;
  visit?: VisitInfoModel;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  status: VisitorStatus;
  checkpoints?: VisitCheckpointModel[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorCreateInput {
  id?: string;
  visitorPass: string;
  campusId?: string;
  status?: VisitorStatus;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisitorRelationalCreateInput extends VisitorCreateInput {
  details?: VisitorDetailsCreateInput;
  visit?: VisitInfoCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  checkpoints?: VisitCheckpointCreateInput | VisitCheckpointCreateInput[];
}

export type VisitorUpdateInput = Partial<VisitorCreateInput>;

