import { AdmissionSchoolStudentModel, AdmissionSchoolStudentCreateInput } from "./admission-school-student";
import { AdmissionCollegeStudentModel, AdmissionCollegeStudentCreateInput } from "./admission-college-student";

export interface AdmissionDocumentModel {
  id: string;
  admissionId: string;
  documentType: string;
  documentUrl: string;
  uploadedAt: string;
  verified: boolean;
  AdmissionSchoolStudent?: AdmissionSchoolStudentModel;
  admissionSchoolStudentId: string | null;
  AdmissionCollegeStudent?: AdmissionCollegeStudentModel;
  admissionCollegeStudentId: string | null;
}

export interface AdmissionDocumentCreateInput {
  id?: string;
  admissionId: string;
  documentType: string;
  documentUrl: string;
  uploadedAt?: string;
  verified?: boolean;
  admissionSchoolStudentId?: string | null;
  admissionCollegeStudentId?: string | null;
}

export interface AdmissionDocumentRelationalCreateInput extends AdmissionDocumentCreateInput {
  AdmissionSchoolStudent?: AdmissionSchoolStudentCreateInput;
  AdmissionCollegeStudent?: AdmissionCollegeStudentCreateInput;
}

export type AdmissionDocumentUpdateInput = Partial<AdmissionDocumentCreateInput>;

