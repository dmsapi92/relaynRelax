import { InstitutionSetupFeeStructureModel, InstitutionSetupFeeStructureCreateInput } from "./institution-setup-fee-structure";
import { SchoolSectionModel, SchoolSectionCreateInput } from "./school-section";
import { SchoolSubjectModel, SchoolSubjectCreateInput } from "./school-subject";
import { AcademicDetailsSchoolModel, AcademicDetailsSchoolCreateInput } from "./academic-details-school";
import { SchoolModel, SchoolCreateInput } from "./school";
import { SchoolRoutineModel, SchoolRoutineCreateInput } from "./school-routine";
import { StudentAttendanceModel, StudentAttendanceCreateInput } from "./student-attendance";
import { TransferCertificateModel, TransferCertificateCreateInput } from "./transfer-certificate";
import { BonafideCertificateModel, BonafideCertificateCreateInput } from "./bonafide-certificate";

export interface SchoolClassModel {
  id: string;
  name: string;
  index: number | null;
  classFee?: InstitutionSetupFeeStructureModel[];
  sections?: SchoolSectionModel[];
  subjects?: SchoolSubjectModel[];
  academicDetails?: AcademicDetailsSchoolModel[];
  school?: SchoolModel;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  SchoolRoutine?: SchoolRoutineModel[];
  StudentAttendance?: StudentAttendanceModel[];
  TransferCertificate?: TransferCertificateModel[];
  BonafideCertificate?: BonafideCertificateModel[];
}

export interface SchoolClassCreateInput {
  id?: string;
  name: string;
  index?: number | null;
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolClassRelationalCreateInput extends SchoolClassCreateInput {
  classFee?: InstitutionSetupFeeStructureCreateInput | InstitutionSetupFeeStructureCreateInput[];
  sections?: SchoolSectionCreateInput | SchoolSectionCreateInput[];
  subjects?: SchoolSubjectCreateInput | SchoolSubjectCreateInput[];
  academicDetails?: AcademicDetailsSchoolCreateInput | AcademicDetailsSchoolCreateInput[];
  school?: SchoolCreateInput;
  SchoolRoutine?: SchoolRoutineCreateInput | SchoolRoutineCreateInput[];
  StudentAttendance?: StudentAttendanceCreateInput | StudentAttendanceCreateInput[];
  TransferCertificate?: TransferCertificateCreateInput | TransferCertificateCreateInput[];
  BonafideCertificate?: BonafideCertificateCreateInput | BonafideCertificateCreateInput[];
}

export type SchoolClassUpdateInput = Partial<SchoolClassCreateInput>;

