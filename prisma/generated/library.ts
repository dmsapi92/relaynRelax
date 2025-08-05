import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { LibraryBookModel, LibraryBookCreateInput } from "./library-book";
import { LibraryTransactionModel, LibraryTransactionCreateInput } from "./library-transaction";

export interface LibraryModel {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  openingHours: string | null;
  rules: string | null;
  campus?: InstitutionSetupCampusModel;
  campusId: string;
  books?: LibraryBookModel[];
  transactions?: LibraryTransactionModel[];
  createdAt: string;
  updatedAt: string;
}

export interface LibraryCreateInput {
  id?: string;
  name: string;
  description?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  openingHours?: string | null;
  rules?: string | null;
  campusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LibraryRelationalCreateInput extends LibraryCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  books?: LibraryBookCreateInput | LibraryBookCreateInput[];
  transactions?: LibraryTransactionCreateInput | LibraryTransactionCreateInput[];
}

export type LibraryUpdateInput = Partial<LibraryCreateInput>;

