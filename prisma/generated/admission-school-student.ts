import { Gender } from "./enums";
import { AdmissionDocumentModel, AdmissionDocumentCreateInput } from "./admission-document";
import { AddressModel, AddressCreateInput } from "./address";
import { DynamicFormModel, DynamicFormCreateInput } from "./dynamic-form";
import { AdmissionSchoolModel, AdmissionSchoolCreateInput } from "./admission-school";

export interface AdmissionSchoolStudentModel {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  profilePicture: string | null;
  documents?: AdmissionDocumentModel[];
  gender: Gender;
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
  classIdAppliedFor: string | null;
  sectionIdAppliedFor: string | null;
  subjectIdsAppliedFor: string[];
  selectedFeeIdsStructure: string[];
  dynamicForm?: DynamicFormModel;
  dynamicFormId: string | null;
  createdAt: string;
  updatedAt: string;
  Admission?: AdmissionSchoolModel[];
}

export interface AdmissionSchoolStudentCreateInput {
  id?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  profilePicture?: string | null;
  gender?: Gender;
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
  classIdAppliedFor?: string | null;
  sectionIdAppliedFor?: string | null;
  subjectIdsAppliedFor: string[];
  selectedFeeIdsStructure: string[];
  dynamicFormId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionSchoolStudentRelationalCreateInput extends AdmissionSchoolStudentCreateInput {
  documents?: AdmissionDocumentCreateInput | AdmissionDocumentCreateInput[];
  address?: AddressCreateInput;
  dynamicForm?: DynamicFormCreateInput;
  Admission?: AdmissionSchoolCreateInput | AdmissionSchoolCreateInput[];
}

export type AdmissionSchoolStudentUpdateInput = Partial<AdmissionSchoolStudentCreateInput>;

