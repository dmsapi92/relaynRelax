import { ResourceType, ResourceStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { ResourceBookingModel, ResourceBookingCreateInput } from "./resource-booking";

export interface ResourceModel {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number | null;
  location: string;
  description: string | null;
  status: ResourceStatus;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  bookings?: ResourceBookingModel[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceCreateInput {
  id?: string;
  name: string;
  type: ResourceType;
  capacity?: number | null;
  location: string;
  description?: string | null;
  status?: ResourceStatus;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourceRelationalCreateInput extends ResourceCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  bookings?: ResourceBookingCreateInput | ResourceBookingCreateInput[];
}

export type ResourceUpdateInput = Partial<ResourceCreateInput>;

