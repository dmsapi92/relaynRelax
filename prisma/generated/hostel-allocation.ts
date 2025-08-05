import { AllocationStatus } from "./enums";
import { HostelRoomModel, HostelRoomCreateInput } from "./hostel-room";
import { HostelModel, HostelCreateInput } from "./hostel";

export interface HostelAllocationModel {
  id: string;
  student: string;
  room?: HostelRoomModel;
  roomId: string;
  hostel?: HostelModel;
  hostelId: string;
  startDate: string;
  endDate: string | null;
  status: AllocationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HostelAllocationCreateInput {
  id?: string;
  student: string;
  roomId?: string;
  hostelId?: string;
  startDate: string;
  endDate?: string | null;
  status?: AllocationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface HostelAllocationRelationalCreateInput extends HostelAllocationCreateInput {
  room?: HostelRoomCreateInput;
  hostel?: HostelCreateInput;
}

export type HostelAllocationUpdateInput = Partial<HostelAllocationCreateInput>;

