import { AuditStatus } from "./enums";
import { InstitutionSetupCampusModel, InstitutionSetupCampusCreateInput } from "./institution-setup-campus";
import { InventoryAuditFindingModel, InventoryAuditFindingCreateInput } from "./inventory-audit-finding";

export interface InventoryAuditModel {
  id: string;
  auditDate: string;
  conductedBy: string;
  status: AuditStatus;
  notes: string | null;
  campusId: string | null;
  campus?: InstitutionSetupCampusModel;
  findings?: InventoryAuditFindingModel[];
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAuditCreateInput {
  id?: string;
  auditDate: string;
  conductedBy: string;
  status?: AuditStatus;
  notes?: string | null;
  campusId?: string | null;
  departmentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryAuditRelationalCreateInput extends InventoryAuditCreateInput {
  campus?: InstitutionSetupCampusCreateInput;
  findings?: InventoryAuditFindingCreateInput | InventoryAuditFindingCreateInput[];
}

export type InventoryAuditUpdateInput = Partial<InventoryAuditCreateInput>;

