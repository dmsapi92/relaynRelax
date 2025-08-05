import { InvoiceStatus, CampusType } from "./enums";
import { FeeItemModel, FeeItemCreateInput } from "./fee-item";
import { FeeTransactionModel, FeeTransactionCreateInput } from "./fee-transaction";
import { AcademicSessionModel, AcademicSessionCreateInput } from "./academic-session";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { StudentModel, StudentCreateInput } from "./student";

export interface FeeInvoiceModel {
  id: string;
  status: InvoiceStatus;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  notes: string | null;
  lateFee: number | null;
  concessionAmount: number | null;
  scholarshipAmount: number | null;
  discountAmount: number | null;
  createdAt: string;
  updatedAt: string;
  feeItems?: FeeItemModel[];
  selectedMonths: string[];
  transactions?: FeeTransactionModel[];
  academicSession?: AcademicSessionModel;
  academicSessionId: string | null;
  campusType: CampusType;
  campus?: InstitutionSetupCampusModel;
  campusId: string | null;
  Student?: StudentModel;
  studentId: string | null;
}

export interface FeeInvoiceCreateInput {
  id?: string;
  status?: InvoiceStatus;
  invoiceNumber: string;
  invoiceDate?: string;
  dueDate?: string | null;
  notes?: string | null;
  lateFee?: number | null;
  concessionAmount?: number | null;
  scholarshipAmount?: number | null;
  discountAmount?: number | null;
  createdAt?: string;
  updatedAt?: string;
  selectedMonths: string[];
  academicSessionId?: string | null;
  campusType?: CampusType;
  campusId?: string | null;
  studentId?: string | null;
}

export interface FeeInvoiceRelationalCreateInput extends FeeInvoiceCreateInput {
  feeItems?: FeeItemCreateInput | FeeItemCreateInput[];
  transactions?: FeeTransactionCreateInput | FeeTransactionCreateInput[];
  academicSession?: AcademicSessionCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  Student?: StudentCreateInput;
}

export type FeeInvoiceUpdateInput = Partial<FeeInvoiceCreateInput>;

