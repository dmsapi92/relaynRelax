import { BookingStatus } from "./enums";
import { ResourceModel, ResourceCreateInput } from "./resource";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface ResourceBookingModel {
  id: string;
  resource?: ResourceModel;
  resourceId: string;
  userId: string;
  purpose: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceBookingCreateInput {
  id?: string;
  resourceId?: string;
  userId: string;
  purpose: string;
  startTime: string;
  endTime: string;
  status?: BookingStatus;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourceBookingRelationalCreateInput extends ResourceBookingCreateInput {
  resource?: ResourceCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
}

export type ResourceBookingUpdateInput = Partial<ResourceBookingCreateInput>;

