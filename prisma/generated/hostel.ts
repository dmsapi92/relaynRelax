import { HostelType } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { HostelRoomModel, HostelRoomCreateInput } from "./hostel-room";
import { HostelAllocationModel, HostelAllocationCreateInput } from "./hostel-allocation";

export interface HostelModel {
  id: string;
  name: string;
  type: HostelType;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  capacity: number;
  warden: string;
  rooms?: HostelRoomModel[];
  allocations?: HostelAllocationModel[];
  createdAt: string;
  updatedAt: string;
}

export interface HostelCreateInput {
  id?: string;
  name: string;
  type: HostelType;
  campusId?: string;
  capacity: number;
  warden: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HostelRelationalCreateInput extends HostelCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  rooms?: HostelRoomCreateInput | HostelRoomCreateInput[];
  allocations?: HostelAllocationCreateInput | HostelAllocationCreateInput[];
}

export type HostelUpdateInput = Partial<HostelCreateInput>;

