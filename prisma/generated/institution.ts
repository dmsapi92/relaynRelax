import { BoardType, InstitutionStatus, InstitutionType } from "./enums";
import { AddressModel, AddressCreateInput } from "./address";
import { InstitutionAdminModel, InstitutionAdminCreateInput } from "./institution-admin";
import { AccreditationModel, AccreditationCreateInput } from "./accreditation";
import { PrincipalInfoModel, PrincipalInfoCreateInput } from "./principal-info";
import { AffiliationModel, AffiliationCreateInput } from "./affiliation";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { SocialMediaModel, SocialMediaCreateInput } from "./social-media";
import { SettingsModel, SettingsCreateInput } from "./settings";
import { WebsiteContentModel, WebsiteContentCreateInput } from "./website-content";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";

export interface InstitutionModel {
  id: string;
  name: string;
  shortName: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  isInitialInstitution: boolean;
  address?: AddressModel;
  boardType: BoardType | null;
  establishmentYear: number | null;
  website: string | null;
  registrationNumber: string | null;
  slogan: string | null;
  description: string | null;
  logo: string | null;
  admins?: InstitutionAdminModel;
  accreditations?: AccreditationModel[];
  principalInfo?: PrincipalInfoModel;
  vision: string | null;
  mission: string | null;
  planId: number;
  status: InstitutionStatus;
  affiliations?: AffiliationModel[];
  sessions?: AcademicSessionModel[];
  socialMedia?: SocialMediaModel;
  settings?: SettingsModel;
  isVerified: boolean;
  lastLoginAt: string | null;
  loginAttempts: number;
  lockUntil: string | null;
  websiteContent?: WebsiteContentModel;
  selectedSession?: AcademicSessionModel;
  selectedSessionId: string | null;
  selectedCampus?: InstitutionSetupCampusModel;
  selectedCampusId: string | null;
  InstitutionType: InstitutionType;
  createdAt: string;
  updatedAt: string;
  razorpaySubscriptionIds: string[];
  institutionAdminId: string;
  InstitutionSetupCampus?: InstitutionSetupCampusModel[];
}

export interface InstitutionCreateInput {
  id?: string;
  name: string;
  shortName?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone: string;
  isInitialInstitution?: boolean;
  boardType?: BoardType | null;
  establishmentYear?: number | null;
  website?: string | null;
  registrationNumber?: string | null;
  slogan?: string | null;
  description?: string | null;
  logo?: string | null;
  vision?: string | null;
  mission?: string | null;
  planId: number;
  status?: InstitutionStatus;
  isVerified?: boolean;
  lastLoginAt?: string | null;
  loginAttempts?: number;
  lockUntil?: string | null;
  selectedSessionId?: string | null;
  selectedCampusId?: string | null;
  InstitutionType?: InstitutionType;
  createdAt?: string;
  updatedAt?: string;
  razorpaySubscriptionIds: string[];
  institutionAdminId?: string;
}

export interface InstitutionRelationalCreateInput extends InstitutionCreateInput {
  address?: AddressCreateInput;
  admins?: InstitutionAdminCreateInput;
  accreditations?: AccreditationCreateInput | AccreditationCreateInput[];
  principalInfo?: PrincipalInfoCreateInput;
  affiliations?: AffiliationCreateInput | AffiliationCreateInput[];
  sessions?: AcademicSessionCreateInput | AcademicSessionCreateInput[];
  socialMedia?: SocialMediaCreateInput;
  settings?: SettingsCreateInput;
  websiteContent?: WebsiteContentCreateInput;
  selectedSession?: AcademicSessionCreateInput;
  selectedCampus?: InstitutionSetupCampusCreateInput;
  InstitutionSetupCampus?: InstitutionSetupCampusCreateInput | InstitutionSetupCampusCreateInput[];
}

export type InstitutionUpdateInput = Partial<InstitutionCreateInput>;

