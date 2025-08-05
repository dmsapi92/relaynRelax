import { CollegeStreamType } from "./enums";
import { InstitutionSetupFeeStructureModel, InstitutionSetupFeeStructureCreateInput } from "./institution-setup-fee-structure";
import { CollegeSectionModel, CollegeSectionCreateInput } from "./college-section";
import { AcademicDetailsCollegeModel, AcademicDetailsCollegeCreateInput } from "./academic-details-college";
import { CollegeYearModel, CollegeYearCreateInput } from "./college-year";
import { CollegeSubjectTeacherStreamConfigModel, CollegeSubjectTeacherStreamConfigCreateInput } from "./college-subject-teacher-stream-config";
import { CollegeRoutineModel, CollegeRoutineCreateInput } from "./college-routine";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";
import { TransferCertificateModel, TransferCertificateCreateInput } from "./transfer-certificate";
import { BonafideCertificateModel, BonafideCertificateCreateInput } from "./bonafide-certificate";

export interface CollegeStreamModel {
  id: string;
  name: string;
  streamType: CollegeStreamType;
  streamFee?: InstitutionSetupFeeStructureModel[];
  sections?: CollegeSectionModel[];
  academicDetails?: AcademicDetailsCollegeModel[];
  year?: CollegeYearModel;
  yearId: string;
  createdAt: string;
  updatedAt: string;
  CollegeSubjectTeacherStreamConfig?: CollegeSubjectTeacherStreamConfigModel[];
  CollegeRoutine?: CollegeRoutineModel[];
  StudentAttendance?: StudentAttendanceModel[];
  TransferCertificate?: TransferCertificateModel[];
  BonafideCertificate?: BonafideCertificateModel[];
}

export interface CollegeStreamCreateInput {
  id?: string;
  name: string;
  streamType: CollegeStreamType;
  yearId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeStreamRelationalCreateInput extends CollegeStreamCreateInput {
  streamFee?: InstitutionSetupFeeStructureCreateInput | InstitutionSetupFeeStructureCreateInput[];
  sections?: CollegeSectionCreateInput | CollegeSectionCreateInput[];
  academicDetails?: AcademicDetailsCollegeCreateInput | AcademicDetailsCollegeCreateInput[];
  year?: CollegeYearCreateInput;
  CollegeSubjectTeacherStreamConfig?: CollegeSubjectTeacherStreamConfigCreateInput | CollegeSubjectTeacherStreamConfigCreateInput[];
  CollegeRoutine?: CollegeRoutineCreateInput | CollegeRoutineCreateInput[];
  StudentAttendance?: StudentAttendanceCreateInput | StudentAttendanceCreateInput[];
  TransferCertificate?: TransferCertificateCreateInput | TransferCertificateCreateInput[];
  BonafideCertificate?: BonafideCertificateCreateInput | BonafideCertificateCreateInput[];
}

export type CollegeStreamUpdateInput = Partial<CollegeStreamCreateInput>;

