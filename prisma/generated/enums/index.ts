export const UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF'
} as const;
export type UserRole = keyof typeof UserRole;

export const ReminderType = {
  PUCC: 'PUCC',
  FITNESS: 'FITNESS',
  TAX: 'TAX',
  INSURANCE: 'INSURANCE',
  PERMIT: 'PERMIT',
  NATIONAL_PERMIT: 'NATIONAL_PERMIT',
  LICENSE_EXPIRY: 'LICENSE_EXPIRY',
  OTHER: 'OTHER'
} as const;
export type ReminderType = keyof typeof ReminderType;

export const NotificationType = {
  TRANSACTION: 'TRANSACTION',
  INVESTMENT: 'INVESTMENT',
  KYC: 'KYC',
  SYSTEM: 'SYSTEM',
  PROMOTIONAL: 'PROMOTIONAL',
  REMINDER: 'REMINDER'
} as const;
export type NotificationType = keyof typeof NotificationType;

export const EntityType = {
  VEHICLE: 'VEHICLE',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  REMINDER: 'REMINDER'
} as const;
export type EntityType = keyof typeof EntityType;

export const ActivityAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  VERIFY: 'VERIFY',
  REJECT: 'REJECT',
  COMPLETE: 'COMPLETE',
  CANCEL: 'CANCEL',
  REDEEM: 'REDEEM'
} as const;
export type ActivityAction = keyof typeof ActivityAction;

