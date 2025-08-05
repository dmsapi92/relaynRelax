import { UserType, EventParticipationType, CertificateSystemStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { SignatoryModel, SignatoryCreateInput } from "./signatory";

export interface ParticipationCertificateModel {
  id: string;
  certificateNo: string;
  issuedTo: string;
  issuedToType: UserType;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  eventName: string;
  eventType: EventParticipationType;
  eventDate: string;
  eventDuration: string | null;
  role: string | null;
  achievement: string | null;
  signatories?: SignatoryModel[];
  status: CertificateSystemStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipationCertificateCreateInput {
  id?: string;
  certificateNo: string;
  issuedTo: string;
  issuedToType: UserType;
  campusId?: string;
  eventName: string;
  eventType: EventParticipationType;
  eventDate: string;
  eventDuration?: string | null;
  role?: string | null;
  achievement?: string | null;
  status?: CertificateSystemStatus;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParticipationCertificateRelationalCreateInput extends ParticipationCertificateCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  signatories?: SignatoryCreateInput | SignatoryCreateInput[];
}

export type ParticipationCertificateUpdateInput = Partial<ParticipationCertificateCreateInput>;

