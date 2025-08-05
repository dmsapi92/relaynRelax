import { LibraryTransactionModel, LibraryTransactionCreateInput } from "./library-transaction";

export interface RenewalHistoryModel {
  id: string;
  transaction?: LibraryTransactionModel;
  transactionId: string;
  previousDueDate: string;
  newDueDate: string;
  renewedBy: string;
  renewedAt: string;
  remarks: string | null;
}

export interface RenewalHistoryCreateInput {
  id?: string;
  transactionId?: string;
  previousDueDate: string;
  newDueDate: string;
  renewedBy: string;
  renewedAt?: string;
  remarks?: string | null;
}

export interface RenewalHistoryRelationalCreateInput extends RenewalHistoryCreateInput {
  transaction?: LibraryTransactionCreateInput;
}

export type RenewalHistoryUpdateInput = Partial<RenewalHistoryCreateInput>;

