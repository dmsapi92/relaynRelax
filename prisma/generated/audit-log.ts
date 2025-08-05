export interface AuditLogModel {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogCreateInput {
  id?: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: any | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
}

export interface AuditLogRelationalCreateInput extends AuditLogCreateInput {
  
}

export type AuditLogUpdateInput = Partial<AuditLogCreateInput>;

