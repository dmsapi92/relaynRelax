import { InternationalProgramModel, InternationalProgramCreateInput } from "./international-program";
import { PartnershipModel, PartnershipCreateInput } from "./partnership";
import { ExchangeProgramModel, ExchangeProgramCreateInput } from "./exchange-program";
import { WebsiteContentModel, WebsiteContentCreateInput } from "./website-content";

export interface InternationalSectionModel {
  id: string;
  programs?: InternationalProgramModel[];
  partnerships?: PartnershipModel[];
  exchangePrograms?: ExchangeProgramModel[];
  createdAt: string;
  updatedAt: string;
  WebsiteContent?: WebsiteContentModel[];
  websiteContentId: string | null;
}

export interface InternationalSectionCreateInput {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  websiteContentId?: string | null;
}

export interface InternationalSectionRelationalCreateInput extends InternationalSectionCreateInput {
  programs?: InternationalProgramCreateInput | InternationalProgramCreateInput[];
  partnerships?: PartnershipCreateInput | PartnershipCreateInput[];
  exchangePrograms?: ExchangeProgramCreateInput | ExchangeProgramCreateInput[];
  WebsiteContent?: WebsiteContentCreateInput | WebsiteContentCreateInput[];
}

export type InternationalSectionUpdateInput = Partial<InternationalSectionCreateInput>;

