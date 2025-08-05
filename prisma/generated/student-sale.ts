import { StudentSaleStatus, PaymentStatus, StudentPaymentMethod } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { StudentSaleItemModel, StudentSaleItemCreateInput } from "./student-sale-item";

export interface StudentSaleModel {
  id: string;
  student?: StudentModel;
  studentId: string;
  billNumber: string;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  items?: StudentSaleItemModel[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: StudentSaleStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: StudentPaymentMethod | null;
  paymentDate: string | null;
  notes: string | null;
  issuedBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSaleCreateInput {
  id?: string;
  studentId?: string;
  billNumber: string;
  campusId?: string | null;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status?: StudentSaleStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: StudentPaymentMethod | null;
  paymentDate?: string | null;
  notes?: string | null;
  issuedBy: string;
  approvedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentSaleRelationalCreateInput extends StudentSaleCreateInput {
  student?: StudentCreateInput;
  campus?: InstitutionSetupCampusCreateInput;
  items?: StudentSaleItemCreateInput | StudentSaleItemCreateInput[];
}

export type StudentSaleUpdateInput = Partial<StudentSaleCreateInput>;

