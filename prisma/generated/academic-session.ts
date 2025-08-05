import { SessionStatus } from "./enums";
import { InstitutionModel, InstitutionCreateInput } from "./institution";
import { UserModel, UserCreateInput } from "./user";
import { FeeInvoiceModel, FeeInvoiceCreateInput } from "./fee-invoice";
import { ExaminationModel, ExaminationCreateInput } from "./examination";
import { SchoolRoutineModel, SchoolRoutineCreateInput } from "./school-routine";
import { CollegeRoutineModel, CollegeRoutineCreateInput } from "./college-routine";
import { CalendarModel, CalendarCreateInput } from "./calendar";
import { DailyAttendanceRecordModel, DailyAttendanceRecordCreateInput } from "./daily-attendance-record";
import { CertificateSystemModel, CertificateSystemCreateInput } from "./certificate-system";
import { TransferCertificateModel, TransferCertificateCreateInput } from "./transfer-certificate";
import { CharacterCertificateModel, CharacterCertificateCreateInput } from "./character-certificate";
import { BonafideCertificateModel, BonafideCertificateCreateInput } from "./bonafide-certificate";
import { MeritCertificateModel, MeritCertificateCreateInput } from "./merit-certificate";
import { ProvisionalCertificateModel, ProvisionalCertificateCreateInput } from "./provisional-certificate";
import { StudentPreviousSchoolModel, StudentPreviousSchoolCreateInput } from "./student-previous-school";

export interface AcademicSessionModel {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SessionStatus;
  institution?: InstitutionModel;
  institutionId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  User?: UserModel[];
  selectedByInstitutions?: InstitutionModel[];
  FeeInvoice?: FeeInvoiceModel[];
  Examination?: ExaminationModel[];
  SchoolRoutine?: SchoolRoutineModel[];
  CollegeRoutine?: CollegeRoutineModel[];
  Calendar?: CalendarModel[];
  DailyAttendanceRecord?: DailyAttendanceRecordModel[];
  CertificateSystem?: CertificateSystemModel[];
  TransferCertificate?: TransferCertificateModel[];
  CharacterCertificate?: CharacterCertificateModel[];
  BonafideCertificate?: BonafideCertificateModel[];
  MeritCertificate?: MeritCertificateModel[];
  ProvisionalCertificate?: ProvisionalCertificateModel[];
  StudentPreviousSchool?: StudentPreviousSchoolModel[];
}

export interface AcademicSessionCreateInput {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SessionStatus;
  institutionId?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicSessionRelationalCreateInput extends AcademicSessionCreateInput {
  institution?: InstitutionCreateInput;
  User?: UserCreateInput | UserCreateInput[];
  selectedByInstitutions?: InstitutionCreateInput | InstitutionCreateInput[];
  FeeInvoice?: FeeInvoiceCreateInput | FeeInvoiceCreateInput[];
  Examination?: ExaminationCreateInput | ExaminationCreateInput[];
  SchoolRoutine?: SchoolRoutineCreateInput | SchoolRoutineCreateInput[];
  CollegeRoutine?: CollegeRoutineCreateInput | CollegeRoutineCreateInput[];
  Calendar?: CalendarCreateInput | CalendarCreateInput[];
  DailyAttendanceRecord?: DailyAttendanceRecordCreateInput | DailyAttendanceRecordCreateInput[];
  CertificateSystem?: CertificateSystemCreateInput | CertificateSystemCreateInput[];
  TransferCertificate?: TransferCertificateCreateInput | TransferCertificateCreateInput[];
  CharacterCertificate?: CharacterCertificateCreateInput | CharacterCertificateCreateInput[];
  BonafideCertificate?: BonafideCertificateCreateInput | BonafideCertificateCreateInput[];
  MeritCertificate?: MeritCertificateCreateInput | MeritCertificateCreateInput[];
  ProvisionalCertificate?: ProvisionalCertificateCreateInput | ProvisionalCertificateCreateInput[];
  StudentPreviousSchool?: StudentPreviousSchoolCreateInput | StudentPreviousSchoolCreateInput[];
}

export type AcademicSessionUpdateInput = Partial<AcademicSessionCreateInput>;

