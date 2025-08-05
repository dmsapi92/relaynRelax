export interface EntryCardModel {
  id: string;
  DocType: string;
  CardNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryCardCreateInput {
  id?: string;
  DocType: string;
  CardNo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EntryCardRelationalCreateInput extends EntryCardCreateInput {
  
}

export type EntryCardUpdateInput = Partial<EntryCardCreateInput>;

