import { Gender } from "./enums";
import { AdmissionDocumentModel, AdmissionDocumentCreateInput } from "./admission-document";
import { AddressModel, AddressCreateInput } from "./address";
import { DynamicFormModel, DynamicFormCreateInput } from "./dynamic-form";
import { AdmissionCollegeModel, AdmissionCollegeCreateInput } from "./admission-college";

export interface AdmissionCollegeStudentModel {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  documents?: AdmissionDocumentModel[];
  gender: Gender;
  profilePicture: string | null;
  dateOfBirth: string | null;
  address?: AddressModel;
  previousSchool: string | null;
  previousGrade: string | null;
  fatherName: string | null;
  fatherPhone: string | null;
  fatherEmail: string | null;
  fatherOccupation: string | null;
  motherName: string | null;
  motherPhone: string | null;
  motherEmail: string | null;
  motherOccupation: string | null;
  yearIdAppliedFor: string | null;
  sectionIdAppliedFor: string | null;
  streamIdAppliedFor: string | null;
  subjectIdsAppliedFor: string[];
  dynamicForm?: DynamicFormModel;
  dynamicFormId: string | null;
  selectedFeeIdsStructure: string[];
  createdAt: string;
  updatedAt: string;
  Admission?: AdmissionCollegeModel[];
}

export interface AdmissionCollegeStudentCreateInput {
  id?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  gender?: Gender;
  profilePicture?: string | null;
  dateOfBirth?: string | null;
  previousSchool?: string | null;
  previousGrade?: string | null;
  fatherName?: string | null;
  fatherPhone?: string | null;
  fatherEmail?: string | null;
  fatherOccupation?: string | null;
  motherName?: string | null;
  motherPhone?: string | null;
  motherEmail?: string | null;
  motherOccupation?: string | null;
  yearIdAppliedFor?: string | null;
  sectionIdAppliedFor?: string | null;
  streamIdAppliedFor?: string | null;
  subjectIdsAppliedFor: string[];
  dynamicFormId?: string | null;
  selectedFeeIdsStructure: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionCollegeStudentRelationalCreateInput extends AdmissionCollegeStudentCreateInput {
  documents?: AdmissionDocumentCreateInput | AdmissionDocumentCreateInput[];
  address?: AddressCreateInput;
  dynamicForm?: DynamicFormCreateInput;
  Admission?: AdmissionCollegeCreateInput | AdmissionCollegeCreateInput[];
}

export type AdmissionCollegeStudentUpdateInput = Partial<AdmissionCollegeStudentCreateInput>;

