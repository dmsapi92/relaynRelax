import { InstitutionModel, InstitutionCreateInput } from "./institution";
import { FacilitiesSectionModel, FacilitiesSectionCreateInput } from "./facilities-section";
import { CampusInfoModel, CampusInfoCreateInput } from "./campus-info";
import { HeroSectionModel, HeroSectionCreateInput } from "./hero-section";
import { AboutSectionModel, AboutSectionCreateInput } from "./about-section";
import { ProgramsSectionModel, ProgramsSectionCreateInput } from "./programs-section";
import { AdmissionsSectionModel, AdmissionsSectionCreateInput } from "./admissions-section";
import { EventsSectionModel, EventsSectionCreateInput } from "./events-section";
import { TestimonialsSectionModel, TestimonialsSectionCreateInput } from "./testimonials-section";
import { PoliciesSectionModel, PoliciesSectionCreateInput } from "./policies-section";
import { CareersSectionModel, CareersSectionCreateInput } from "./careers-section";
import { AchievementsSectionModel, AchievementsSectionCreateInput } from "./achievements-section";
import { WebsiteNoticesSectionModel, WebsiteNoticesSectionCreateInput } from "./website-notices-section";
import { SocialSectionModel, SocialSectionCreateInput } from "./social-section";
import { InternationalSectionModel, InternationalSectionCreateInput } from "./international-section";

export interface WebsiteContentModel {
  id: string;
  institution?: InstitutionModel;
  institutionId: string | null;
  facilitiesSection?: FacilitiesSectionModel;
  campusInfo?: CampusInfoModel;
  heroSection?: HeroSectionModel;
  aboutSection?: AboutSectionModel;
  programsSection?: ProgramsSectionModel;
  admissionsSection?: AdmissionsSectionModel;
  eventsSection?: EventsSectionModel;
  testimonialsSection?: TestimonialsSectionModel;
  policiesSection?: PoliciesSectionModel;
  careersSection?: CareersSectionModel;
  achievementsSection?: AchievementsSectionModel;
  noticesSection?: WebsiteNoticesSectionModel;
  socialSection?: SocialSectionModel;
  internationalSection?: InternationalSectionModel;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteContentCreateInput {
  id?: string;
  institutionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebsiteContentRelationalCreateInput extends WebsiteContentCreateInput {
  institution?: InstitutionCreateInput;
  facilitiesSection?: FacilitiesSectionCreateInput;
  campusInfo?: CampusInfoCreateInput;
  heroSection?: HeroSectionCreateInput;
  aboutSection?: AboutSectionCreateInput;
  programsSection?: ProgramsSectionCreateInput;
  admissionsSection?: AdmissionsSectionCreateInput;
  eventsSection?: EventsSectionCreateInput;
  testimonialsSection?: TestimonialsSectionCreateInput;
  policiesSection?: PoliciesSectionCreateInput;
  careersSection?: CareersSectionCreateInput;
  achievementsSection?: AchievementsSectionCreateInput;
  noticesSection?: WebsiteNoticesSectionCreateInput;
  socialSection?: SocialSectionCreateInput;
  internationalSection?: InternationalSectionCreateInput;
}

export type WebsiteContentUpdateInput = Partial<WebsiteContentCreateInput>;

