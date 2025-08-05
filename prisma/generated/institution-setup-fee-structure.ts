import { FeeType } from "./enums";
import { StudentModel, StudentCreateInput } from "./student";
import { SchoolClassModel, SchoolClassCreateInput } from "./school-class";
import { CollegeStreamModel, CollegeStreamCreateInput } from "./college-stream";

export interface InstitutionSetupFeeStructureModel {
  id: string;
  name: string;
  feeType: FeeType;
  dueDate: string | null;
  isCompulsory: boolean;
  amount: number;
  students?: StudentModel[];
  studentIds: string[];
  schoolClass?: SchoolClassModel;
  schoolClassId: string | null;
  collegeStream?: CollegeStreamModel;
  collegeStreamId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface InstitutionSetupFeeStructureCreateInput {
  id?: string;
  name: string;
  feeType: FeeType;
  dueDate?: string | null;
  isCompulsory?: boolean;
  amount: number;
  studentIds?: string[];
  schoolClassId?: string | null;
  collegeStreamId?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface InstitutionSetupFeeStructureRelationalCreateInput extends InstitutionSetupFeeStructureCreateInput {
  students?: StudentCreateInput | StudentCreateInput[];
  schoolClass?: SchoolClassCreateInput;
  collegeStream?: CollegeStreamCreateInput;
}

export type InstitutionSetupFeeStructureUpdateInput = Partial<InstitutionSetupFeeStructureCreateInput>;

