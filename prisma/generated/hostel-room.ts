import { RoomType, RoomStatus } from "./enums";
import { HostelModel, HostelCreateInput } from "./hostel";
import { HostelAllocationModel, HostelAllocationCreateInput } from "./hostel-allocation";

export interface HostelRoomModel {
  id: string;
  number: string;
  type: RoomType;
  capacity: number;
  floor: number;
  status: RoomStatus;
  facilities: string[];
  hostel?: HostelModel;
  hostelId: string;
  allocations?: HostelAllocationModel[];
  createdAt: string;
  updatedAt: string;
}

export interface HostelRoomCreateInput {
  id?: string;
  number: string;
  type: RoomType;
  capacity: number;
  floor: number;
  status?: RoomStatus;
  facilities: string[];
  hostelId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HostelRoomRelationalCreateInput extends HostelRoomCreateInput {
  hostel?: HostelCreateInput;
  allocations?: HostelAllocationCreateInput | HostelAllocationCreateInput[];
}

export type HostelRoomUpdateInput = Partial<HostelRoomCreateInput>;

