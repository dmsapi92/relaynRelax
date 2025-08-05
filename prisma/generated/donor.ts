import { DonorType } from "./enums";
import { AddressModel, AddressCreateInput } from "./address";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { DonationModel, DonationCreateInput } from "./donation";
import { ScholarshipModel, ScholarshipCreateInput } from "./scholarship";

export interface DonorModel {
  id: string;
  name: string;
  type: DonorType;
  email: string | null;
  phone: string | null;
  address?: AddressModel;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  donations?: DonationModel[];
  scholarships?: ScholarshipModel[];
  createdAt: string;
  updatedAt: string;
}

export interface DonorCreateInput {
  id?: string;
  name: string;
  type: DonorType;
  email?: string | null;
  phone?: string | null;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DonorRelationalCreateInput extends DonorCreateInput {
  address?: AddressCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  donations?: DonationCreateInput | DonationCreateInput[];
  scholarships?: ScholarshipCreateInput | ScholarshipCreateInput[];
}

export type DonorUpdateInput = Partial<DonorCreateInput>;

