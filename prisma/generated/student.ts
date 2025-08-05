import { CampusType, AdmissionType } from "./enums";
import { UserModel, UserCreateInput } from "./user";
import { StudentPreviousSchoolModel, StudentPreviousSchoolCreateInput } from "./student-previous-school";
import { StudentPreviousCollegeModel, StudentPreviousCollegeCreateInput } from "./student-previous-college";
import { AcademicDetailsSchoolModel, AcademicDetailsSchoolCreateInput } from "./academic-details-school";
import { AcademicDetailsCollegeModel, AcademicDetailsCollegeCreateInput } from "./academic-details-college";
import { ParentInfoModel, ParentInfoCreateInput } from "./parent-info";
import { InstitutionSetupFeeStructureModel, InstitutionSetupFeeStructureCreateInput } from "./institution-setup-fee-structure";
import { FamilyRelationModel, FamilyRelationCreateInput } from "./family-relation";
import { StudentAcademicPerformanceModel, StudentAcademicPerformanceCreateInput } from "./student-academic-performance";
import { DynamicFormModel, DynamicFormCreateInput } from "./dynamic-form";
import { StudentSaleModel, StudentSaleCreateInput } from "./student-sale";
import { StudentCartItemModel, StudentCartItemCreateInput } from "./student-cart-item";
import { FeeInvoiceModel, FeeInvoiceCreateInput } from "./fee-invoice";
import { ExamResultModel, ExamResultCreateInput } from "./exam-result";
import { AdmitCardModel, AdmitCardCreateInput } from "./admit-card";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";
import { TransferCertificateModel, TransferCertificateCreateInput } from "./transfer-certificate";
import { CharacterCertificateModel, CharacterCertificateCreateInput } from "./character-certificate";
import { BonafideCertificateModel, BonafideCertificateCreateInput } from "./bonafide-certificate";
import { CourseCompletionCertificateModel, CourseCompletionCertificateCreateInput } from "./course-completion-certificate";
import { MeritCertificateModel, MeritCertificateCreateInput } from "./merit-certificate";
import { ProvisionalCertificateModel, ProvisionalCertificateCreateInput } from "./provisional-certificate";
import { InternshipCertificateModel, InternshipCertificateCreateInput } from "./internship-certificate";

export interface StudentModel {
  id: string;
  user?: UserModel;
  userId: string;
  campusType: CampusType;
  roleNumber: string | null;
  admissionType: AdmissionType;
  previousSchools: string[];
  previousSchoolDetails?: StudentPreviousSchoolModel[];
  previousColleges: string[];
  previousCollegeDetails?: StudentPreviousCollegeModel[];
  currentSchoolAcademicDetails?: AcademicDetailsSchoolModel;
  currentSchoolAcademicDetailsId: string | null;
  currentCollegeAcademicDetails?: AcademicDetailsCollegeModel;
  currentCollegeAcademicDetailsId: string | null;
  parent?: ParentInfoModel;
  parentInfoId: string | null;
  selectedFees?: InstitutionSetupFeeStructureModel[];
  selectedFeeIds: string[];
  siblings?: FamilyRelationModel[];
  siblingOf?: FamilyRelationModel[];
  academicPerformance?: StudentAcademicPerformanceModel[];
  dynamicForm?: DynamicFormModel;
  dynamicFormId: string | null;
  createdAt: string;
  updatedAt: string;
  sales?: StudentSaleModel[];
  cart?: StudentCartItemModel[];
  feeInvoices?: FeeInvoiceModel[];
  ExamResult?: ExamResultModel[];
  AdmitCard?: AdmitCardModel[];
  StudentAttendance?: StudentAttendanceModel[];
  TransferCertificate?: TransferCertificateModel[];
  CharacterCertificate?: CharacterCertificateModel[];
  BonafideCertificate?: BonafideCertificateModel[];
  CourseCompletionCertificate?: CourseCompletionCertificateModel[];
  MeritCertificate?: MeritCertificateModel[];
  ProvisionalCertificate?: ProvisionalCertificateModel[];
  InternshipCertificate?: InternshipCertificateModel[];
}

export interface StudentCreateInput {
  id?: string;
  userId?: string;
  campusType?: CampusType;
  roleNumber?: string | null;
  admissionType?: AdmissionType;
  previousSchools: string[];
  previousColleges: string[];
  currentSchoolAcademicDetailsId?: string | null;
  currentCollegeAcademicDetailsId?: string | null;
  parentInfoId?: string | null;
  selectedFeeIds?: string[];
  dynamicFormId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentRelationalCreateInput extends StudentCreateInput {
  user?: UserCreateInput;
  previousSchoolDetails?: StudentPreviousSchoolCreateInput | StudentPreviousSchoolCreateInput[];
  previousCollegeDetails?: StudentPreviousCollegeCreateInput | StudentPreviousCollegeCreateInput[];
  currentSchoolAcademicDetails?: AcademicDetailsSchoolCreateInput;
  currentCollegeAcademicDetails?: AcademicDetailsCollegeCreateInput;
  parent?: ParentInfoCreateInput;
  selectedFees?: InstitutionSetupFeeStructureCreateInput | InstitutionSetupFeeStructureCreateInput[];
  siblings?: FamilyRelationCreateInput | FamilyRelationCreateInput[];
  siblingOf?: FamilyRelationCreateInput | FamilyRelationCreateInput[];
  academicPerformance?: StudentAcademicPerformanceCreateInput | StudentAcademicPerformanceCreateInput[];
  dynamicForm?: DynamicFormCreateInput;
  sales?: StudentSaleCreateInput | StudentSaleCreateInput[];
  cart?: StudentCartItemCreateInput | StudentCartItemCreateInput[];
  feeInvoices?: FeeInvoiceCreateInput | FeeInvoiceCreateInput[];
  ExamResult?: ExamResultCreateInput | ExamResultCreateInput[];
  AdmitCard?: AdmitCardCreateInput | AdmitCardCreateInput[];
  StudentAttendance?: StudentAttendanceCreateInput | StudentAttendanceCreateInput[];
  TransferCertificate?: TransferCertificateCreateInput | TransferCertificateCreateInput[];
  CharacterCertificate?: CharacterCertificateCreateInput | CharacterCertificateCreateInput[];
  BonafideCertificate?: BonafideCertificateCreateInput | BonafideCertificateCreateInput[];
  CourseCompletionCertificate?: CourseCompletionCertificateCreateInput | CourseCompletionCertificateCreateInput[];
  MeritCertificate?: MeritCertificateCreateInput | MeritCertificateCreateInput[];
  ProvisionalCertificate?: ProvisionalCertificateCreateInput | ProvisionalCertificateCreateInput[];
  InternshipCertificate?: InternshipCertificateCreateInput | InternshipCertificateCreateInput[];
}

export type StudentUpdateInput = Partial<StudentCreateInput>;

