import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { VehicleModel, VehicleCreateInput } from "./vehicle";
import { TransportRouteModel, TransportRouteCreateInput } from "./transport-route";

export interface TransportModel {
  id: string;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  vehicles?: VehicleModel[];
  routes?: TransportRouteModel[];
  createdAt: string;
  updatedAt: string;
}

export interface TransportCreateInput {
  id?: string;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransportRelationalCreateInput extends TransportCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  vehicles?: VehicleCreateInput | VehicleCreateInput[];
  routes?: TransportRouteCreateInput | TransportRouteCreateInput[];
}

export type TransportUpdateInput = Partial<TransportCreateInput>;

