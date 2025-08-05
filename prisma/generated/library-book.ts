import { BookStatus } from "./enums";
import { LibraryModel, LibraryCreateInput } from "./library";
import { LibraryTransactionModel, LibraryTransactionCreateInput } from "./library-transaction";

export interface LibraryBookModel {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  edition: string | null;
  category: string;
  description: string | null;
  location: string;
  status: BookStatus;
  totalCopies: number;
  availableCopies: number;
  library?: LibraryModel;
  libraryId: string;
  createdAt: string;
  updatedAt: string;
  LibraryTransaction?: LibraryTransactionModel;
  libraryTransactionId: string | null;
}

export interface LibraryBookCreateInput {
  id?: string;
  title: string;
  author: string;
  isbn?: string | null;
  publisher?: string | null;
  edition?: string | null;
  category: string;
  description?: string | null;
  location: string;
  status?: BookStatus;
  totalCopies: number;
  availableCopies: number;
  libraryId?: string;
  createdAt?: string;
  updatedAt?: string;
  libraryTransactionId?: string | null;
}

export interface LibraryBookRelationalCreateInput extends LibraryBookCreateInput {
  library?: LibraryCreateInput;
  LibraryTransaction?: LibraryTransactionCreateInput;
}

export type LibraryBookUpdateInput = Partial<LibraryBookCreateInput>;

