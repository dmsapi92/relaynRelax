import { RouteStopModel, RouteStopCreateInput } from "./route-stop";
import { VehicleModel, VehicleCreateInput } from "./vehicle";
import { TransportModel, TransportCreateInput } from "./transport";

export interface TransportRouteModel {
  id: string;
  name: string;
  stops?: RouteStopModel[];
  vehicle?: VehicleModel;
  vehicleId: string;
  transport?: TransportModel;
  transportId: string;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransportRouteCreateInput {
  id?: string;
  name: string;
  vehicleId?: string;
  transportId?: string;
  students: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TransportRouteRelationalCreateInput extends TransportRouteCreateInput {
  stops?: RouteStopCreateInput | RouteStopCreateInput[];
  vehicle?: VehicleCreateInput;
  transport?: TransportCreateInput;
}

export type TransportRouteUpdateInput = Partial<TransportRouteCreateInput>;

