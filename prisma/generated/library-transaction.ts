import { LibraryTransactionStatus, BookCondition, FineStatus } from "./enums";
import { LibraryBookModel, LibraryBookCreateInput } from "./library-book";
import { LibraryModel, LibraryCreateInput } from "./library";
import { RenewalHistoryModel, RenewalHistoryCreateInput } from "./renewal-history";

export interface LibraryTransactionModel {
  id: string;
  books?: LibraryBookModel[];
  booksId: string[];
  library?: LibraryModel;
  libraryId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LibraryTransactionStatus;
  fine: number | null;
  remarks: string | null;
  returnCondition: BookCondition | null;
  renewalCount: number;
  renewalHistory?: RenewalHistoryModel[];
  fineStatus: FineStatus;
  finePaidAmount: number | null;
  finePaidDate: string | null;
  issuedBy: string;
  returnedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryTransactionCreateInput {
  id?: string;
  booksId: string[];
  libraryId?: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  status?: LibraryTransactionStatus;
  fine?: number | null;
  remarks?: string | null;
  returnCondition?: BookCondition | null;
  renewalCount?: number;
  fineStatus?: FineStatus;
  finePaidAmount?: number | null;
  finePaidDate?: string | null;
  issuedBy: string;
  returnedTo?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LibraryTransactionRelationalCreateInput extends LibraryTransactionCreateInput {
  books?: LibraryBookCreateInput | LibraryBookCreateInput[];
  library?: LibraryCreateInput;
  renewalHistory?: RenewalHistoryCreateInput | RenewalHistoryCreateInput[];
}

export type LibraryTransactionUpdateInput = Partial<LibraryTransactionCreateInput>;

