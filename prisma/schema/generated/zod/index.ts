import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const SystemAdminScalarFieldEnumSchema = z.enum(['id','email','password','firstName','lastName','phoneNumber','SystemId','createdAt','updatedAt','verified','verificationToken','verificationTokenExpiry','planId','planName','monthlyPrice','authProvider','FcmToken','isSuperAdmin']);

export const SystemScalarFieldEnumSchema = z.enum(['id','name','shortName','email','firstName','lastName','phone','isInitialSystem','isTwoFactorAuth','establishmentYear','website','registrationNumber','slogan','description','logo','SystemAdminId','vision','mission','planId','isVerified','lastLoginAt','loginAttempts','lockUntil','createdAt','updatedAt','razorpaySubscriptionIds']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','firstName','lastName','phoneNumber','createdAt','updatedAt','role','isActive','isVerified','verificationToken','resetToken','resetTokenExpiry']);

export const VehicleScalarFieldEnumSchema = z.enum(['id','registrationNumber','userId','make','model','year','color','createdAt','updatedAt']);

export const DrivingLicenseScalarFieldEnumSchema = z.enum(['id','licenseNumber','userId','issuedDate','expiryDate','issuingAuthority','createdAt','updatedAt']);

export const ReminderScalarFieldEnumSchema = z.enum(['id','type','reminderDate','userId','vehicleId','licenseId','notifyDaysBefore','isEnabled','createdAt','updatedAt']);

export const NotificationScalarFieldEnumSchema = z.enum(['id','userId','title','message','type','isRead','createdAt','readAt']);

export const ActivityLogScalarFieldEnumSchema = z.enum(['id','userId','entityId','entityType','action','details','ipAddress','userAgent','createdAt','metadata']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const UserRoleSchema = z.enum(['ADMIN','CUSTOMER','STAFF']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const ReminderTypeSchema = z.enum(['PUCC','FITNESS','TAX','INSURANCE','PERMIT','NATIONAL_PERMIT','LICENSE_EXPIRY','OTHER']);

export type ReminderTypeType = `${z.infer<typeof ReminderTypeSchema>}`

export const NotificationTypeSchema = z.enum(['TRANSACTION','INVESTMENT','KYC','SYSTEM','PROMOTIONAL','REMINDER']);

export type NotificationTypeType = `${z.infer<typeof NotificationTypeSchema>}`

export const EntityTypeSchema = z.enum(['VEHICLE','DRIVING_LICENSE','REMINDER']);

export type EntityTypeType = `${z.infer<typeof EntityTypeSchema>}`

export const ActivityActionSchema = z.enum(['CREATE','UPDATE','DELETE','VIEW','LOGIN','LOGOUT','VERIFY','REJECT','COMPLETE','CANCEL','REDEEM']);

export type ActivityActionType = `${z.infer<typeof ActivityActionSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// SYSTEM ADMIN SCHEMA
/////////////////////////////////////////

export const SystemAdminSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  SystemId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  verified: z.boolean(),
  verificationToken: z.string().nullable(),
  verificationTokenExpiry: z.date().nullable(),
  planId: z.number(),
  planName: z.string(),
  monthlyPrice: z.number(),
  authProvider: z.string(),
  FcmToken: z.string().nullable(),
  isSuperAdmin: z.boolean(),
})

export type SystemAdmin = z.infer<typeof SystemAdminSchema>

/////////////////////////////////////////
// SYSTEM SCHEMA
/////////////////////////////////////////

export const SystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().nullable(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string(),
  isInitialSystem: z.boolean().nullable(),
  isTwoFactorAuth: z.boolean().nullable(),
  establishmentYear: z.number().nullable(),
  website: z.string().nullable(),
  registrationNumber: z.string().nullable(),
  slogan: z.string().nullable(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  SystemAdminId: z.string().nullable(),
  vision: z.string().nullable(),
  mission: z.string().nullable(),
  planId: z.number(),
  isVerified: z.boolean(),
  lastLoginAt: z.date().nullable(),
  loginAttempts: z.number(),
  lockUntil: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  razorpaySubscriptionIds: z.string().array(),
})

export type System = z.infer<typeof SystemSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.string(),
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  verificationToken: z.string().nullable(),
  resetToken: z.string().nullable(),
  resetTokenExpiry: z.date().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// VEHICLE SCHEMA
/////////////////////////////////////////

export const VehicleSchema = z.object({
  id: z.string(),
  registrationNumber: z.string(),
  userId: z.string(),
  make: z.string().nullable(),
  model: z.string().nullable(),
  year: z.number().nullable(),
  color: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

/////////////////////////////////////////
// DRIVING LICENSE SCHEMA
/////////////////////////////////////////

export const DrivingLicenseSchema = z.object({
  id: z.string(),
  licenseNumber: z.string(),
  userId: z.string(),
  issuedDate: z.date().nullable(),
  expiryDate: z.date().nullable(),
  issuingAuthority: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type DrivingLicense = z.infer<typeof DrivingLicenseSchema>

/////////////////////////////////////////
// REMINDER SCHEMA
/////////////////////////////////////////

export const ReminderSchema = z.object({
  type: ReminderTypeSchema,
  id: z.string(),
  reminderDate: z.date(),
  userId: z.string(),
  vehicleId: z.string().nullable(),
  licenseId: z.string().nullable(),
  notifyDaysBefore: z.number(),
  isEnabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Reminder = z.infer<typeof ReminderSchema>

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

export const NotificationSchema = z.object({
  type: NotificationTypeSchema,
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
  readAt: z.date().nullable(),
})

export type Notification = z.infer<typeof NotificationSchema>

/////////////////////////////////////////
// ACTIVITY LOG SCHEMA
/////////////////////////////////////////

export const ActivityLogSchema = z.object({
  entityType: EntityTypeSchema,
  action: ActivityActionSchema,
  id: z.string(),
  userId: z.string().nullable(),
  entityId: z.string(),
  details: JsonValueSchema.nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.date(),
  metadata: JsonValueSchema.nullable(),
})

export type ActivityLog = z.infer<typeof ActivityLogSchema>

/////////////////////////////////////////
// COMPOSITE TYPES
/////////////////////////////////////////
// ADDRESS
//------------------------------------------------------


/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
})

export type Address = z.infer<typeof AddressSchema>
// GEO LOCATION
//------------------------------------------------------


/////////////////////////////////////////
// GEO LOCATION SCHEMA
/////////////////////////////////////////

export const GeoLocationSchema = z.object({
  type: z.string(),
  coordinates: z.number().array(),
})

export type GeoLocation = z.infer<typeof GeoLocationSchema>
