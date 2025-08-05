export interface SalaryPaymentModel {
  id: string;
  employeeId: string;
  paymentDate: string;
  netAmount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPaymentCreateInput {
  id?: string;
  employeeId: string;
  paymentDate: string;
  netAmount: number;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryPaymentRelationalCreateInput extends SalaryPaymentCreateInput {
  
}

export type SalaryPaymentUpdateInput = Partial<SalaryPaymentCreateInput>;

