import { z } from 'zod';
import { Prisma } from '../../../generated/prisma';
import Decimal from 'decimal.js';

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

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','email','username','organizationId','role','createdAt','updatedAt']);

export const SubscriptionScalarFieldEnumSchema = z.enum(['id','userId','planId','status','lemonSqueezyId','lemonSubscriptionItemId','lemonCustomerId','lemonOrderId','lemonProductId','lemonVariantId','renewsAt','endsAt','paymentMethod','cardBrand','cardLast4','createdAt','updatedAt']);

export const PlanScalarFieldEnumSchema = z.enum(['id','title','name','description','content','available','price','lemonSqueezyProductId','lemonSqueezyVariantId','createdAt','updatedAt']);

export const WebhookEventScalarFieldEnumSchema = z.enum(['id','eventId','eventName','resourceId','processedAt','payload','createdAt']);

export const PaymentHistoryScalarFieldEnumSchema = z.enum(['id','userId','invoiceId','subscriptionId','customerId','userEmail','billingReason','status','statusFormatted','currency','currencyRate','subtotal','discountTotal','tax','taxInclusive','total','refundedAmount','subtotalUsd','discountTotalUsd','taxUsd','totalUsd','refundedAmountUsd','cardBrand','cardLastFour','invoiceUrl','testMode','refundedAt','createdAt','updatedAt']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','clerkOrgId','name','slug','description','settings','createdAt','updatedAt']);

export const TicketScalarFieldEnumSchema = z.enum(['id','organizationId','citizenName','citizenPhone','citizenEmail','citizenAddress','content','category','sentiment','status','priority','assignedToId','publicToken','slaDueAt','repliedAt','closedAt','aiSummary','aiDraftAnswer','aiSuggestedAssigneeId','aiConfidenceScore','aiNeedsManualReview','aiErrorMessage','createdAt','updatedAt']);

export const TicketUpdateScalarFieldEnumSchema = z.enum(['id','ticketId','userId','updateType','content','replyText','createdAt']);

export const SatisfactionSurveyScalarFieldEnumSchema = z.enum(['id','ticketId','rating','feedback','sentAt','submittedAt','createdAt','updatedAt']);

export const NotificationQueueScalarFieldEnumSchema = z.enum(['id','ticketId','type','recipientPhone','recipientEmail','recipientName','templateData','preferredChannel','currentChannel','status','attempts','maxAttempts','scheduledAt','sentAt','deliveredAt','failedAt','errorMessage','metadata','createdAt','updatedAt']);

export const NotificationLogScalarFieldEnumSchema = z.enum(['id','queueId','channel','status','requestData','responseData','errorMessage','attemptNumber','sentAt','responseAt','createdAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const SubscriptionStatusSchema = z.enum(['ACTIVE','CANCELLED','EXPIRED','UNPAID','PAST_DUE']);

export type SubscriptionStatusType = `${z.infer<typeof SubscriptionStatusSchema>}`

export const UserRoleSchema = z.enum(['ADMIN','MEMBER','VIEWER']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const TicketStatusSchema = z.enum(['NEW','CLASSIFIED','IN_PROGRESS','REPLIED','CLOSED']);

export type TicketStatusType = `${z.infer<typeof TicketStatusSchema>}`

export const TicketPrioritySchema = z.enum(['LOW','NORMAL','HIGH','URGENT']);

export type TicketPriorityType = `${z.infer<typeof TicketPrioritySchema>}`

export const TicketUpdateTypeSchema = z.enum(['STATUS_CHANGE','COMMENT','REPLY_SENT','ASSIGNMENT_CHANGE','PRIORITY_CHANGE','CATEGORY_CHANGE']);

export type TicketUpdateTypeType = `${z.infer<typeof TicketUpdateTypeSchema>}`

export const SentimentSchema = z.enum(['POSITIVE','NEUTRAL','NEGATIVE']);

export type SentimentType = `${z.infer<typeof SentimentSchema>}`

export const NotificationChannelSchema = z.enum(['KAKAO','SMS','EMAIL']);

export type NotificationChannelType = `${z.infer<typeof NotificationChannelSchema>}`

export const NotificationStatusSchema = z.enum(['PENDING','SENT','FAILED','DELIVERED']);

export type NotificationStatusType = `${z.infer<typeof NotificationStatusSchema>}`

export const NotificationTypeSchema = z.enum(['TICKET_RECEIVED','TICKET_ASSIGNED','TICKET_REPLIED','TICKET_CLOSED','SLA_WARNING','SATISFACTION_REQUEST']);

export type NotificationTypeType = `${z.infer<typeof NotificationTypeSchema>}`

export const SubscriptionPaymentMethodSchema = z.enum(['CARD','BANK_TRANSFER','PAYPAL']);

export type SubscriptionPaymentMethodType = `${z.infer<typeof SubscriptionPaymentMethodSchema>}`

export const PaymentStatusSchema = z.enum(['SUCCESS','FAILED','REFUNDED','PENDING']);

export type PaymentStatusType = `${z.infer<typeof PaymentStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().nullable(),
  organizationId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SUBSCRIPTION SCHEMA
/////////////////////////////////////////

export const SubscriptionSchema = z.object({
  status: SubscriptionStatusSchema,
  paymentMethod: SubscriptionPaymentMethodSchema,
  id: z.string(),
  userId: z.string(),
  planId: z.string(),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().nullable(),
  endsAt: z.coerce.date().nullable(),
  cardBrand: z.string().nullable(),
  cardLast4: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

/////////////////////////////////////////
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  content: JsonValueSchema.nullable(),
  available: z.boolean(),
  price: z.instanceof(Prisma.Decimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'Plan']"}),
  lemonSqueezyProductId: z.string(),
  lemonSqueezyVariantId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Plan = z.infer<typeof PlanSchema>

/////////////////////////////////////////
// WEBHOOK EVENT SCHEMA
/////////////////////////////////////////

export const WebhookEventSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  resourceId: z.string(),
  processedAt: z.coerce.date(),
  payload: JsonValueSchema,
  createdAt: z.coerce.date(),
})

export type WebhookEvent = z.infer<typeof WebhookEventSchema>

/////////////////////////////////////////
// PAYMENT HISTORY SCHEMA
/////////////////////////////////////////

export const PaymentHistorySchema = z.object({
  status: PaymentStatusSchema,
  id: z.string(),
  userId: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  customerId: z.string(),
  userEmail: z.string(),
  billingReason: z.string(),
  statusFormatted: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  subtotal: z.number().int(),
  discountTotal: z.number().int(),
  tax: z.number().int(),
  taxInclusive: z.boolean(),
  total: z.number().int(),
  refundedAmount: z.number().int(),
  subtotalUsd: z.number().int(),
  discountTotalUsd: z.number().int(),
  taxUsd: z.number().int(),
  totalUsd: z.number().int(),
  refundedAmountUsd: z.number().int(),
  cardBrand: z.string().nullable(),
  cardLastFour: z.string().nullable(),
  invoiceUrl: z.string().nullable(),
  testMode: z.boolean(),
  refundedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PaymentHistory = z.infer<typeof PaymentHistorySchema>

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  id: z.string().cuid(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  settings: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Organization = z.infer<typeof OrganizationSchema>

/////////////////////////////////////////
// TICKET SCHEMA
/////////////////////////////////////////

export const TicketSchema = z.object({
  sentiment: SentimentSchema.nullable(),
  status: TicketStatusSchema,
  priority: TicketPrioritySchema,
  id: z.string().cuid(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().nullable(),
  citizenEmail: z.string().nullable(),
  citizenAddress: z.string().nullable(),
  content: z.string(),
  category: z.string().nullable(),
  assignedToId: z.string().nullable(),
  publicToken: z.string().uuid(),
  slaDueAt: z.coerce.date().nullable(),
  repliedAt: z.coerce.date().nullable(),
  closedAt: z.coerce.date().nullable(),
  aiSummary: z.string().nullable(),
  aiDraftAnswer: z.string().nullable(),
  aiSuggestedAssigneeId: z.string().nullable(),
  aiConfidenceScore: z.number().nullable(),
  aiNeedsManualReview: z.boolean(),
  aiErrorMessage: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Ticket = z.infer<typeof TicketSchema>

/////////////////////////////////////////
// TICKET UPDATE SCHEMA
/////////////////////////////////////////

export const TicketUpdateSchema = z.object({
  updateType: TicketUpdateTypeSchema,
  id: z.string().cuid(),
  ticketId: z.string(),
  userId: z.string().nullable(),
  content: JsonValueSchema,
  replyText: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type TicketUpdate = z.infer<typeof TicketUpdateSchema>

/////////////////////////////////////////
// SATISFACTION SURVEY SCHEMA
/////////////////////////////////////////

export const SatisfactionSurveySchema = z.object({
  id: z.string().cuid(),
  ticketId: z.string(),
  rating: z.number().int(),
  feedback: z.string().nullable(),
  sentAt: z.coerce.date(),
  submittedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SatisfactionSurvey = z.infer<typeof SatisfactionSurveySchema>

/////////////////////////////////////////
// NOTIFICATION QUEUE SCHEMA
/////////////////////////////////////////

export const NotificationQueueSchema = z.object({
  type: NotificationTypeSchema,
  preferredChannel: NotificationChannelSchema,
  currentChannel: NotificationChannelSchema.nullable(),
  status: NotificationStatusSchema,
  id: z.string().cuid(),
  ticketId: z.string(),
  recipientPhone: z.string().nullable(),
  recipientEmail: z.string().nullable(),
  recipientName: z.string(),
  templateData: JsonValueSchema,
  attempts: z.number().int(),
  maxAttempts: z.number().int(),
  scheduledAt: z.coerce.date(),
  sentAt: z.coerce.date().nullable(),
  deliveredAt: z.coerce.date().nullable(),
  failedAt: z.coerce.date().nullable(),
  errorMessage: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type NotificationQueue = z.infer<typeof NotificationQueueSchema>

/////////////////////////////////////////
// NOTIFICATION LOG SCHEMA
/////////////////////////////////////////

export const NotificationLogSchema = z.object({
  channel: NotificationChannelSchema,
  status: NotificationStatusSchema,
  id: z.string().cuid(),
  queueId: z.string(),
  requestData: JsonValueSchema.nullable(),
  responseData: JsonValueSchema.nullable(),
  errorMessage: z.string().nullable(),
  attemptNumber: z.number().int(),
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
})

export type NotificationLog = z.infer<typeof NotificationLogSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  subscription: z.union([z.boolean(),z.lazy(() => SubscriptionArgsSchema)]).optional(),
  paymentHistories: z.union([z.boolean(),z.lazy(() => PaymentHistoryFindManyArgsSchema)]).optional(),
  assignedTickets: z.union([z.boolean(),z.lazy(() => TicketFindManyArgsSchema)]).optional(),
  ticketUpdates: z.union([z.boolean(),z.lazy(() => TicketUpdateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  paymentHistories: z.boolean().optional(),
  assignedTickets: z.boolean().optional(),
  ticketUpdates: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  clerkId: z.boolean().optional(),
  email: z.boolean().optional(),
  username: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  subscription: z.union([z.boolean(),z.lazy(() => SubscriptionArgsSchema)]).optional(),
  paymentHistories: z.union([z.boolean(),z.lazy(() => PaymentHistoryFindManyArgsSchema)]).optional(),
  assignedTickets: z.union([z.boolean(),z.lazy(() => TicketFindManyArgsSchema)]).optional(),
  ticketUpdates: z.union([z.boolean(),z.lazy(() => TicketUpdateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SUBSCRIPTION
//------------------------------------------------------

export const SubscriptionIncludeSchema: z.ZodType<Prisma.SubscriptionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  plan: z.union([z.boolean(),z.lazy(() => PlanArgsSchema)]).optional(),
}).strict()

export const SubscriptionArgsSchema: z.ZodType<Prisma.SubscriptionDefaultArgs> = z.object({
  select: z.lazy(() => SubscriptionSelectSchema).optional(),
  include: z.lazy(() => SubscriptionIncludeSchema).optional(),
}).strict();

export const SubscriptionSelectSchema: z.ZodType<Prisma.SubscriptionSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  planId: z.boolean().optional(),
  status: z.boolean().optional(),
  lemonSqueezyId: z.boolean().optional(),
  lemonSubscriptionItemId: z.boolean().optional(),
  lemonCustomerId: z.boolean().optional(),
  lemonOrderId: z.boolean().optional(),
  lemonProductId: z.boolean().optional(),
  lemonVariantId: z.boolean().optional(),
  renewsAt: z.boolean().optional(),
  endsAt: z.boolean().optional(),
  paymentMethod: z.boolean().optional(),
  cardBrand: z.boolean().optional(),
  cardLast4: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  plan: z.union([z.boolean(),z.lazy(() => PlanArgsSchema)]).optional(),
}).strict()

// PLAN
//------------------------------------------------------

export const PlanIncludeSchema: z.ZodType<Prisma.PlanInclude> = z.object({
  subscriptions: z.union([z.boolean(),z.lazy(() => SubscriptionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PlanCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PlanArgsSchema: z.ZodType<Prisma.PlanDefaultArgs> = z.object({
  select: z.lazy(() => PlanSelectSchema).optional(),
  include: z.lazy(() => PlanIncludeSchema).optional(),
}).strict();

export const PlanCountOutputTypeArgsSchema: z.ZodType<Prisma.PlanCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PlanCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PlanCountOutputTypeSelectSchema: z.ZodType<Prisma.PlanCountOutputTypeSelect> = z.object({
  subscriptions: z.boolean().optional(),
}).strict();

export const PlanSelectSchema: z.ZodType<Prisma.PlanSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  content: z.boolean().optional(),
  available: z.boolean().optional(),
  price: z.boolean().optional(),
  lemonSqueezyProductId: z.boolean().optional(),
  lemonSqueezyVariantId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  subscriptions: z.union([z.boolean(),z.lazy(() => SubscriptionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PlanCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WEBHOOK EVENT
//------------------------------------------------------

export const WebhookEventSelectSchema: z.ZodType<Prisma.WebhookEventSelect> = z.object({
  id: z.boolean().optional(),
  eventId: z.boolean().optional(),
  eventName: z.boolean().optional(),
  resourceId: z.boolean().optional(),
  processedAt: z.boolean().optional(),
  payload: z.boolean().optional(),
  createdAt: z.boolean().optional(),
}).strict()

// PAYMENT HISTORY
//------------------------------------------------------

export const PaymentHistoryIncludeSchema: z.ZodType<Prisma.PaymentHistoryInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const PaymentHistoryArgsSchema: z.ZodType<Prisma.PaymentHistoryDefaultArgs> = z.object({
  select: z.lazy(() => PaymentHistorySelectSchema).optional(),
  include: z.lazy(() => PaymentHistoryIncludeSchema).optional(),
}).strict();

export const PaymentHistorySelectSchema: z.ZodType<Prisma.PaymentHistorySelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  invoiceId: z.boolean().optional(),
  subscriptionId: z.boolean().optional(),
  customerId: z.boolean().optional(),
  userEmail: z.boolean().optional(),
  billingReason: z.boolean().optional(),
  status: z.boolean().optional(),
  statusFormatted: z.boolean().optional(),
  currency: z.boolean().optional(),
  currencyRate: z.boolean().optional(),
  subtotal: z.boolean().optional(),
  discountTotal: z.boolean().optional(),
  tax: z.boolean().optional(),
  taxInclusive: z.boolean().optional(),
  total: z.boolean().optional(),
  refundedAmount: z.boolean().optional(),
  subtotalUsd: z.boolean().optional(),
  discountTotalUsd: z.boolean().optional(),
  taxUsd: z.boolean().optional(),
  totalUsd: z.boolean().optional(),
  refundedAmountUsd: z.boolean().optional(),
  cardBrand: z.boolean().optional(),
  cardLastFour: z.boolean().optional(),
  invoiceUrl: z.boolean().optional(),
  testMode: z.boolean().optional(),
  refundedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ORGANIZATION
//------------------------------------------------------

export const OrganizationIncludeSchema: z.ZodType<Prisma.OrganizationInclude> = z.object({
  users: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  tickets: z.union([z.boolean(),z.lazy(() => TicketFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrganizationArgsSchema: z.ZodType<Prisma.OrganizationDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationSelectSchema).optional(),
  include: z.lazy(() => OrganizationIncludeSchema).optional(),
}).strict();

export const OrganizationCountOutputTypeArgsSchema: z.ZodType<Prisma.OrganizationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrganizationCountOutputTypeSelectSchema: z.ZodType<Prisma.OrganizationCountOutputTypeSelect> = z.object({
  users: z.boolean().optional(),
  tickets: z.boolean().optional(),
}).strict();

export const OrganizationSelectSchema: z.ZodType<Prisma.OrganizationSelect> = z.object({
  id: z.boolean().optional(),
  clerkOrgId: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  description: z.boolean().optional(),
  settings: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  users: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  tickets: z.union([z.boolean(),z.lazy(() => TicketFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TICKET
//------------------------------------------------------

export const TicketIncludeSchema: z.ZodType<Prisma.TicketInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  assignedTo: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  updates: z.union([z.boolean(),z.lazy(() => TicketUpdateFindManyArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SatisfactionSurveyArgsSchema)]).optional(),
  notifications: z.union([z.boolean(),z.lazy(() => NotificationQueueFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TicketCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TicketArgsSchema: z.ZodType<Prisma.TicketDefaultArgs> = z.object({
  select: z.lazy(() => TicketSelectSchema).optional(),
  include: z.lazy(() => TicketIncludeSchema).optional(),
}).strict();

export const TicketCountOutputTypeArgsSchema: z.ZodType<Prisma.TicketCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TicketCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TicketCountOutputTypeSelectSchema: z.ZodType<Prisma.TicketCountOutputTypeSelect> = z.object({
  updates: z.boolean().optional(),
  notifications: z.boolean().optional(),
}).strict();

export const TicketSelectSchema: z.ZodType<Prisma.TicketSelect> = z.object({
  id: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  citizenName: z.boolean().optional(),
  citizenPhone: z.boolean().optional(),
  citizenEmail: z.boolean().optional(),
  citizenAddress: z.boolean().optional(),
  content: z.boolean().optional(),
  category: z.boolean().optional(),
  sentiment: z.boolean().optional(),
  status: z.boolean().optional(),
  priority: z.boolean().optional(),
  assignedToId: z.boolean().optional(),
  publicToken: z.boolean().optional(),
  slaDueAt: z.boolean().optional(),
  repliedAt: z.boolean().optional(),
  closedAt: z.boolean().optional(),
  aiSummary: z.boolean().optional(),
  aiDraftAnswer: z.boolean().optional(),
  aiSuggestedAssigneeId: z.boolean().optional(),
  aiConfidenceScore: z.boolean().optional(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  assignedTo: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  updates: z.union([z.boolean(),z.lazy(() => TicketUpdateFindManyArgsSchema)]).optional(),
  survey: z.union([z.boolean(),z.lazy(() => SatisfactionSurveyArgsSchema)]).optional(),
  notifications: z.union([z.boolean(),z.lazy(() => NotificationQueueFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TicketCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TICKET UPDATE
//------------------------------------------------------

export const TicketUpdateIncludeSchema: z.ZodType<Prisma.TicketUpdateInclude> = z.object({
  ticket: z.union([z.boolean(),z.lazy(() => TicketArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const TicketUpdateArgsSchema: z.ZodType<Prisma.TicketUpdateDefaultArgs> = z.object({
  select: z.lazy(() => TicketUpdateSelectSchema).optional(),
  include: z.lazy(() => TicketUpdateIncludeSchema).optional(),
}).strict();

export const TicketUpdateSelectSchema: z.ZodType<Prisma.TicketUpdateSelect> = z.object({
  id: z.boolean().optional(),
  ticketId: z.boolean().optional(),
  userId: z.boolean().optional(),
  updateType: z.boolean().optional(),
  content: z.boolean().optional(),
  replyText: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  ticket: z.union([z.boolean(),z.lazy(() => TicketArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SATISFACTION SURVEY
//------------------------------------------------------

export const SatisfactionSurveyIncludeSchema: z.ZodType<Prisma.SatisfactionSurveyInclude> = z.object({
  ticket: z.union([z.boolean(),z.lazy(() => TicketArgsSchema)]).optional(),
}).strict()

export const SatisfactionSurveyArgsSchema: z.ZodType<Prisma.SatisfactionSurveyDefaultArgs> = z.object({
  select: z.lazy(() => SatisfactionSurveySelectSchema).optional(),
  include: z.lazy(() => SatisfactionSurveyIncludeSchema).optional(),
}).strict();

export const SatisfactionSurveySelectSchema: z.ZodType<Prisma.SatisfactionSurveySelect> = z.object({
  id: z.boolean().optional(),
  ticketId: z.boolean().optional(),
  rating: z.boolean().optional(),
  feedback: z.boolean().optional(),
  sentAt: z.boolean().optional(),
  submittedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ticket: z.union([z.boolean(),z.lazy(() => TicketArgsSchema)]).optional(),
}).strict()

// NOTIFICATION QUEUE
//------------------------------------------------------

export const NotificationQueueIncludeSchema: z.ZodType<Prisma.NotificationQueueInclude> = z.object({
  ticket: z.union([z.boolean(),z.lazy(() => TicketArgsSchema)]).optional(),
  logs: z.union([z.boolean(),z.lazy(() => NotificationLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => NotificationQueueCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const NotificationQueueArgsSchema: z.ZodType<Prisma.NotificationQueueDefaultArgs> = z.object({
  select: z.lazy(() => NotificationQueueSelectSchema).optional(),
  include: z.lazy(() => NotificationQueueIncludeSchema).optional(),
}).strict();

export const NotificationQueueCountOutputTypeArgsSchema: z.ZodType<Prisma.NotificationQueueCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => NotificationQueueCountOutputTypeSelectSchema).nullish(),
}).strict();

export const NotificationQueueCountOutputTypeSelectSchema: z.ZodType<Prisma.NotificationQueueCountOutputTypeSelect> = z.object({
  logs: z.boolean().optional(),
}).strict();

export const NotificationQueueSelectSchema: z.ZodType<Prisma.NotificationQueueSelect> = z.object({
  id: z.boolean().optional(),
  ticketId: z.boolean().optional(),
  type: z.boolean().optional(),
  recipientPhone: z.boolean().optional(),
  recipientEmail: z.boolean().optional(),
  recipientName: z.boolean().optional(),
  templateData: z.boolean().optional(),
  preferredChannel: z.boolean().optional(),
  currentChannel: z.boolean().optional(),
  status: z.boolean().optional(),
  attempts: z.boolean().optional(),
  maxAttempts: z.boolean().optional(),
  scheduledAt: z.boolean().optional(),
  sentAt: z.boolean().optional(),
  deliveredAt: z.boolean().optional(),
  failedAt: z.boolean().optional(),
  errorMessage: z.boolean().optional(),
  metadata: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ticket: z.union([z.boolean(),z.lazy(() => TicketArgsSchema)]).optional(),
  logs: z.union([z.boolean(),z.lazy(() => NotificationLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => NotificationQueueCountOutputTypeArgsSchema)]).optional(),
}).strict()

// NOTIFICATION LOG
//------------------------------------------------------

export const NotificationLogIncludeSchema: z.ZodType<Prisma.NotificationLogInclude> = z.object({
  queue: z.union([z.boolean(),z.lazy(() => NotificationQueueArgsSchema)]).optional(),
}).strict()

export const NotificationLogArgsSchema: z.ZodType<Prisma.NotificationLogDefaultArgs> = z.object({
  select: z.lazy(() => NotificationLogSelectSchema).optional(),
  include: z.lazy(() => NotificationLogIncludeSchema).optional(),
}).strict();

export const NotificationLogSelectSchema: z.ZodType<Prisma.NotificationLogSelect> = z.object({
  id: z.boolean().optional(),
  queueId: z.boolean().optional(),
  channel: z.boolean().optional(),
  status: z.boolean().optional(),
  requestData: z.boolean().optional(),
  responseData: z.boolean().optional(),
  errorMessage: z.boolean().optional(),
  attemptNumber: z.boolean().optional(),
  sentAt: z.boolean().optional(),
  responseAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  queue: z.union([z.boolean(),z.lazy(() => NotificationQueueArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationNullableScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional().nullable(),
  subscription: z.union([ z.lazy(() => SubscriptionNullableScalarRelationFilterSchema),z.lazy(() => SubscriptionWhereInputSchema) ]).optional().nullable(),
  paymentHistories: z.lazy(() => PaymentHistoryListRelationFilterSchema).optional(),
  assignedTickets: z.lazy(() => TicketListRelationFilterSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organizationId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionOrderByWithRelationInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryOrderByRelationAggregateInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketOrderByRelationAggregateInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    clerkId: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
    clerkId: z.string(),
  }),
  z.object({
    id: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
  }),
  z.object({
    clerkId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  clerkId: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationNullableScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional().nullable(),
  subscription: z.union([ z.lazy(() => SubscriptionNullableScalarRelationFilterSchema),z.lazy(() => SubscriptionWhereInputSchema) ]).optional().nullable(),
  paymentHistories: z.lazy(() => PaymentHistoryListRelationFilterSchema).optional(),
  assignedTickets: z.lazy(() => TicketListRelationFilterSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organizationId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SubscriptionWhereInputSchema: z.ZodType<Prisma.SubscriptionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubscriptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  planId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumSubscriptionStatusFilterSchema),z.lazy(() => SubscriptionStatusSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonSubscriptionItemId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lemonCustomerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonOrderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonProductId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonVariantId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  renewsAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  endsAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumSubscriptionPaymentMethodFilterSchema),z.lazy(() => SubscriptionPaymentMethodSchema) ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cardLast4: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PlanScalarRelationFilterSchema),z.lazy(() => PlanWhereInputSchema) ]).optional(),
}).strict();

export const SubscriptionOrderByWithRelationInputSchema: z.ZodType<Prisma.SubscriptionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyId: z.lazy(() => SortOrderSchema).optional(),
  lemonSubscriptionItemId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lemonCustomerId: z.lazy(() => SortOrderSchema).optional(),
  lemonOrderId: z.lazy(() => SortOrderSchema).optional(),
  lemonProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonVariantId: z.lazy(() => SortOrderSchema).optional(),
  renewsAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  endsAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cardLast4: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  plan: z.lazy(() => PlanOrderByWithRelationInputSchema).optional()
}).strict();

export const SubscriptionWhereUniqueInputSchema: z.ZodType<Prisma.SubscriptionWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    userId: z.string(),
    lemonSqueezyId: z.string(),
    lemonOrderId: z.string()
  }),
  z.object({
    id: z.string(),
    userId: z.string(),
    lemonSqueezyId: z.string(),
  }),
  z.object({
    id: z.string(),
    userId: z.string(),
    lemonOrderId: z.string(),
  }),
  z.object({
    id: z.string(),
    userId: z.string(),
  }),
  z.object({
    id: z.string(),
    lemonSqueezyId: z.string(),
    lemonOrderId: z.string(),
  }),
  z.object({
    id: z.string(),
    lemonSqueezyId: z.string(),
  }),
  z.object({
    id: z.string(),
    lemonOrderId: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    userId: z.string(),
    lemonSqueezyId: z.string(),
    lemonOrderId: z.string(),
  }),
  z.object({
    userId: z.string(),
    lemonSqueezyId: z.string(),
  }),
  z.object({
    userId: z.string(),
    lemonOrderId: z.string(),
  }),
  z.object({
    userId: z.string(),
  }),
  z.object({
    lemonSqueezyId: z.string(),
    lemonOrderId: z.string(),
  }),
  z.object({
    lemonSqueezyId: z.string(),
  }),
  z.object({
    lemonOrderId: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  lemonSqueezyId: z.string().optional(),
  lemonOrderId: z.string().optional(),
  AND: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubscriptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubscriptionWhereInputSchema),z.lazy(() => SubscriptionWhereInputSchema).array() ]).optional(),
  planId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumSubscriptionStatusFilterSchema),z.lazy(() => SubscriptionStatusSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lemonCustomerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonProductId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonVariantId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  renewsAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  endsAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumSubscriptionPaymentMethodFilterSchema),z.lazy(() => SubscriptionPaymentMethodSchema) ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cardLast4: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  plan: z.union([ z.lazy(() => PlanScalarRelationFilterSchema),z.lazy(() => PlanWhereInputSchema) ]).optional(),
}).strict());

export const SubscriptionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SubscriptionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyId: z.lazy(() => SortOrderSchema).optional(),
  lemonSubscriptionItemId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lemonCustomerId: z.lazy(() => SortOrderSchema).optional(),
  lemonOrderId: z.lazy(() => SortOrderSchema).optional(),
  lemonProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonVariantId: z.lazy(() => SortOrderSchema).optional(),
  renewsAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  endsAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cardLast4: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SubscriptionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SubscriptionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SubscriptionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SubscriptionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SubscriptionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubscriptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  planId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumSubscriptionStatusWithAggregatesFilterSchema),z.lazy(() => SubscriptionStatusSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lemonSubscriptionItemId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lemonCustomerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lemonOrderId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lemonProductId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lemonVariantId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  renewsAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  endsAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumSubscriptionPaymentMethodWithAggregatesFilterSchema),z.lazy(() => SubscriptionPaymentMethodSchema) ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  cardLast4: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PlanWhereInputSchema: z.ZodType<Prisma.PlanWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.lazy(() => JsonNullableFilterSchema).optional(),
  available: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lemonSqueezyProductId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonSqueezyVariantId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  subscriptions: z.lazy(() => SubscriptionListRelationFilterSchema).optional()
}).strict();

export const PlanOrderByWithRelationInputSchema: z.ZodType<Prisma.PlanOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  available: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyVariantId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  subscriptions: z.lazy(() => SubscriptionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PlanWhereUniqueInputSchema: z.ZodType<Prisma.PlanWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlanWhereInputSchema),z.lazy(() => PlanWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.lazy(() => JsonNullableFilterSchema).optional(),
  available: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lemonSqueezyProductId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonSqueezyVariantId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  subscriptions: z.lazy(() => SubscriptionListRelationFilterSchema).optional()
}).strict());

export const PlanOrderByWithAggregationInputSchema: z.ZodType<Prisma.PlanOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  available: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyVariantId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PlanCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PlanAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PlanMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PlanMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PlanSumOrderByAggregateInputSchema).optional()
}).strict();

export const PlanScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PlanScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PlanScalarWhereWithAggregatesInputSchema),z.lazy(() => PlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlanScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlanScalarWhereWithAggregatesInputSchema),z.lazy(() => PlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  content: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  available: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  price: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lemonSqueezyProductId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lemonSqueezyVariantId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WebhookEventWhereInputSchema: z.ZodType<Prisma.WebhookEventWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WebhookEventWhereInputSchema),z.lazy(() => WebhookEventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WebhookEventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WebhookEventWhereInputSchema),z.lazy(() => WebhookEventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  eventName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  resourceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  processedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  payload: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WebhookEventOrderByWithRelationInputSchema: z.ZodType<Prisma.WebhookEventOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  eventName: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  processedAt: z.lazy(() => SortOrderSchema).optional(),
  payload: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WebhookEventWhereUniqueInputSchema: z.ZodType<Prisma.WebhookEventWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    eventId: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    eventId: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  eventId: z.string().optional(),
  AND: z.union([ z.lazy(() => WebhookEventWhereInputSchema),z.lazy(() => WebhookEventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WebhookEventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WebhookEventWhereInputSchema),z.lazy(() => WebhookEventWhereInputSchema).array() ]).optional(),
  eventName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  resourceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  processedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  payload: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const WebhookEventOrderByWithAggregationInputSchema: z.ZodType<Prisma.WebhookEventOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  eventName: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  processedAt: z.lazy(() => SortOrderSchema).optional(),
  payload: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WebhookEventCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WebhookEventMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WebhookEventMinOrderByAggregateInputSchema).optional()
}).strict();

export const WebhookEventScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WebhookEventScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WebhookEventScalarWhereWithAggregatesInputSchema),z.lazy(() => WebhookEventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WebhookEventScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WebhookEventScalarWhereWithAggregatesInputSchema),z.lazy(() => WebhookEventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  eventName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  resourceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  processedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  payload: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PaymentHistoryWhereInputSchema: z.ZodType<Prisma.PaymentHistoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentHistoryWhereInputSchema),z.lazy(() => PaymentHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentHistoryWhereInputSchema),z.lazy(() => PaymentHistoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  invoiceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subscriptionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  billingReason: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema),z.lazy(() => PaymentStatusSchema) ]).optional(),
  statusFormatted: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currencyRate: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subtotal: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  discountTotal: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tax: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  taxInclusive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  refundedAmount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  subtotalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  discountTotalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  taxUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  totalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  refundedAmountUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cardLastFour: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  invoiceUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testMode: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  refundedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryOrderByWithRelationInputSchema: z.ZodType<Prisma.PaymentHistoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  invoiceId: z.lazy(() => SortOrderSchema).optional(),
  subscriptionId: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  userEmail: z.lazy(() => SortOrderSchema).optional(),
  billingReason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  statusFormatted: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  currencyRate: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  discountTotal: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxInclusive: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  refundedAmount: z.lazy(() => SortOrderSchema).optional(),
  subtotalUsd: z.lazy(() => SortOrderSchema).optional(),
  discountTotalUsd: z.lazy(() => SortOrderSchema).optional(),
  taxUsd: z.lazy(() => SortOrderSchema).optional(),
  totalUsd: z.lazy(() => SortOrderSchema).optional(),
  refundedAmountUsd: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cardLastFour: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  invoiceUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  testMode: z.lazy(() => SortOrderSchema).optional(),
  refundedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const PaymentHistoryWhereUniqueInputSchema: z.ZodType<Prisma.PaymentHistoryWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    invoiceId: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    invoiceId: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  invoiceId: z.string().optional(),
  AND: z.union([ z.lazy(() => PaymentHistoryWhereInputSchema),z.lazy(() => PaymentHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentHistoryWhereInputSchema),z.lazy(() => PaymentHistoryWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subscriptionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  billingReason: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema),z.lazy(() => PaymentStatusSchema) ]).optional(),
  statusFormatted: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currencyRate: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subtotal: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  discountTotal: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  tax: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  taxInclusive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  refundedAmount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  subtotalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  discountTotalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  taxUsd: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  totalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  refundedAmountUsd: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cardLastFour: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  invoiceUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testMode: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  refundedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const PaymentHistoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.PaymentHistoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  invoiceId: z.lazy(() => SortOrderSchema).optional(),
  subscriptionId: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  userEmail: z.lazy(() => SortOrderSchema).optional(),
  billingReason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  statusFormatted: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  currencyRate: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  discountTotal: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxInclusive: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  refundedAmount: z.lazy(() => SortOrderSchema).optional(),
  subtotalUsd: z.lazy(() => SortOrderSchema).optional(),
  discountTotalUsd: z.lazy(() => SortOrderSchema).optional(),
  taxUsd: z.lazy(() => SortOrderSchema).optional(),
  totalUsd: z.lazy(() => SortOrderSchema).optional(),
  refundedAmountUsd: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cardLastFour: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  invoiceUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  testMode: z.lazy(() => SortOrderSchema).optional(),
  refundedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PaymentHistoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PaymentHistoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PaymentHistoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PaymentHistoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PaymentHistorySumOrderByAggregateInputSchema).optional()
}).strict();

export const PaymentHistoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PaymentHistoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => PaymentHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentHistoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => PaymentHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  invoiceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  subscriptionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userEmail: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  billingReason: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumPaymentStatusWithAggregatesFilterSchema),z.lazy(() => PaymentStatusSchema) ]).optional(),
  statusFormatted: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  currency: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  currencyRate: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  subtotal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  discountTotal: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  tax: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  taxInclusive: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  total: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  refundedAmount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  subtotalUsd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  discountTotalUsd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  taxUsd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  totalUsd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  refundedAmountUsd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  cardLastFour: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  invoiceUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  testMode: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  refundedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationWhereInputSchema: z.ZodType<Prisma.OrganizationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clerkOrgId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  settings: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  users: z.lazy(() => UserListRelationFilterSchema).optional(),
  tickets: z.lazy(() => TicketListRelationFilterSchema).optional()
}).strict();

export const OrganizationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkOrgId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  settings: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  users: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  tickets: z.lazy(() => TicketOrderByRelationAggregateInputSchema).optional()
}).strict();

export const OrganizationWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    clerkOrgId: z.string(),
    slug: z.string()
  }),
  z.object({
    id: z.string().cuid(),
    clerkOrgId: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    slug: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    clerkOrgId: z.string(),
    slug: z.string(),
  }),
  z.object({
    clerkOrgId: z.string(),
  }),
  z.object({
    slug: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string().optional(),
  slug: z.string().optional(),
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  settings: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  users: z.lazy(() => UserListRelationFilterSchema).optional(),
  tickets: z.lazy(() => TicketListRelationFilterSchema).optional()
}).strict());

export const OrganizationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkOrgId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  settings: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  clerkOrgId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  settings: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TicketWhereInputSchema: z.ZodType<Prisma.TicketWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TicketWhereInputSchema),z.lazy(() => TicketWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketWhereInputSchema),z.lazy(() => TicketWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  citizenName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  citizenPhone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  citizenEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  citizenAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => EnumSentimentNullableFilterSchema),z.lazy(() => SentimentSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumTicketStatusFilterSchema),z.lazy(() => TicketStatusSchema) ]).optional(),
  priority: z.union([ z.lazy(() => EnumTicketPriorityFilterSchema),z.lazy(() => TicketPrioritySchema) ]).optional(),
  assignedToId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  publicToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slaDueAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  closedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  aiSummary: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  aiErrorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  assignedTo: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  updates: z.lazy(() => TicketUpdateListRelationFilterSchema).optional(),
  survey: z.union([ z.lazy(() => SatisfactionSurveyNullableScalarRelationFilterSchema),z.lazy(() => SatisfactionSurveyWhereInputSchema) ]).optional().nullable(),
  notifications: z.lazy(() => NotificationQueueListRelationFilterSchema).optional()
}).strict();

export const TicketOrderByWithRelationInputSchema: z.ZodType<Prisma.TicketOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  citizenName: z.lazy(() => SortOrderSchema).optional(),
  citizenPhone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  citizenEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  citizenAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  category: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sentiment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  assignedToId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  publicToken: z.lazy(() => SortOrderSchema).optional(),
  slaDueAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  repliedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  closedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiSummary: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiDraftAnswer: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiSuggestedAssigneeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiConfidenceScore: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiNeedsManualReview: z.lazy(() => SortOrderSchema).optional(),
  aiErrorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  assignedTo: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateOrderByRelationAggregateInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyOrderByWithRelationInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TicketWhereUniqueInputSchema: z.ZodType<Prisma.TicketWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    publicToken: z.string().uuid()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    publicToken: z.string().uuid(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  publicToken: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => TicketWhereInputSchema),z.lazy(() => TicketWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketWhereInputSchema),z.lazy(() => TicketWhereInputSchema).array() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  citizenName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  citizenPhone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  citizenEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  citizenAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => EnumSentimentNullableFilterSchema),z.lazy(() => SentimentSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumTicketStatusFilterSchema),z.lazy(() => TicketStatusSchema) ]).optional(),
  priority: z.union([ z.lazy(() => EnumTicketPriorityFilterSchema),z.lazy(() => TicketPrioritySchema) ]).optional(),
  assignedToId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  slaDueAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  closedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  aiSummary: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  aiErrorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  assignedTo: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  updates: z.lazy(() => TicketUpdateListRelationFilterSchema).optional(),
  survey: z.union([ z.lazy(() => SatisfactionSurveyNullableScalarRelationFilterSchema),z.lazy(() => SatisfactionSurveyWhereInputSchema) ]).optional().nullable(),
  notifications: z.lazy(() => NotificationQueueListRelationFilterSchema).optional()
}).strict());

export const TicketOrderByWithAggregationInputSchema: z.ZodType<Prisma.TicketOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  citizenName: z.lazy(() => SortOrderSchema).optional(),
  citizenPhone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  citizenEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  citizenAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  category: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sentiment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  assignedToId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  publicToken: z.lazy(() => SortOrderSchema).optional(),
  slaDueAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  repliedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  closedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiSummary: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiDraftAnswer: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiSuggestedAssigneeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiConfidenceScore: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiNeedsManualReview: z.lazy(() => SortOrderSchema).optional(),
  aiErrorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TicketCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TicketAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TicketMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TicketMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TicketSumOrderByAggregateInputSchema).optional()
}).strict();

export const TicketScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TicketScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TicketScalarWhereWithAggregatesInputSchema),z.lazy(() => TicketScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketScalarWhereWithAggregatesInputSchema),z.lazy(() => TicketScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  citizenName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  citizenPhone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  citizenEmail: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  citizenAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => EnumSentimentNullableWithAggregatesFilterSchema),z.lazy(() => SentimentSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumTicketStatusWithAggregatesFilterSchema),z.lazy(() => TicketStatusSchema) ]).optional(),
  priority: z.union([ z.lazy(() => EnumTicketPriorityWithAggregatesFilterSchema),z.lazy(() => TicketPrioritySchema) ]).optional(),
  assignedToId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  publicToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slaDueAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  closedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  aiSummary: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  aiErrorMessage: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TicketUpdateWhereInputSchema: z.ZodType<Prisma.TicketUpdateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TicketUpdateWhereInputSchema),z.lazy(() => TicketUpdateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketUpdateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketUpdateWhereInputSchema),z.lazy(() => TicketUpdateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => EnumTicketUpdateTypeFilterSchema),z.lazy(() => TicketUpdateTypeSchema) ]).optional(),
  content: z.lazy(() => JsonFilterSchema).optional(),
  replyText: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ticket: z.union([ z.lazy(() => TicketScalarRelationFilterSchema),z.lazy(() => TicketWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const TicketUpdateOrderByWithRelationInputSchema: z.ZodType<Prisma.TicketUpdateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updateType: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  replyText: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  ticket: z.lazy(() => TicketOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const TicketUpdateWhereUniqueInputSchema: z.ZodType<Prisma.TicketUpdateWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TicketUpdateWhereInputSchema),z.lazy(() => TicketUpdateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketUpdateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketUpdateWhereInputSchema),z.lazy(() => TicketUpdateWhereInputSchema).array() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => EnumTicketUpdateTypeFilterSchema),z.lazy(() => TicketUpdateTypeSchema) ]).optional(),
  content: z.lazy(() => JsonFilterSchema).optional(),
  replyText: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ticket: z.union([ z.lazy(() => TicketScalarRelationFilterSchema),z.lazy(() => TicketWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const TicketUpdateOrderByWithAggregationInputSchema: z.ZodType<Prisma.TicketUpdateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updateType: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  replyText: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TicketUpdateCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TicketUpdateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TicketUpdateMinOrderByAggregateInputSchema).optional()
}).strict();

export const TicketUpdateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TicketUpdateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TicketUpdateScalarWhereWithAggregatesInputSchema),z.lazy(() => TicketUpdateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketUpdateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketUpdateScalarWhereWithAggregatesInputSchema),z.lazy(() => TicketUpdateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => EnumTicketUpdateTypeWithAggregatesFilterSchema),z.lazy(() => TicketUpdateTypeSchema) ]).optional(),
  content: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  replyText: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SatisfactionSurveyWhereInputSchema: z.ZodType<Prisma.SatisfactionSurveyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SatisfactionSurveyWhereInputSchema),z.lazy(() => SatisfactionSurveyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SatisfactionSurveyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SatisfactionSurveyWhereInputSchema),z.lazy(() => SatisfactionSurveyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  feedback: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sentAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  submittedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ticket: z.union([ z.lazy(() => TicketScalarRelationFilterSchema),z.lazy(() => TicketWhereInputSchema) ]).optional(),
}).strict();

export const SatisfactionSurveyOrderByWithRelationInputSchema: z.ZodType<Prisma.SatisfactionSurveyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  feedback: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ticket: z.lazy(() => TicketOrderByWithRelationInputSchema).optional()
}).strict();

export const SatisfactionSurveyWhereUniqueInputSchema: z.ZodType<Prisma.SatisfactionSurveyWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    ticketId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    ticketId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string().optional(),
  AND: z.union([ z.lazy(() => SatisfactionSurveyWhereInputSchema),z.lazy(() => SatisfactionSurveyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SatisfactionSurveyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SatisfactionSurveyWhereInputSchema),z.lazy(() => SatisfactionSurveyWhereInputSchema).array() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  feedback: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sentAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  submittedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ticket: z.union([ z.lazy(() => TicketScalarRelationFilterSchema),z.lazy(() => TicketWhereInputSchema) ]).optional(),
}).strict());

export const SatisfactionSurveyOrderByWithAggregationInputSchema: z.ZodType<Prisma.SatisfactionSurveyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  feedback: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SatisfactionSurveyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SatisfactionSurveyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SatisfactionSurveyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SatisfactionSurveyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SatisfactionSurveySumOrderByAggregateInputSchema).optional()
}).strict();

export const SatisfactionSurveyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SatisfactionSurveyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SatisfactionSurveyScalarWhereWithAggregatesInputSchema),z.lazy(() => SatisfactionSurveyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SatisfactionSurveyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SatisfactionSurveyScalarWhereWithAggregatesInputSchema),z.lazy(() => SatisfactionSurveyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  feedback: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sentAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  submittedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const NotificationQueueWhereInputSchema: z.ZodType<Prisma.NotificationQueueWhereInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationQueueWhereInputSchema),z.lazy(() => NotificationQueueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationQueueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationQueueWhereInputSchema),z.lazy(() => NotificationQueueWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumNotificationTypeFilterSchema),z.lazy(() => NotificationTypeSchema) ]).optional(),
  recipientPhone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  recipientEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  recipientName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  templateData: z.lazy(() => JsonFilterSchema).optional(),
  preferredChannel: z.union([ z.lazy(() => EnumNotificationChannelFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => EnumNotificationChannelNullableFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumNotificationStatusFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  attempts: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  maxAttempts: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  scheduledAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  failedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ticket: z.union([ z.lazy(() => TicketScalarRelationFilterSchema),z.lazy(() => TicketWhereInputSchema) ]).optional(),
  logs: z.lazy(() => NotificationLogListRelationFilterSchema).optional()
}).strict();

export const NotificationQueueOrderByWithRelationInputSchema: z.ZodType<Prisma.NotificationQueueOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  recipientPhone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  recipientEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  templateData: z.lazy(() => SortOrderSchema).optional(),
  preferredChannel: z.lazy(() => SortOrderSchema).optional(),
  currentChannel: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  attempts: z.lazy(() => SortOrderSchema).optional(),
  maxAttempts: z.lazy(() => SortOrderSchema).optional(),
  scheduledAt: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deliveredAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  failedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ticket: z.lazy(() => TicketOrderByWithRelationInputSchema).optional(),
  logs: z.lazy(() => NotificationLogOrderByRelationAggregateInputSchema).optional()
}).strict();

export const NotificationQueueWhereUniqueInputSchema: z.ZodType<Prisma.NotificationQueueWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => NotificationQueueWhereInputSchema),z.lazy(() => NotificationQueueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationQueueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationQueueWhereInputSchema),z.lazy(() => NotificationQueueWhereInputSchema).array() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumNotificationTypeFilterSchema),z.lazy(() => NotificationTypeSchema) ]).optional(),
  recipientPhone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  recipientEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  recipientName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  templateData: z.lazy(() => JsonFilterSchema).optional(),
  preferredChannel: z.union([ z.lazy(() => EnumNotificationChannelFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => EnumNotificationChannelNullableFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumNotificationStatusFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  attempts: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  maxAttempts: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  scheduledAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  failedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ticket: z.union([ z.lazy(() => TicketScalarRelationFilterSchema),z.lazy(() => TicketWhereInputSchema) ]).optional(),
  logs: z.lazy(() => NotificationLogListRelationFilterSchema).optional()
}).strict());

export const NotificationQueueOrderByWithAggregationInputSchema: z.ZodType<Prisma.NotificationQueueOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  recipientPhone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  recipientEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  templateData: z.lazy(() => SortOrderSchema).optional(),
  preferredChannel: z.lazy(() => SortOrderSchema).optional(),
  currentChannel: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  attempts: z.lazy(() => SortOrderSchema).optional(),
  maxAttempts: z.lazy(() => SortOrderSchema).optional(),
  scheduledAt: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deliveredAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  failedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => NotificationQueueCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => NotificationQueueAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => NotificationQueueMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => NotificationQueueMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => NotificationQueueSumOrderByAggregateInputSchema).optional()
}).strict();

export const NotificationQueueScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.NotificationQueueScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationQueueScalarWhereWithAggregatesInputSchema),z.lazy(() => NotificationQueueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationQueueScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationQueueScalarWhereWithAggregatesInputSchema),z.lazy(() => NotificationQueueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumNotificationTypeWithAggregatesFilterSchema),z.lazy(() => NotificationTypeSchema) ]).optional(),
  recipientPhone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  recipientEmail: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  recipientName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  templateData: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  preferredChannel: z.union([ z.lazy(() => EnumNotificationChannelWithAggregatesFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => EnumNotificationChannelNullableWithAggregatesFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumNotificationStatusWithAggregatesFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  attempts: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  maxAttempts: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  scheduledAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  failedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  errorMessage: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const NotificationLogWhereInputSchema: z.ZodType<Prisma.NotificationLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationLogWhereInputSchema),z.lazy(() => NotificationLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationLogWhereInputSchema),z.lazy(() => NotificationLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  queueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channel: z.union([ z.lazy(() => EnumNotificationChannelFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumNotificationStatusFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  requestData: z.lazy(() => JsonNullableFilterSchema).optional(),
  responseData: z.lazy(() => JsonNullableFilterSchema).optional(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attemptNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  responseAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  queue: z.union([ z.lazy(() => NotificationQueueScalarRelationFilterSchema),z.lazy(() => NotificationQueueWhereInputSchema) ]).optional(),
}).strict();

export const NotificationLogOrderByWithRelationInputSchema: z.ZodType<Prisma.NotificationLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  queueId: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requestData: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  responseData: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attemptNumber: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  responseAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  queue: z.lazy(() => NotificationQueueOrderByWithRelationInputSchema).optional()
}).strict();

export const NotificationLogWhereUniqueInputSchema: z.ZodType<Prisma.NotificationLogWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => NotificationLogWhereInputSchema),z.lazy(() => NotificationLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationLogWhereInputSchema),z.lazy(() => NotificationLogWhereInputSchema).array() ]).optional(),
  queueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channel: z.union([ z.lazy(() => EnumNotificationChannelFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumNotificationStatusFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  requestData: z.lazy(() => JsonNullableFilterSchema).optional(),
  responseData: z.lazy(() => JsonNullableFilterSchema).optional(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attemptNumber: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  responseAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  queue: z.union([ z.lazy(() => NotificationQueueScalarRelationFilterSchema),z.lazy(() => NotificationQueueWhereInputSchema) ]).optional(),
}).strict());

export const NotificationLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.NotificationLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  queueId: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requestData: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  responseData: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attemptNumber: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  responseAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => NotificationLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => NotificationLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => NotificationLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => NotificationLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => NotificationLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const NotificationLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.NotificationLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationLogScalarWhereWithAggregatesInputSchema),z.lazy(() => NotificationLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationLogScalarWhereWithAggregatesInputSchema),z.lazy(() => NotificationLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  queueId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  channel: z.union([ z.lazy(() => EnumNotificationChannelWithAggregatesFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumNotificationStatusWithAggregatesFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  requestData: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  responseData: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  errorMessage: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  attemptNumber: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  responseAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutUsersInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneWithoutUsersNestedInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SubscriptionCreateInputSchema: z.ZodType<Prisma.SubscriptionCreateInput> = z.object({
  id: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSubscriptionInputSchema),
  plan: z.lazy(() => PlanCreateNestedOneWithoutSubscriptionsInputSchema)
}).strict();

export const SubscriptionUncheckedCreateInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateInput> = z.object({
  id: z.string(),
  userId: z.string(),
  planId: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SubscriptionUpdateInputSchema: z.ZodType<Prisma.SubscriptionUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSubscriptionNestedInputSchema).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutSubscriptionsNestedInputSchema).optional()
}).strict();

export const SubscriptionUncheckedUpdateInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SubscriptionCreateManyInputSchema: z.ZodType<Prisma.SubscriptionCreateManyInput> = z.object({
  id: z.string(),
  userId: z.string(),
  planId: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SubscriptionUpdateManyMutationInputSchema: z.ZodType<Prisma.SubscriptionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SubscriptionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanCreateInputSchema: z.ZodType<Prisma.PlanCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.boolean().optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lemonSqueezyProductId: z.string(),
  lemonSqueezyVariantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscriptions: z.lazy(() => SubscriptionCreateNestedManyWithoutPlanInputSchema).optional()
}).strict();

export const PlanUncheckedCreateInputSchema: z.ZodType<Prisma.PlanUncheckedCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.boolean().optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lemonSqueezyProductId: z.string(),
  lemonSqueezyVariantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscriptions: z.lazy(() => SubscriptionUncheckedCreateNestedManyWithoutPlanInputSchema).optional()
}).strict();

export const PlanUpdateInputSchema: z.ZodType<Prisma.PlanUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptions: z.lazy(() => SubscriptionUpdateManyWithoutPlanNestedInputSchema).optional()
}).strict();

export const PlanUncheckedUpdateInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptions: z.lazy(() => SubscriptionUncheckedUpdateManyWithoutPlanNestedInputSchema).optional()
}).strict();

export const PlanCreateManyInputSchema: z.ZodType<Prisma.PlanCreateManyInput> = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.boolean().optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lemonSqueezyProductId: z.string(),
  lemonSqueezyVariantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PlanUpdateManyMutationInputSchema: z.ZodType<Prisma.PlanUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WebhookEventCreateInputSchema: z.ZodType<Prisma.WebhookEventCreateInput> = z.object({
  id: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  resourceId: z.string(),
  processedAt: z.coerce.date().optional(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional()
}).strict();

export const WebhookEventUncheckedCreateInputSchema: z.ZodType<Prisma.WebhookEventUncheckedCreateInput> = z.object({
  id: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  resourceId: z.string(),
  processedAt: z.coerce.date().optional(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional()
}).strict();

export const WebhookEventUpdateInputSchema: z.ZodType<Prisma.WebhookEventUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WebhookEventUncheckedUpdateInputSchema: z.ZodType<Prisma.WebhookEventUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WebhookEventCreateManyInputSchema: z.ZodType<Prisma.WebhookEventCreateManyInput> = z.object({
  id: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  resourceId: z.string(),
  processedAt: z.coerce.date().optional(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional()
}).strict();

export const WebhookEventUpdateManyMutationInputSchema: z.ZodType<Prisma.WebhookEventUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WebhookEventUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WebhookEventUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryCreateInputSchema: z.ZodType<Prisma.PaymentHistoryCreateInput> = z.object({
  id: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  customerId: z.string(),
  userEmail: z.string(),
  billingReason: z.string(),
  status: z.lazy(() => PaymentStatusSchema),
  statusFormatted: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  subtotal: z.number().int(),
  discountTotal: z.number().int(),
  tax: z.number().int(),
  taxInclusive: z.boolean(),
  total: z.number().int(),
  refundedAmount: z.number().int().optional(),
  subtotalUsd: z.number().int(),
  discountTotalUsd: z.number().int(),
  taxUsd: z.number().int(),
  totalUsd: z.number().int(),
  refundedAmountUsd: z.number().int().optional(),
  cardBrand: z.string().optional().nullable(),
  cardLastFour: z.string().optional().nullable(),
  invoiceUrl: z.string().optional().nullable(),
  testMode: z.boolean().optional(),
  refundedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutPaymentHistoriesInputSchema)
}).strict();

export const PaymentHistoryUncheckedCreateInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedCreateInput> = z.object({
  id: z.string(),
  userId: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  customerId: z.string(),
  userEmail: z.string(),
  billingReason: z.string(),
  status: z.lazy(() => PaymentStatusSchema),
  statusFormatted: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  subtotal: z.number().int(),
  discountTotal: z.number().int(),
  tax: z.number().int(),
  taxInclusive: z.boolean(),
  total: z.number().int(),
  refundedAmount: z.number().int().optional(),
  subtotalUsd: z.number().int(),
  discountTotalUsd: z.number().int(),
  taxUsd: z.number().int(),
  totalUsd: z.number().int(),
  refundedAmountUsd: z.number().int().optional(),
  cardBrand: z.string().optional().nullable(),
  cardLastFour: z.string().optional().nullable(),
  invoiceUrl: z.string().optional().nullable(),
  testMode: z.boolean().optional(),
  refundedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaymentHistoryUpdateInputSchema: z.ZodType<Prisma.PaymentHistoryUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  invoiceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  billingReason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  statusFormatted: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currencyRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subtotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxInclusive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  subtotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmountUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLastFour: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  invoiceUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testMode: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPaymentHistoriesNestedInputSchema).optional()
}).strict();

export const PaymentHistoryUncheckedUpdateInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  invoiceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  billingReason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  statusFormatted: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currencyRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subtotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxInclusive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  subtotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmountUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLastFour: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  invoiceUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testMode: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryCreateManyInputSchema: z.ZodType<Prisma.PaymentHistoryCreateManyInput> = z.object({
  id: z.string(),
  userId: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  customerId: z.string(),
  userEmail: z.string(),
  billingReason: z.string(),
  status: z.lazy(() => PaymentStatusSchema),
  statusFormatted: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  subtotal: z.number().int(),
  discountTotal: z.number().int(),
  tax: z.number().int(),
  taxInclusive: z.boolean(),
  total: z.number().int(),
  refundedAmount: z.number().int().optional(),
  subtotalUsd: z.number().int(),
  discountTotalUsd: z.number().int(),
  taxUsd: z.number().int(),
  totalUsd: z.number().int(),
  refundedAmountUsd: z.number().int().optional(),
  cardBrand: z.string().optional().nullable(),
  cardLastFour: z.string().optional().nullable(),
  invoiceUrl: z.string().optional().nullable(),
  testMode: z.boolean().optional(),
  refundedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaymentHistoryUpdateManyMutationInputSchema: z.ZodType<Prisma.PaymentHistoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  invoiceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  billingReason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  statusFormatted: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currencyRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subtotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxInclusive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  subtotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmountUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLastFour: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  invoiceUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testMode: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  invoiceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  billingReason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  statusFormatted: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currencyRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subtotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxInclusive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  subtotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmountUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLastFour: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  invoiceUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testMode: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  users: z.lazy(() => UserCreateNestedManyWithoutOrganizationInputSchema).optional(),
  tickets: z.lazy(() => TicketCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  tickets: z.lazy(() => TicketUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  users: z.lazy(() => UserUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  tickets: z.lazy(() => TicketUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  users: z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  tickets: z.lazy(() => TicketUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketCreateInputSchema: z.ZodType<Prisma.TicketCreateInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutTicketsInputSchema),
  assignedTo: z.lazy(() => UserCreateNestedOneWithoutAssignedTicketsInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketUncheckedCreateInputSchema: z.ZodType<Prisma.TicketUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  assignedToId: z.string().optional().nullable(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  updates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketUpdateInputSchema: z.ZodType<Prisma.TicketUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutTicketsNestedInputSchema).optional(),
  assignedTo: z.lazy(() => UserUpdateOneWithoutAssignedTicketsNestedInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  assignedToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketCreateManyInputSchema: z.ZodType<Prisma.TicketCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  assignedToId: z.string().optional().nullable(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TicketUpdateManyMutationInputSchema: z.ZodType<Prisma.TicketUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  assignedToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateCreateInputSchema: z.ZodType<Prisma.TicketUpdateCreateInput> = z.object({
  id: z.string().cuid().optional(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  ticket: z.lazy(() => TicketCreateNestedOneWithoutUpdatesInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutTicketUpdatesInputSchema).optional()
}).strict();

export const TicketUpdateUncheckedCreateInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  userId: z.string().optional().nullable(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const TicketUpdateUpdateInputSchema: z.ZodType<Prisma.TicketUpdateUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ticket: z.lazy(() => TicketUpdateOneRequiredWithoutUpdatesNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutTicketUpdatesNestedInputSchema).optional()
}).strict();

export const TicketUpdateUncheckedUpdateInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateCreateManyInputSchema: z.ZodType<Prisma.TicketUpdateCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  userId: z.string().optional().nullable(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const TicketUpdateUpdateManyMutationInputSchema: z.ZodType<Prisma.TicketUpdateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SatisfactionSurveyCreateInputSchema: z.ZodType<Prisma.SatisfactionSurveyCreateInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  feedback: z.string().optional().nullable(),
  sentAt: z.coerce.date().optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ticket: z.lazy(() => TicketCreateNestedOneWithoutSurveyInputSchema)
}).strict();

export const SatisfactionSurveyUncheckedCreateInputSchema: z.ZodType<Prisma.SatisfactionSurveyUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  rating: z.number().int(),
  feedback: z.string().optional().nullable(),
  sentAt: z.coerce.date().optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SatisfactionSurveyUpdateInputSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  feedback: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ticket: z.lazy(() => TicketUpdateOneRequiredWithoutSurveyNestedInputSchema).optional()
}).strict();

export const SatisfactionSurveyUncheckedUpdateInputSchema: z.ZodType<Prisma.SatisfactionSurveyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  feedback: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SatisfactionSurveyCreateManyInputSchema: z.ZodType<Prisma.SatisfactionSurveyCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  rating: z.number().int(),
  feedback: z.string().optional().nullable(),
  sentAt: z.coerce.date().optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SatisfactionSurveyUpdateManyMutationInputSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  feedback: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SatisfactionSurveyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SatisfactionSurveyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  feedback: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationQueueCreateInputSchema: z.ZodType<Prisma.NotificationQueueCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ticket: z.lazy(() => TicketCreateNestedOneWithoutNotificationsInputSchema),
  logs: z.lazy(() => NotificationLogCreateNestedManyWithoutQueueInputSchema).optional()
}).strict();

export const NotificationQueueUncheckedCreateInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  logs: z.lazy(() => NotificationLogUncheckedCreateNestedManyWithoutQueueInputSchema).optional()
}).strict();

export const NotificationQueueUpdateInputSchema: z.ZodType<Prisma.NotificationQueueUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ticket: z.lazy(() => TicketUpdateOneRequiredWithoutNotificationsNestedInputSchema).optional(),
  logs: z.lazy(() => NotificationLogUpdateManyWithoutQueueNestedInputSchema).optional()
}).strict();

export const NotificationQueueUncheckedUpdateInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  logs: z.lazy(() => NotificationLogUncheckedUpdateManyWithoutQueueNestedInputSchema).optional()
}).strict();

export const NotificationQueueCreateManyInputSchema: z.ZodType<Prisma.NotificationQueueCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const NotificationQueueUpdateManyMutationInputSchema: z.ZodType<Prisma.NotificationQueueUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationQueueUncheckedUpdateManyInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationLogCreateInputSchema: z.ZodType<Prisma.NotificationLogCreateInput> = z.object({
  id: z.string().cuid().optional(),
  channel: z.lazy(() => NotificationChannelSchema),
  status: z.lazy(() => NotificationStatusSchema),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.string().optional().nullable(),
  attemptNumber: z.number().int(),
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  queue: z.lazy(() => NotificationQueueCreateNestedOneWithoutLogsInputSchema)
}).strict();

export const NotificationLogUncheckedCreateInputSchema: z.ZodType<Prisma.NotificationLogUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  queueId: z.string(),
  channel: z.lazy(() => NotificationChannelSchema),
  status: z.lazy(() => NotificationStatusSchema),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.string().optional().nullable(),
  attemptNumber: z.number().int(),
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const NotificationLogUpdateInputSchema: z.ZodType<Prisma.NotificationLogUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attemptNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  queue: z.lazy(() => NotificationQueueUpdateOneRequiredWithoutLogsNestedInputSchema).optional()
}).strict();

export const NotificationLogUncheckedUpdateInputSchema: z.ZodType<Prisma.NotificationLogUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  queueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attemptNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationLogCreateManyInputSchema: z.ZodType<Prisma.NotificationLogCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  queueId: z.string(),
  channel: z.lazy(() => NotificationChannelSchema),
  status: z.lazy(() => NotificationStatusSchema),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.string().optional().nullable(),
  attemptNumber: z.number().int(),
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const NotificationLogUpdateManyMutationInputSchema: z.ZodType<Prisma.NotificationLogUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attemptNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.NotificationLogUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  queueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attemptNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const OrganizationNullableScalarRelationFilterSchema: z.ZodType<Prisma.OrganizationNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional().nullable()
}).strict();

export const SubscriptionNullableScalarRelationFilterSchema: z.ZodType<Prisma.SubscriptionNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => SubscriptionWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SubscriptionWhereInputSchema).optional().nullable()
}).strict();

export const PaymentHistoryListRelationFilterSchema: z.ZodType<Prisma.PaymentHistoryListRelationFilter> = z.object({
  every: z.lazy(() => PaymentHistoryWhereInputSchema).optional(),
  some: z.lazy(() => PaymentHistoryWhereInputSchema).optional(),
  none: z.lazy(() => PaymentHistoryWhereInputSchema).optional()
}).strict();

export const TicketListRelationFilterSchema: z.ZodType<Prisma.TicketListRelationFilter> = z.object({
  every: z.lazy(() => TicketWhereInputSchema).optional(),
  some: z.lazy(() => TicketWhereInputSchema).optional(),
  none: z.lazy(() => TicketWhereInputSchema).optional()
}).strict();

export const TicketUpdateListRelationFilterSchema: z.ZodType<Prisma.TicketUpdateListRelationFilter> = z.object({
  every: z.lazy(() => TicketUpdateWhereInputSchema).optional(),
  some: z.lazy(() => TicketUpdateWhereInputSchema).optional(),
  none: z.lazy(() => TicketUpdateWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const PaymentHistoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PaymentHistoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TicketOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketUpdateOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TicketUpdateOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const EnumSubscriptionStatusFilterSchema: z.ZodType<Prisma.EnumSubscriptionStatusFilter> = z.object({
  equals: z.lazy(() => SubscriptionStatusSchema).optional(),
  in: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => NestedEnumSubscriptionStatusFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumSubscriptionPaymentMethodFilterSchema: z.ZodType<Prisma.EnumSubscriptionPaymentMethodFilter> = z.object({
  equals: z.lazy(() => SubscriptionPaymentMethodSchema).optional(),
  in: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => NestedEnumSubscriptionPaymentMethodFilterSchema) ]).optional(),
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const PlanScalarRelationFilterSchema: z.ZodType<Prisma.PlanScalarRelationFilter> = z.object({
  is: z.lazy(() => PlanWhereInputSchema).optional(),
  isNot: z.lazy(() => PlanWhereInputSchema).optional()
}).strict();

export const SubscriptionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyId: z.lazy(() => SortOrderSchema).optional(),
  lemonSubscriptionItemId: z.lazy(() => SortOrderSchema).optional(),
  lemonCustomerId: z.lazy(() => SortOrderSchema).optional(),
  lemonOrderId: z.lazy(() => SortOrderSchema).optional(),
  lemonProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonVariantId: z.lazy(() => SortOrderSchema).optional(),
  renewsAt: z.lazy(() => SortOrderSchema).optional(),
  endsAt: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.lazy(() => SortOrderSchema).optional(),
  cardLast4: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubscriptionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyId: z.lazy(() => SortOrderSchema).optional(),
  lemonSubscriptionItemId: z.lazy(() => SortOrderSchema).optional(),
  lemonCustomerId: z.lazy(() => SortOrderSchema).optional(),
  lemonOrderId: z.lazy(() => SortOrderSchema).optional(),
  lemonProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonVariantId: z.lazy(() => SortOrderSchema).optional(),
  renewsAt: z.lazy(() => SortOrderSchema).optional(),
  endsAt: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.lazy(() => SortOrderSchema).optional(),
  cardLast4: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubscriptionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SubscriptionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  planId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyId: z.lazy(() => SortOrderSchema).optional(),
  lemonSubscriptionItemId: z.lazy(() => SortOrderSchema).optional(),
  lemonCustomerId: z.lazy(() => SortOrderSchema).optional(),
  lemonOrderId: z.lazy(() => SortOrderSchema).optional(),
  lemonProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonVariantId: z.lazy(() => SortOrderSchema).optional(),
  renewsAt: z.lazy(() => SortOrderSchema).optional(),
  endsAt: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.lazy(() => SortOrderSchema).optional(),
  cardLast4: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSubscriptionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSubscriptionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SubscriptionStatusSchema).optional(),
  in: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => NestedEnumSubscriptionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSubscriptionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSubscriptionStatusFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const EnumSubscriptionPaymentMethodWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSubscriptionPaymentMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SubscriptionPaymentMethodSchema).optional(),
  in: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => NestedEnumSubscriptionPaymentMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSubscriptionPaymentMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSubscriptionPaymentMethodFilterSchema).optional()
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const SubscriptionListRelationFilterSchema: z.ZodType<Prisma.SubscriptionListRelationFilter> = z.object({
  every: z.lazy(() => SubscriptionWhereInputSchema).optional(),
  some: z.lazy(() => SubscriptionWhereInputSchema).optional(),
  none: z.lazy(() => SubscriptionWhereInputSchema).optional()
}).strict();

export const SubscriptionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SubscriptionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanCountOrderByAggregateInputSchema: z.ZodType<Prisma.PlanCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  available: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyVariantId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PlanAvgOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PlanMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  available: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyVariantId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanMinOrderByAggregateInputSchema: z.ZodType<Prisma.PlanMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  available: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyProductId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyVariantId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlanSumOrderByAggregateInputSchema: z.ZodType<Prisma.PlanSumOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const WebhookEventCountOrderByAggregateInputSchema: z.ZodType<Prisma.WebhookEventCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  eventName: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  processedAt: z.lazy(() => SortOrderSchema).optional(),
  payload: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WebhookEventMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WebhookEventMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  eventName: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  processedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WebhookEventMinOrderByAggregateInputSchema: z.ZodType<Prisma.WebhookEventMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  eventName: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  processedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const EnumPaymentStatusFilterSchema: z.ZodType<Prisma.EnumPaymentStatusFilter> = z.object({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => NestedEnumPaymentStatusFilterSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const PaymentHistoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentHistoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  invoiceId: z.lazy(() => SortOrderSchema).optional(),
  subscriptionId: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  userEmail: z.lazy(() => SortOrderSchema).optional(),
  billingReason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  statusFormatted: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  currencyRate: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  discountTotal: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxInclusive: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  refundedAmount: z.lazy(() => SortOrderSchema).optional(),
  subtotalUsd: z.lazy(() => SortOrderSchema).optional(),
  discountTotalUsd: z.lazy(() => SortOrderSchema).optional(),
  taxUsd: z.lazy(() => SortOrderSchema).optional(),
  totalUsd: z.lazy(() => SortOrderSchema).optional(),
  refundedAmountUsd: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.lazy(() => SortOrderSchema).optional(),
  cardLastFour: z.lazy(() => SortOrderSchema).optional(),
  invoiceUrl: z.lazy(() => SortOrderSchema).optional(),
  testMode: z.lazy(() => SortOrderSchema).optional(),
  refundedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentHistoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentHistoryAvgOrderByAggregateInput> = z.object({
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  discountTotal: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  refundedAmount: z.lazy(() => SortOrderSchema).optional(),
  subtotalUsd: z.lazy(() => SortOrderSchema).optional(),
  discountTotalUsd: z.lazy(() => SortOrderSchema).optional(),
  taxUsd: z.lazy(() => SortOrderSchema).optional(),
  totalUsd: z.lazy(() => SortOrderSchema).optional(),
  refundedAmountUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentHistoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentHistoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  invoiceId: z.lazy(() => SortOrderSchema).optional(),
  subscriptionId: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  userEmail: z.lazy(() => SortOrderSchema).optional(),
  billingReason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  statusFormatted: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  currencyRate: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  discountTotal: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxInclusive: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  refundedAmount: z.lazy(() => SortOrderSchema).optional(),
  subtotalUsd: z.lazy(() => SortOrderSchema).optional(),
  discountTotalUsd: z.lazy(() => SortOrderSchema).optional(),
  taxUsd: z.lazy(() => SortOrderSchema).optional(),
  totalUsd: z.lazy(() => SortOrderSchema).optional(),
  refundedAmountUsd: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.lazy(() => SortOrderSchema).optional(),
  cardLastFour: z.lazy(() => SortOrderSchema).optional(),
  invoiceUrl: z.lazy(() => SortOrderSchema).optional(),
  testMode: z.lazy(() => SortOrderSchema).optional(),
  refundedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentHistoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentHistoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  invoiceId: z.lazy(() => SortOrderSchema).optional(),
  subscriptionId: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  userEmail: z.lazy(() => SortOrderSchema).optional(),
  billingReason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  statusFormatted: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  currencyRate: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  discountTotal: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxInclusive: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  refundedAmount: z.lazy(() => SortOrderSchema).optional(),
  subtotalUsd: z.lazy(() => SortOrderSchema).optional(),
  discountTotalUsd: z.lazy(() => SortOrderSchema).optional(),
  taxUsd: z.lazy(() => SortOrderSchema).optional(),
  totalUsd: z.lazy(() => SortOrderSchema).optional(),
  refundedAmountUsd: z.lazy(() => SortOrderSchema).optional(),
  cardBrand: z.lazy(() => SortOrderSchema).optional(),
  cardLastFour: z.lazy(() => SortOrderSchema).optional(),
  invoiceUrl: z.lazy(() => SortOrderSchema).optional(),
  testMode: z.lazy(() => SortOrderSchema).optional(),
  refundedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentHistorySumOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentHistorySumOrderByAggregateInput> = z.object({
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  discountTotal: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  refundedAmount: z.lazy(() => SortOrderSchema).optional(),
  subtotalUsd: z.lazy(() => SortOrderSchema).optional(),
  discountTotalUsd: z.lazy(() => SortOrderSchema).optional(),
  taxUsd: z.lazy(() => SortOrderSchema).optional(),
  totalUsd: z.lazy(() => SortOrderSchema).optional(),
  refundedAmountUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPaymentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => NestedEnumPaymentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkOrgId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkOrgId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkOrgId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSentimentNullableFilterSchema: z.ZodType<Prisma.EnumSentimentNullableFilter> = z.object({
  equals: z.lazy(() => SentimentSchema).optional().nullable(),
  in: z.lazy(() => SentimentSchema).array().optional().nullable(),
  notIn: z.lazy(() => SentimentSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NestedEnumSentimentNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumTicketStatusFilterSchema: z.ZodType<Prisma.EnumTicketStatusFilter> = z.object({
  equals: z.lazy(() => TicketStatusSchema).optional(),
  in: z.lazy(() => TicketStatusSchema).array().optional(),
  notIn: z.lazy(() => TicketStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => NestedEnumTicketStatusFilterSchema) ]).optional(),
}).strict();

export const EnumTicketPriorityFilterSchema: z.ZodType<Prisma.EnumTicketPriorityFilter> = z.object({
  equals: z.lazy(() => TicketPrioritySchema).optional(),
  in: z.lazy(() => TicketPrioritySchema).array().optional(),
  notIn: z.lazy(() => TicketPrioritySchema).array().optional(),
  not: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => NestedEnumTicketPriorityFilterSchema) ]).optional(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const OrganizationScalarRelationFilterSchema: z.ZodType<Prisma.OrganizationScalarRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const SatisfactionSurveyNullableScalarRelationFilterSchema: z.ZodType<Prisma.SatisfactionSurveyNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => SatisfactionSurveyWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SatisfactionSurveyWhereInputSchema).optional().nullable()
}).strict();

export const NotificationQueueListRelationFilterSchema: z.ZodType<Prisma.NotificationQueueListRelationFilter> = z.object({
  every: z.lazy(() => NotificationQueueWhereInputSchema).optional(),
  some: z.lazy(() => NotificationQueueWhereInputSchema).optional(),
  none: z.lazy(() => NotificationQueueWhereInputSchema).optional()
}).strict();

export const NotificationQueueOrderByRelationAggregateInputSchema: z.ZodType<Prisma.NotificationQueueOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketCountOrderByAggregateInputSchema: z.ZodType<Prisma.TicketCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  citizenName: z.lazy(() => SortOrderSchema).optional(),
  citizenPhone: z.lazy(() => SortOrderSchema).optional(),
  citizenEmail: z.lazy(() => SortOrderSchema).optional(),
  citizenAddress: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  sentiment: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  assignedToId: z.lazy(() => SortOrderSchema).optional(),
  publicToken: z.lazy(() => SortOrderSchema).optional(),
  slaDueAt: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional(),
  closedAt: z.lazy(() => SortOrderSchema).optional(),
  aiSummary: z.lazy(() => SortOrderSchema).optional(),
  aiDraftAnswer: z.lazy(() => SortOrderSchema).optional(),
  aiSuggestedAssigneeId: z.lazy(() => SortOrderSchema).optional(),
  aiConfidenceScore: z.lazy(() => SortOrderSchema).optional(),
  aiNeedsManualReview: z.lazy(() => SortOrderSchema).optional(),
  aiErrorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TicketAvgOrderByAggregateInput> = z.object({
  aiConfidenceScore: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TicketMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  citizenName: z.lazy(() => SortOrderSchema).optional(),
  citizenPhone: z.lazy(() => SortOrderSchema).optional(),
  citizenEmail: z.lazy(() => SortOrderSchema).optional(),
  citizenAddress: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  sentiment: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  assignedToId: z.lazy(() => SortOrderSchema).optional(),
  publicToken: z.lazy(() => SortOrderSchema).optional(),
  slaDueAt: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional(),
  closedAt: z.lazy(() => SortOrderSchema).optional(),
  aiSummary: z.lazy(() => SortOrderSchema).optional(),
  aiDraftAnswer: z.lazy(() => SortOrderSchema).optional(),
  aiSuggestedAssigneeId: z.lazy(() => SortOrderSchema).optional(),
  aiConfidenceScore: z.lazy(() => SortOrderSchema).optional(),
  aiNeedsManualReview: z.lazy(() => SortOrderSchema).optional(),
  aiErrorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketMinOrderByAggregateInputSchema: z.ZodType<Prisma.TicketMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  citizenName: z.lazy(() => SortOrderSchema).optional(),
  citizenPhone: z.lazy(() => SortOrderSchema).optional(),
  citizenEmail: z.lazy(() => SortOrderSchema).optional(),
  citizenAddress: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  sentiment: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  assignedToId: z.lazy(() => SortOrderSchema).optional(),
  publicToken: z.lazy(() => SortOrderSchema).optional(),
  slaDueAt: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional(),
  closedAt: z.lazy(() => SortOrderSchema).optional(),
  aiSummary: z.lazy(() => SortOrderSchema).optional(),
  aiDraftAnswer: z.lazy(() => SortOrderSchema).optional(),
  aiSuggestedAssigneeId: z.lazy(() => SortOrderSchema).optional(),
  aiConfidenceScore: z.lazy(() => SortOrderSchema).optional(),
  aiNeedsManualReview: z.lazy(() => SortOrderSchema).optional(),
  aiErrorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketSumOrderByAggregateInputSchema: z.ZodType<Prisma.TicketSumOrderByAggregateInput> = z.object({
  aiConfidenceScore: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSentimentNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSentimentNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SentimentSchema).optional().nullable(),
  in: z.lazy(() => SentimentSchema).array().optional().nullable(),
  notIn: z.lazy(() => SentimentSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NestedEnumSentimentNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSentimentNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSentimentNullableFilterSchema).optional()
}).strict();

export const EnumTicketStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTicketStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TicketStatusSchema).optional(),
  in: z.lazy(() => TicketStatusSchema).array().optional(),
  notIn: z.lazy(() => TicketStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => NestedEnumTicketStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTicketStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTicketStatusFilterSchema).optional()
}).strict();

export const EnumTicketPriorityWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTicketPriorityWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TicketPrioritySchema).optional(),
  in: z.lazy(() => TicketPrioritySchema).array().optional(),
  notIn: z.lazy(() => TicketPrioritySchema).array().optional(),
  not: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => NestedEnumTicketPriorityWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTicketPriorityFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTicketPriorityFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const EnumTicketUpdateTypeFilterSchema: z.ZodType<Prisma.EnumTicketUpdateTypeFilter> = z.object({
  equals: z.lazy(() => TicketUpdateTypeSchema).optional(),
  in: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  notIn: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => NestedEnumTicketUpdateTypeFilterSchema) ]).optional(),
}).strict();

export const TicketScalarRelationFilterSchema: z.ZodType<Prisma.TicketScalarRelationFilter> = z.object({
  is: z.lazy(() => TicketWhereInputSchema).optional(),
  isNot: z.lazy(() => TicketWhereInputSchema).optional()
}).strict();

export const TicketUpdateCountOrderByAggregateInputSchema: z.ZodType<Prisma.TicketUpdateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  updateType: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  replyText: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketUpdateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TicketUpdateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  updateType: z.lazy(() => SortOrderSchema).optional(),
  replyText: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TicketUpdateMinOrderByAggregateInputSchema: z.ZodType<Prisma.TicketUpdateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  updateType: z.lazy(() => SortOrderSchema).optional(),
  replyText: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTicketUpdateTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTicketUpdateTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TicketUpdateTypeSchema).optional(),
  in: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  notIn: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => NestedEnumTicketUpdateTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTicketUpdateTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTicketUpdateTypeFilterSchema).optional()
}).strict();

export const SatisfactionSurveyCountOrderByAggregateInputSchema: z.ZodType<Prisma.SatisfactionSurveyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  feedback: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SatisfactionSurveyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SatisfactionSurveyAvgOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SatisfactionSurveyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SatisfactionSurveyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  feedback: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SatisfactionSurveyMinOrderByAggregateInputSchema: z.ZodType<Prisma.SatisfactionSurveyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  feedback: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SatisfactionSurveySumOrderByAggregateInputSchema: z.ZodType<Prisma.SatisfactionSurveySumOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumNotificationTypeFilterSchema: z.ZodType<Prisma.EnumNotificationTypeFilter> = z.object({
  equals: z.lazy(() => NotificationTypeSchema).optional(),
  in: z.lazy(() => NotificationTypeSchema).array().optional(),
  notIn: z.lazy(() => NotificationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => NestedEnumNotificationTypeFilterSchema) ]).optional(),
}).strict();

export const EnumNotificationChannelFilterSchema: z.ZodType<Prisma.EnumNotificationChannelFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional(),
  in: z.lazy(() => NotificationChannelSchema).array().optional(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelFilterSchema) ]).optional(),
}).strict();

export const EnumNotificationChannelNullableFilterSchema: z.ZodType<Prisma.EnumNotificationChannelNullableFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  in: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumNotificationStatusFilterSchema: z.ZodType<Prisma.EnumNotificationStatusFilter> = z.object({
  equals: z.lazy(() => NotificationStatusSchema).optional(),
  in: z.lazy(() => NotificationStatusSchema).array().optional(),
  notIn: z.lazy(() => NotificationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => NestedEnumNotificationStatusFilterSchema) ]).optional(),
}).strict();

export const NotificationLogListRelationFilterSchema: z.ZodType<Prisma.NotificationLogListRelationFilter> = z.object({
  every: z.lazy(() => NotificationLogWhereInputSchema).optional(),
  some: z.lazy(() => NotificationLogWhereInputSchema).optional(),
  none: z.lazy(() => NotificationLogWhereInputSchema).optional()
}).strict();

export const NotificationLogOrderByRelationAggregateInputSchema: z.ZodType<Prisma.NotificationLogOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationQueueCountOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationQueueCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  recipientPhone: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  templateData: z.lazy(() => SortOrderSchema).optional(),
  preferredChannel: z.lazy(() => SortOrderSchema).optional(),
  currentChannel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  attempts: z.lazy(() => SortOrderSchema).optional(),
  maxAttempts: z.lazy(() => SortOrderSchema).optional(),
  scheduledAt: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.lazy(() => SortOrderSchema).optional(),
  failedAt: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationQueueAvgOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationQueueAvgOrderByAggregateInput> = z.object({
  attempts: z.lazy(() => SortOrderSchema).optional(),
  maxAttempts: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationQueueMaxOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationQueueMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  recipientPhone: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  preferredChannel: z.lazy(() => SortOrderSchema).optional(),
  currentChannel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  attempts: z.lazy(() => SortOrderSchema).optional(),
  maxAttempts: z.lazy(() => SortOrderSchema).optional(),
  scheduledAt: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.lazy(() => SortOrderSchema).optional(),
  failedAt: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationQueueMinOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationQueueMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ticketId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  recipientPhone: z.lazy(() => SortOrderSchema).optional(),
  recipientEmail: z.lazy(() => SortOrderSchema).optional(),
  recipientName: z.lazy(() => SortOrderSchema).optional(),
  preferredChannel: z.lazy(() => SortOrderSchema).optional(),
  currentChannel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  attempts: z.lazy(() => SortOrderSchema).optional(),
  maxAttempts: z.lazy(() => SortOrderSchema).optional(),
  scheduledAt: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.lazy(() => SortOrderSchema).optional(),
  failedAt: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationQueueSumOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationQueueSumOrderByAggregateInput> = z.object({
  attempts: z.lazy(() => SortOrderSchema).optional(),
  maxAttempts: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumNotificationTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumNotificationTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationTypeSchema).optional(),
  in: z.lazy(() => NotificationTypeSchema).array().optional(),
  notIn: z.lazy(() => NotificationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => NestedEnumNotificationTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationTypeFilterSchema).optional()
}).strict();

export const EnumNotificationChannelWithAggregatesFilterSchema: z.ZodType<Prisma.EnumNotificationChannelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional(),
  in: z.lazy(() => NotificationChannelSchema).array().optional(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationChannelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationChannelFilterSchema).optional()
}).strict();

export const EnumNotificationChannelNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumNotificationChannelNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  in: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationChannelNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationChannelNullableFilterSchema).optional()
}).strict();

export const EnumNotificationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumNotificationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationStatusSchema).optional(),
  in: z.lazy(() => NotificationStatusSchema).array().optional(),
  notIn: z.lazy(() => NotificationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => NestedEnumNotificationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationStatusFilterSchema).optional()
}).strict();

export const NotificationQueueScalarRelationFilterSchema: z.ZodType<Prisma.NotificationQueueScalarRelationFilter> = z.object({
  is: z.lazy(() => NotificationQueueWhereInputSchema).optional(),
  isNot: z.lazy(() => NotificationQueueWhereInputSchema).optional()
}).strict();

export const NotificationLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  queueId: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requestData: z.lazy(() => SortOrderSchema).optional(),
  responseData: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  attemptNumber: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  responseAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationLogAvgOrderByAggregateInput> = z.object({
  attemptNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  queueId: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  attemptNumber: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  responseAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  queueId: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  errorMessage: z.lazy(() => SortOrderSchema).optional(),
  attemptNumber: z.lazy(() => SortOrderSchema).optional(),
  sentAt: z.lazy(() => SortOrderSchema).optional(),
  responseAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NotificationLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationLogSumOrderByAggregateInput> = z.object({
  attemptNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutUsersInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUsersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutUsersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const SubscriptionCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional()
}).strict();

export const PaymentHistoryCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentHistoryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TicketCreateNestedManyWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketCreateNestedManyWithoutAssignedToInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutAssignedToInputSchema),z.lazy(() => TicketCreateWithoutAssignedToInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema),z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyAssignedToInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateWithoutUserInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional()
}).strict();

export const PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentHistoryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TicketUncheckedCreateNestedManyWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUncheckedCreateNestedManyWithoutAssignedToInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutAssignedToInputSchema),z.lazy(() => TicketCreateWithoutAssignedToInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema),z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyAssignedToInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateWithoutUserInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRoleSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const OrganizationUpdateOneWithoutUsersNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneWithoutUsersNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUsersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutUsersInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutUsersInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutUsersInputSchema),z.lazy(() => OrganizationUpdateWithoutUsersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUsersInputSchema) ]).optional(),
}).strict();

export const SubscriptionUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.SubscriptionUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => SubscriptionUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SubscriptionUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PaymentHistoryUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentHistoryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentHistoryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentHistoryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentHistoryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentHistoryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentHistoryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PaymentHistoryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentHistoryScalarWhereInputSchema),z.lazy(() => PaymentHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateManyWithoutAssignedToNestedInputSchema: z.ZodType<Prisma.TicketUpdateManyWithoutAssignedToNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutAssignedToInputSchema),z.lazy(() => TicketCreateWithoutAssignedToInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema),z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpsertWithWhereUniqueWithoutAssignedToInputSchema),z.lazy(() => TicketUpsertWithWhereUniqueWithoutAssignedToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyAssignedToInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateWithWhereUniqueWithoutAssignedToInputSchema),z.lazy(() => TicketUpdateWithWhereUniqueWithoutAssignedToInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateManyWithWhereWithoutAssignedToInputSchema),z.lazy(() => TicketUpdateManyWithWhereWithoutAssignedToInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketScalarWhereInputSchema),z.lazy(() => TicketScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TicketUpdateUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateWithoutUserInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketUpdateScalarWhereInputSchema),z.lazy(() => TicketUpdateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => SubscriptionUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SubscriptionWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SubscriptionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SubscriptionUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentHistoryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentHistoryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentHistoryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentHistoryWhereUniqueInputSchema),z.lazy(() => PaymentHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentHistoryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentHistoryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentHistoryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PaymentHistoryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentHistoryScalarWhereInputSchema),z.lazy(() => PaymentHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketUncheckedUpdateManyWithoutAssignedToNestedInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateManyWithoutAssignedToNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutAssignedToInputSchema),z.lazy(() => TicketCreateWithoutAssignedToInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema),z.lazy(() => TicketCreateOrConnectWithoutAssignedToInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpsertWithWhereUniqueWithoutAssignedToInputSchema),z.lazy(() => TicketUpsertWithWhereUniqueWithoutAssignedToInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyAssignedToInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateWithWhereUniqueWithoutAssignedToInputSchema),z.lazy(() => TicketUpdateWithWhereUniqueWithoutAssignedToInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateManyWithWhereWithoutAssignedToInputSchema),z.lazy(() => TicketUpdateManyWithWhereWithoutAssignedToInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketScalarWhereInputSchema),z.lazy(() => TicketScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateWithoutUserInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketUpdateScalarWhereInputSchema),z.lazy(() => TicketUpdateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSubscriptionInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubscriptionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const PlanCreateNestedOneWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanCreateNestedOneWithoutSubscriptionsInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutSubscriptionsInputSchema),z.lazy(() => PlanUncheckedCreateWithoutSubscriptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlanCreateOrConnectWithoutSubscriptionsInputSchema).optional(),
  connect: z.lazy(() => PlanWhereUniqueInputSchema).optional()
}).strict();

export const EnumSubscriptionStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SubscriptionStatusSchema).optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSubscriptionPaymentMethodFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SubscriptionPaymentMethodSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSubscriptionNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSubscriptionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubscriptionInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSubscriptionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSubscriptionInputSchema),z.lazy(() => UserUpdateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubscriptionInputSchema) ]).optional(),
}).strict();

export const PlanUpdateOneRequiredWithoutSubscriptionsNestedInputSchema: z.ZodType<Prisma.PlanUpdateOneRequiredWithoutSubscriptionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlanCreateWithoutSubscriptionsInputSchema),z.lazy(() => PlanUncheckedCreateWithoutSubscriptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlanCreateOrConnectWithoutSubscriptionsInputSchema).optional(),
  upsert: z.lazy(() => PlanUpsertWithoutSubscriptionsInputSchema).optional(),
  connect: z.lazy(() => PlanWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlanUpdateToOneWithWhereWithoutSubscriptionsInputSchema),z.lazy(() => PlanUpdateWithoutSubscriptionsInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutSubscriptionsInputSchema) ]).optional(),
}).strict();

export const SubscriptionCreateNestedManyWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionCreateNestedManyWithoutPlanInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateWithoutPlanInputSchema).array(),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubscriptionCreateManyPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SubscriptionUncheckedCreateNestedManyWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateNestedManyWithoutPlanInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateWithoutPlanInputSchema).array(),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubscriptionCreateManyPlanInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const SubscriptionUpdateManyWithoutPlanNestedInputSchema: z.ZodType<Prisma.SubscriptionUpdateManyWithoutPlanNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateWithoutPlanInputSchema).array(),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubscriptionCreateManyPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubscriptionUpdateManyWithWhereWithoutPlanInputSchema),z.lazy(() => SubscriptionUpdateManyWithWhereWithoutPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubscriptionScalarWhereInputSchema),z.lazy(() => SubscriptionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SubscriptionUncheckedUpdateManyWithoutPlanNestedInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateManyWithoutPlanNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateWithoutPlanInputSchema).array(),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema),z.lazy(() => SubscriptionCreateOrConnectWithoutPlanInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubscriptionCreateManyPlanInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubscriptionWhereUniqueInputSchema),z.lazy(() => SubscriptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutPlanInputSchema),z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutPlanInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubscriptionUpdateManyWithWhereWithoutPlanInputSchema),z.lazy(() => SubscriptionUpdateManyWithWhereWithoutPlanInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubscriptionScalarWhereInputSchema),z.lazy(() => SubscriptionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPaymentHistoriesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPaymentHistoriesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumPaymentStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPaymentStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PaymentStatusSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutPaymentHistoriesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPaymentHistoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPaymentHistoriesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPaymentHistoriesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUpdateWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentHistoriesInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TicketCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutOrganizationInputSchema),z.lazy(() => TicketCreateWithoutOrganizationInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TicketUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutOrganizationInputSchema),z.lazy(() => TicketCreateWithoutOrganizationInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.TicketUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutOrganizationInputSchema),z.lazy(() => TicketCreateWithoutOrganizationInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => TicketUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => TicketUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => TicketUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketScalarWhereInputSchema),z.lazy(() => TicketScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutOrganizationInputSchema),z.lazy(() => TicketCreateWithoutOrganizationInputSchema).array(),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => TicketCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => TicketUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketWhereUniqueInputSchema),z.lazy(() => TicketWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => TicketUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => TicketUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketScalarWhereInputSchema),z.lazy(() => TicketScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutTicketsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutTicketsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutTicketsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutTicketsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedTicketsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAssignedTicketsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssignedTicketsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedTicketsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const TicketUpdateCreateNestedManyWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateCreateNestedManyWithoutTicketInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyTicketInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SatisfactionSurveyCreateNestedOneWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyCreateNestedOneWithoutTicketInput> = z.object({
  create: z.union([ z.lazy(() => SatisfactionSurveyCreateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedCreateWithoutTicketInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SatisfactionSurveyCreateOrConnectWithoutTicketInputSchema).optional(),
  connect: z.lazy(() => SatisfactionSurveyWhereUniqueInputSchema).optional()
}).strict();

export const NotificationQueueCreateNestedManyWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueCreateNestedManyWithoutTicketInput> = z.object({
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema).array(),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationQueueCreateManyTicketInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateUncheckedCreateNestedManyWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedCreateNestedManyWithoutTicketInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyTicketInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SatisfactionSurveyUncheckedCreateNestedOneWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyUncheckedCreateNestedOneWithoutTicketInput> = z.object({
  create: z.union([ z.lazy(() => SatisfactionSurveyCreateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedCreateWithoutTicketInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SatisfactionSurveyCreateOrConnectWithoutTicketInputSchema).optional(),
  connect: z.lazy(() => SatisfactionSurveyWhereUniqueInputSchema).optional()
}).strict();

export const NotificationQueueUncheckedCreateNestedManyWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedCreateNestedManyWithoutTicketInput> = z.object({
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema).array(),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationQueueCreateManyTicketInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableEnumSentimentFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumSentimentFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SentimentSchema).optional().nullable()
}).strict();

export const EnumTicketStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTicketStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TicketStatusSchema).optional()
}).strict();

export const EnumTicketPriorityFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTicketPriorityFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TicketPrioritySchema).optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const OrganizationUpdateOneRequiredWithoutTicketsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutTicketsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutTicketsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutTicketsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutTicketsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutTicketsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutTicketsInputSchema),z.lazy(() => OrganizationUpdateWithoutTicketsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutTicketsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutAssignedTicketsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutAssignedTicketsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAssignedTicketsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssignedTicketsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedTicketsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAssignedTicketsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAssignedTicketsInputSchema),z.lazy(() => UserUpdateWithoutAssignedTicketsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAssignedTicketsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateUpdateManyWithoutTicketNestedInputSchema: z.ZodType<Prisma.TicketUpdateUpdateManyWithoutTicketNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyTicketInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutTicketInputSchema),z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutTicketInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketUpdateScalarWhereInputSchema),z.lazy(() => TicketUpdateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SatisfactionSurveyUpdateOneWithoutTicketNestedInputSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateOneWithoutTicketNestedInput> = z.object({
  create: z.union([ z.lazy(() => SatisfactionSurveyCreateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedCreateWithoutTicketInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SatisfactionSurveyCreateOrConnectWithoutTicketInputSchema).optional(),
  upsert: z.lazy(() => SatisfactionSurveyUpsertWithoutTicketInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SatisfactionSurveyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SatisfactionSurveyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SatisfactionSurveyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SatisfactionSurveyUpdateToOneWithWhereWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUpdateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedUpdateWithoutTicketInputSchema) ]).optional(),
}).strict();

export const NotificationQueueUpdateManyWithoutTicketNestedInputSchema: z.ZodType<Prisma.NotificationQueueUpdateManyWithoutTicketNestedInput> = z.object({
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema).array(),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => NotificationQueueUpsertWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => NotificationQueueUpsertWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationQueueCreateManyTicketInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => NotificationQueueUpdateWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => NotificationQueueUpdateWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => NotificationQueueUpdateManyWithWhereWithoutTicketInputSchema),z.lazy(() => NotificationQueueUpdateManyWithWhereWithoutTicketInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => NotificationQueueScalarWhereInputSchema),z.lazy(() => NotificationQueueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketUpdateUncheckedUpdateManyWithoutTicketNestedInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateManyWithoutTicketNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema).array(),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema),z.lazy(() => TicketUpdateCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => TicketUpdateUpsertWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TicketUpdateCreateManyTicketInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TicketUpdateWhereUniqueInputSchema),z.lazy(() => TicketUpdateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => TicketUpdateUpdateWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutTicketInputSchema),z.lazy(() => TicketUpdateUpdateManyWithWhereWithoutTicketInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TicketUpdateScalarWhereInputSchema),z.lazy(() => TicketUpdateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SatisfactionSurveyUncheckedUpdateOneWithoutTicketNestedInputSchema: z.ZodType<Prisma.SatisfactionSurveyUncheckedUpdateOneWithoutTicketNestedInput> = z.object({
  create: z.union([ z.lazy(() => SatisfactionSurveyCreateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedCreateWithoutTicketInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SatisfactionSurveyCreateOrConnectWithoutTicketInputSchema).optional(),
  upsert: z.lazy(() => SatisfactionSurveyUpsertWithoutTicketInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SatisfactionSurveyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SatisfactionSurveyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SatisfactionSurveyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SatisfactionSurveyUpdateToOneWithWhereWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUpdateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedUpdateWithoutTicketInputSchema) ]).optional(),
}).strict();

export const NotificationQueueUncheckedUpdateManyWithoutTicketNestedInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedUpdateManyWithoutTicketNestedInput> = z.object({
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema).array(),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema),z.lazy(() => NotificationQueueCreateOrConnectWithoutTicketInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => NotificationQueueUpsertWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => NotificationQueueUpsertWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationQueueCreateManyTicketInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => NotificationQueueWhereUniqueInputSchema),z.lazy(() => NotificationQueueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => NotificationQueueUpdateWithWhereUniqueWithoutTicketInputSchema),z.lazy(() => NotificationQueueUpdateWithWhereUniqueWithoutTicketInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => NotificationQueueUpdateManyWithWhereWithoutTicketInputSchema),z.lazy(() => NotificationQueueUpdateManyWithWhereWithoutTicketInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => NotificationQueueScalarWhereInputSchema),z.lazy(() => NotificationQueueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TicketCreateNestedOneWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketCreateNestedOneWithoutUpdatesInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutUpdatesInputSchema),z.lazy(() => TicketUncheckedCreateWithoutUpdatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketCreateOrConnectWithoutUpdatesInputSchema).optional(),
  connect: z.lazy(() => TicketWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTicketUpdatesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTicketUpdatesInputSchema),z.lazy(() => UserUncheckedCreateWithoutTicketUpdatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTicketUpdatesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumTicketUpdateTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTicketUpdateTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TicketUpdateTypeSchema).optional()
}).strict();

export const TicketUpdateOneRequiredWithoutUpdatesNestedInputSchema: z.ZodType<Prisma.TicketUpdateOneRequiredWithoutUpdatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutUpdatesInputSchema),z.lazy(() => TicketUncheckedCreateWithoutUpdatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketCreateOrConnectWithoutUpdatesInputSchema).optional(),
  upsert: z.lazy(() => TicketUpsertWithoutUpdatesInputSchema).optional(),
  connect: z.lazy(() => TicketWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TicketUpdateToOneWithWhereWithoutUpdatesInputSchema),z.lazy(() => TicketUpdateWithoutUpdatesInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutUpdatesInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutTicketUpdatesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutTicketUpdatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTicketUpdatesInputSchema),z.lazy(() => UserUncheckedCreateWithoutTicketUpdatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTicketUpdatesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTicketUpdatesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTicketUpdatesInputSchema),z.lazy(() => UserUpdateWithoutTicketUpdatesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTicketUpdatesInputSchema) ]).optional(),
}).strict();

export const TicketCreateNestedOneWithoutSurveyInputSchema: z.ZodType<Prisma.TicketCreateNestedOneWithoutSurveyInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutSurveyInputSchema),z.lazy(() => TicketUncheckedCreateWithoutSurveyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketCreateOrConnectWithoutSurveyInputSchema).optional(),
  connect: z.lazy(() => TicketWhereUniqueInputSchema).optional()
}).strict();

export const TicketUpdateOneRequiredWithoutSurveyNestedInputSchema: z.ZodType<Prisma.TicketUpdateOneRequiredWithoutSurveyNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutSurveyInputSchema),z.lazy(() => TicketUncheckedCreateWithoutSurveyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketCreateOrConnectWithoutSurveyInputSchema).optional(),
  upsert: z.lazy(() => TicketUpsertWithoutSurveyInputSchema).optional(),
  connect: z.lazy(() => TicketWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TicketUpdateToOneWithWhereWithoutSurveyInputSchema),z.lazy(() => TicketUpdateWithoutSurveyInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutSurveyInputSchema) ]).optional(),
}).strict();

export const TicketCreateNestedOneWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketCreateNestedOneWithoutNotificationsInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutNotificationsInputSchema),z.lazy(() => TicketUncheckedCreateWithoutNotificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketCreateOrConnectWithoutNotificationsInputSchema).optional(),
  connect: z.lazy(() => TicketWhereUniqueInputSchema).optional()
}).strict();

export const NotificationLogCreateNestedManyWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogCreateNestedManyWithoutQueueInput> = z.object({
  create: z.union([ z.lazy(() => NotificationLogCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateWithoutQueueInputSchema).array(),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationLogCreateManyQueueInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NotificationLogUncheckedCreateNestedManyWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUncheckedCreateNestedManyWithoutQueueInput> = z.object({
  create: z.union([ z.lazy(() => NotificationLogCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateWithoutQueueInputSchema).array(),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationLogCreateManyQueueInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumNotificationTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumNotificationTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => NotificationTypeSchema).optional()
}).strict();

export const EnumNotificationChannelFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumNotificationChannelFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => NotificationChannelSchema).optional()
}).strict();

export const NullableEnumNotificationChannelFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumNotificationChannelFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => NotificationChannelSchema).optional().nullable()
}).strict();

export const EnumNotificationStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumNotificationStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => NotificationStatusSchema).optional()
}).strict();

export const TicketUpdateOneRequiredWithoutNotificationsNestedInputSchema: z.ZodType<Prisma.TicketUpdateOneRequiredWithoutNotificationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TicketCreateWithoutNotificationsInputSchema),z.lazy(() => TicketUncheckedCreateWithoutNotificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketCreateOrConnectWithoutNotificationsInputSchema).optional(),
  upsert: z.lazy(() => TicketUpsertWithoutNotificationsInputSchema).optional(),
  connect: z.lazy(() => TicketWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TicketUpdateToOneWithWhereWithoutNotificationsInputSchema),z.lazy(() => TicketUpdateWithoutNotificationsInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutNotificationsInputSchema) ]).optional(),
}).strict();

export const NotificationLogUpdateManyWithoutQueueNestedInputSchema: z.ZodType<Prisma.NotificationLogUpdateManyWithoutQueueNestedInput> = z.object({
  create: z.union([ z.lazy(() => NotificationLogCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateWithoutQueueInputSchema).array(),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => NotificationLogUpsertWithWhereUniqueWithoutQueueInputSchema),z.lazy(() => NotificationLogUpsertWithWhereUniqueWithoutQueueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationLogCreateManyQueueInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => NotificationLogUpdateWithWhereUniqueWithoutQueueInputSchema),z.lazy(() => NotificationLogUpdateWithWhereUniqueWithoutQueueInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => NotificationLogUpdateManyWithWhereWithoutQueueInputSchema),z.lazy(() => NotificationLogUpdateManyWithWhereWithoutQueueInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => NotificationLogScalarWhereInputSchema),z.lazy(() => NotificationLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NotificationLogUncheckedUpdateManyWithoutQueueNestedInputSchema: z.ZodType<Prisma.NotificationLogUncheckedUpdateManyWithoutQueueNestedInput> = z.object({
  create: z.union([ z.lazy(() => NotificationLogCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateWithoutQueueInputSchema).array(),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema),z.lazy(() => NotificationLogCreateOrConnectWithoutQueueInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => NotificationLogUpsertWithWhereUniqueWithoutQueueInputSchema),z.lazy(() => NotificationLogUpsertWithWhereUniqueWithoutQueueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => NotificationLogCreateManyQueueInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => NotificationLogWhereUniqueInputSchema),z.lazy(() => NotificationLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => NotificationLogUpdateWithWhereUniqueWithoutQueueInputSchema),z.lazy(() => NotificationLogUpdateWithWhereUniqueWithoutQueueInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => NotificationLogUpdateManyWithWhereWithoutQueueInputSchema),z.lazy(() => NotificationLogUpdateManyWithWhereWithoutQueueInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => NotificationLogScalarWhereInputSchema),z.lazy(() => NotificationLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NotificationQueueCreateNestedOneWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueCreateNestedOneWithoutLogsInput> = z.object({
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutLogsInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => NotificationQueueCreateOrConnectWithoutLogsInputSchema).optional(),
  connect: z.lazy(() => NotificationQueueWhereUniqueInputSchema).optional()
}).strict();

export const NotificationQueueUpdateOneRequiredWithoutLogsNestedInputSchema: z.ZodType<Prisma.NotificationQueueUpdateOneRequiredWithoutLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutLogsInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => NotificationQueueCreateOrConnectWithoutLogsInputSchema).optional(),
  upsert: z.lazy(() => NotificationQueueUpsertWithoutLogsInputSchema).optional(),
  connect: z.lazy(() => NotificationQueueWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => NotificationQueueUpdateToOneWithWhereWithoutLogsInputSchema),z.lazy(() => NotificationQueueUpdateWithoutLogsInputSchema),z.lazy(() => NotificationQueueUncheckedUpdateWithoutLogsInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumSubscriptionStatusFilterSchema: z.ZodType<Prisma.NestedEnumSubscriptionStatusFilter> = z.object({
  equals: z.lazy(() => SubscriptionStatusSchema).optional(),
  in: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => NestedEnumSubscriptionStatusFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumSubscriptionPaymentMethodFilterSchema: z.ZodType<Prisma.NestedEnumSubscriptionPaymentMethodFilter> = z.object({
  equals: z.lazy(() => SubscriptionPaymentMethodSchema).optional(),
  in: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => NestedEnumSubscriptionPaymentMethodFilterSchema) ]).optional(),
}).strict();

export const NestedEnumSubscriptionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSubscriptionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SubscriptionStatusSchema).optional(),
  in: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => NestedEnumSubscriptionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSubscriptionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSubscriptionStatusFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumSubscriptionPaymentMethodWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSubscriptionPaymentMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SubscriptionPaymentMethodSchema).optional(),
  in: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => SubscriptionPaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => NestedEnumSubscriptionPaymentMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSubscriptionPaymentMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSubscriptionPaymentMethodFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumPaymentStatusFilterSchema: z.ZodType<Prisma.NestedEnumPaymentStatusFilter> = z.object({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => NestedEnumPaymentStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPaymentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => NestedEnumPaymentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumSentimentNullableFilterSchema: z.ZodType<Prisma.NestedEnumSentimentNullableFilter> = z.object({
  equals: z.lazy(() => SentimentSchema).optional().nullable(),
  in: z.lazy(() => SentimentSchema).array().optional().nullable(),
  notIn: z.lazy(() => SentimentSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NestedEnumSentimentNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumTicketStatusFilterSchema: z.ZodType<Prisma.NestedEnumTicketStatusFilter> = z.object({
  equals: z.lazy(() => TicketStatusSchema).optional(),
  in: z.lazy(() => TicketStatusSchema).array().optional(),
  notIn: z.lazy(() => TicketStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => NestedEnumTicketStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumTicketPriorityFilterSchema: z.ZodType<Prisma.NestedEnumTicketPriorityFilter> = z.object({
  equals: z.lazy(() => TicketPrioritySchema).optional(),
  in: z.lazy(() => TicketPrioritySchema).array().optional(),
  notIn: z.lazy(() => TicketPrioritySchema).array().optional(),
  not: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => NestedEnumTicketPriorityFilterSchema) ]).optional(),
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumSentimentNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSentimentNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SentimentSchema).optional().nullable(),
  in: z.lazy(() => SentimentSchema).array().optional().nullable(),
  notIn: z.lazy(() => SentimentSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NestedEnumSentimentNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSentimentNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSentimentNullableFilterSchema).optional()
}).strict();

export const NestedEnumTicketStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTicketStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TicketStatusSchema).optional(),
  in: z.lazy(() => TicketStatusSchema).array().optional(),
  notIn: z.lazy(() => TicketStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => NestedEnumTicketStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTicketStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTicketStatusFilterSchema).optional()
}).strict();

export const NestedEnumTicketPriorityWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTicketPriorityWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TicketPrioritySchema).optional(),
  in: z.lazy(() => TicketPrioritySchema).array().optional(),
  notIn: z.lazy(() => TicketPrioritySchema).array().optional(),
  not: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => NestedEnumTicketPriorityWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTicketPriorityFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTicketPriorityFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedEnumTicketUpdateTypeFilterSchema: z.ZodType<Prisma.NestedEnumTicketUpdateTypeFilter> = z.object({
  equals: z.lazy(() => TicketUpdateTypeSchema).optional(),
  in: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  notIn: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => NestedEnumTicketUpdateTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumTicketUpdateTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTicketUpdateTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TicketUpdateTypeSchema).optional(),
  in: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  notIn: z.lazy(() => TicketUpdateTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => NestedEnumTicketUpdateTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTicketUpdateTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTicketUpdateTypeFilterSchema).optional()
}).strict();

export const NestedEnumNotificationTypeFilterSchema: z.ZodType<Prisma.NestedEnumNotificationTypeFilter> = z.object({
  equals: z.lazy(() => NotificationTypeSchema).optional(),
  in: z.lazy(() => NotificationTypeSchema).array().optional(),
  notIn: z.lazy(() => NotificationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => NestedEnumNotificationTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumNotificationChannelFilterSchema: z.ZodType<Prisma.NestedEnumNotificationChannelFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional(),
  in: z.lazy(() => NotificationChannelSchema).array().optional(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelFilterSchema) ]).optional(),
}).strict();

export const NestedEnumNotificationChannelNullableFilterSchema: z.ZodType<Prisma.NestedEnumNotificationChannelNullableFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  in: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumNotificationStatusFilterSchema: z.ZodType<Prisma.NestedEnumNotificationStatusFilter> = z.object({
  equals: z.lazy(() => NotificationStatusSchema).optional(),
  in: z.lazy(() => NotificationStatusSchema).array().optional(),
  notIn: z.lazy(() => NotificationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => NestedEnumNotificationStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumNotificationTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumNotificationTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationTypeSchema).optional(),
  in: z.lazy(() => NotificationTypeSchema).array().optional(),
  notIn: z.lazy(() => NotificationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => NestedEnumNotificationTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationTypeFilterSchema).optional()
}).strict();

export const NestedEnumNotificationChannelWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumNotificationChannelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional(),
  in: z.lazy(() => NotificationChannelSchema).array().optional(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationChannelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationChannelFilterSchema).optional()
}).strict();

export const NestedEnumNotificationChannelNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumNotificationChannelNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  in: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  notIn: z.lazy(() => NotificationChannelSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NestedEnumNotificationChannelNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationChannelNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationChannelNullableFilterSchema).optional()
}).strict();

export const NestedEnumNotificationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumNotificationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => NotificationStatusSchema).optional(),
  in: z.lazy(() => NotificationStatusSchema).array().optional(),
  notIn: z.lazy(() => NotificationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => NestedEnumNotificationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumNotificationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumNotificationStatusFilterSchema).optional()
}).strict();

export const OrganizationCreateWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutUsersInput> = z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tickets: z.lazy(() => TicketCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutUsersInput> = z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tickets: z.lazy(() => TicketUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUsersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUsersInputSchema) ]),
}).strict();

export const SubscriptionCreateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionCreateWithoutUserInput> = z.object({
  id: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  plan: z.lazy(() => PlanCreateNestedOneWithoutSubscriptionsInputSchema)
}).strict();

export const SubscriptionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  planId: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SubscriptionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SubscriptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PaymentHistoryCreateWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryCreateWithoutUserInput> = z.object({
  id: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  customerId: z.string(),
  userEmail: z.string(),
  billingReason: z.string(),
  status: z.lazy(() => PaymentStatusSchema),
  statusFormatted: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  subtotal: z.number().int(),
  discountTotal: z.number().int(),
  tax: z.number().int(),
  taxInclusive: z.boolean(),
  total: z.number().int(),
  refundedAmount: z.number().int().optional(),
  subtotalUsd: z.number().int(),
  discountTotalUsd: z.number().int(),
  taxUsd: z.number().int(),
  totalUsd: z.number().int(),
  refundedAmountUsd: z.number().int().optional(),
  cardBrand: z.string().optional().nullable(),
  cardLastFour: z.string().optional().nullable(),
  invoiceUrl: z.string().optional().nullable(),
  testMode: z.boolean().optional(),
  refundedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaymentHistoryUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  customerId: z.string(),
  userEmail: z.string(),
  billingReason: z.string(),
  status: z.lazy(() => PaymentStatusSchema),
  statusFormatted: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  subtotal: z.number().int(),
  discountTotal: z.number().int(),
  tax: z.number().int(),
  taxInclusive: z.boolean(),
  total: z.number().int(),
  refundedAmount: z.number().int().optional(),
  subtotalUsd: z.number().int(),
  discountTotalUsd: z.number().int(),
  taxUsd: z.number().int(),
  totalUsd: z.number().int(),
  refundedAmountUsd: z.number().int().optional(),
  cardBrand: z.string().optional().nullable(),
  cardLastFour: z.string().optional().nullable(),
  invoiceUrl: z.string().optional().nullable(),
  testMode: z.boolean().optional(),
  refundedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaymentHistoryCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentHistoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PaymentHistoryCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.PaymentHistoryCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PaymentHistoryCreateManyUserInputSchema),z.lazy(() => PaymentHistoryCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TicketCreateWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketCreateWithoutAssignedToInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutTicketsInputSchema),
  updates: z.lazy(() => TicketUpdateCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketUncheckedCreateWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUncheckedCreateWithoutAssignedToInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  updates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketCreateOrConnectWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketCreateOrConnectWithoutAssignedToInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketCreateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema) ]),
}).strict();

export const TicketCreateManyAssignedToInputEnvelopeSchema: z.ZodType<Prisma.TicketCreateManyAssignedToInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TicketCreateManyAssignedToInputSchema),z.lazy(() => TicketCreateManyAssignedToInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TicketUpdateCreateWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  ticket: z.lazy(() => TicketCreateNestedOneWithoutUpdatesInputSchema)
}).strict();

export const TicketUpdateUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const TicketUpdateCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => TicketUpdateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TicketUpdateCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.TicketUpdateCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TicketUpdateCreateManyUserInputSchema),z.lazy(() => TicketUpdateCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationUpsertWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutUsersInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutUsersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUsersInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUsersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUsersInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutUsersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUsersInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutUsersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tickets: z.lazy(() => TicketUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutUsersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutUsersInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tickets: z.lazy(() => TicketUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const SubscriptionUpsertWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => SubscriptionWhereInputSchema).optional()
}).strict();

export const SubscriptionUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SubscriptionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SubscriptionUpdateWithoutUserInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SubscriptionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.lazy(() => PlanUpdateOneRequiredWithoutSubscriptionsNestedInputSchema).optional()
}).strict();

export const SubscriptionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  planId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentHistoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PaymentHistoryUpdateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentHistoryCreateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PaymentHistoryUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentHistoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PaymentHistoryUpdateWithoutUserInputSchema),z.lazy(() => PaymentHistoryUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PaymentHistoryUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentHistoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PaymentHistoryUpdateManyMutationInputSchema),z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const PaymentHistoryScalarWhereInputSchema: z.ZodType<Prisma.PaymentHistoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentHistoryScalarWhereInputSchema),z.lazy(() => PaymentHistoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentHistoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentHistoryScalarWhereInputSchema),z.lazy(() => PaymentHistoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  invoiceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subscriptionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  billingReason: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema),z.lazy(() => PaymentStatusSchema) ]).optional(),
  statusFormatted: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currencyRate: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subtotal: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  discountTotal: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tax: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  taxInclusive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  refundedAmount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  subtotalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  discountTotalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  taxUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  totalUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  refundedAmountUsd: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cardLastFour: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  invoiceUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  testMode: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  refundedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TicketUpsertWithWhereUniqueWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUpsertWithWhereUniqueWithoutAssignedToInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TicketUpdateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutAssignedToInputSchema) ]),
  create: z.union([ z.lazy(() => TicketCreateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedCreateWithoutAssignedToInputSchema) ]),
}).strict();

export const TicketUpdateWithWhereUniqueWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUpdateWithWhereUniqueWithoutAssignedToInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateWithoutAssignedToInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutAssignedToInputSchema) ]),
}).strict();

export const TicketUpdateManyWithWhereWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUpdateManyWithWhereWithoutAssignedToInput> = z.object({
  where: z.lazy(() => TicketScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateManyMutationInputSchema),z.lazy(() => TicketUncheckedUpdateManyWithoutAssignedToInputSchema) ]),
}).strict();

export const TicketScalarWhereInputSchema: z.ZodType<Prisma.TicketScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TicketScalarWhereInputSchema),z.lazy(() => TicketScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketScalarWhereInputSchema),z.lazy(() => TicketScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  citizenName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  citizenPhone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  citizenEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  citizenAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  category: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => EnumSentimentNullableFilterSchema),z.lazy(() => SentimentSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumTicketStatusFilterSchema),z.lazy(() => TicketStatusSchema) ]).optional(),
  priority: z.union([ z.lazy(() => EnumTicketPriorityFilterSchema),z.lazy(() => TicketPrioritySchema) ]).optional(),
  assignedToId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  publicToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slaDueAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  closedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  aiSummary: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  aiErrorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TicketUpdateUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TicketUpdateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TicketUpdateUpdateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TicketUpdateUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TicketUpdateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateUpdateWithoutUserInputSchema),z.lazy(() => TicketUpdateUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const TicketUpdateUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => TicketUpdateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateUpdateManyMutationInputSchema),z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const TicketUpdateScalarWhereInputSchema: z.ZodType<Prisma.TicketUpdateScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TicketUpdateScalarWhereInputSchema),z.lazy(() => TicketUpdateScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketUpdateScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketUpdateScalarWhereInputSchema),z.lazy(() => TicketUpdateScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => EnumTicketUpdateTypeFilterSchema),z.lazy(() => TicketUpdateTypeSchema) ]).optional(),
  content: z.lazy(() => JsonFilterSchema).optional(),
  replyText: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserCreateWithoutSubscriptionInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutUsersInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSubscriptionInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSubscriptionInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]),
}).strict();

export const PlanCreateWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanCreateWithoutSubscriptionsInput> = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.boolean().optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lemonSqueezyProductId: z.string(),
  lemonSqueezyVariantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PlanUncheckedCreateWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanUncheckedCreateWithoutSubscriptionsInput> = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.boolean().optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lemonSqueezyProductId: z.string(),
  lemonSqueezyVariantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PlanCreateOrConnectWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanCreateOrConnectWithoutSubscriptionsInput> = z.object({
  where: z.lazy(() => PlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlanCreateWithoutSubscriptionsInputSchema),z.lazy(() => PlanUncheckedCreateWithoutSubscriptionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUpsertWithoutSubscriptionInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubscriptionInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubscriptionInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSubscriptionInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSubscriptionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubscriptionInputSchema) ]),
}).strict();

export const UserUpdateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUpdateWithoutSubscriptionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneWithoutUsersNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSubscriptionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const PlanUpsertWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanUpsertWithoutSubscriptionsInput> = z.object({
  update: z.union([ z.lazy(() => PlanUpdateWithoutSubscriptionsInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutSubscriptionsInputSchema) ]),
  create: z.union([ z.lazy(() => PlanCreateWithoutSubscriptionsInputSchema),z.lazy(() => PlanUncheckedCreateWithoutSubscriptionsInputSchema) ]),
  where: z.lazy(() => PlanWhereInputSchema).optional()
}).strict();

export const PlanUpdateToOneWithWhereWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanUpdateToOneWithWhereWithoutSubscriptionsInput> = z.object({
  where: z.lazy(() => PlanWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlanUpdateWithoutSubscriptionsInputSchema),z.lazy(() => PlanUncheckedUpdateWithoutSubscriptionsInputSchema) ]),
}).strict();

export const PlanUpdateWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanUpdateWithoutSubscriptionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlanUncheckedUpdateWithoutSubscriptionsInputSchema: z.ZodType<Prisma.PlanUncheckedUpdateWithoutSubscriptionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  available: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SubscriptionCreateWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionCreateWithoutPlanInput> = z.object({
  id: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSubscriptionInputSchema)
}).strict();

export const SubscriptionUncheckedCreateWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUncheckedCreateWithoutPlanInput> = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SubscriptionCreateOrConnectWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionCreateOrConnectWithoutPlanInput> = z.object({
  where: z.lazy(() => SubscriptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema) ]),
}).strict();

export const SubscriptionCreateManyPlanInputEnvelopeSchema: z.ZodType<Prisma.SubscriptionCreateManyPlanInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SubscriptionCreateManyPlanInputSchema),z.lazy(() => SubscriptionCreateManyPlanInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SubscriptionUpsertWithWhereUniqueWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUpsertWithWhereUniqueWithoutPlanInput> = z.object({
  where: z.lazy(() => SubscriptionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SubscriptionUpdateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutPlanInputSchema) ]),
  create: z.union([ z.lazy(() => SubscriptionCreateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedCreateWithoutPlanInputSchema) ]),
}).strict();

export const SubscriptionUpdateWithWhereUniqueWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUpdateWithWhereUniqueWithoutPlanInput> = z.object({
  where: z.lazy(() => SubscriptionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SubscriptionUpdateWithoutPlanInputSchema),z.lazy(() => SubscriptionUncheckedUpdateWithoutPlanInputSchema) ]),
}).strict();

export const SubscriptionUpdateManyWithWhereWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUpdateManyWithWhereWithoutPlanInput> = z.object({
  where: z.lazy(() => SubscriptionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SubscriptionUpdateManyMutationInputSchema),z.lazy(() => SubscriptionUncheckedUpdateManyWithoutPlanInputSchema) ]),
}).strict();

export const SubscriptionScalarWhereInputSchema: z.ZodType<Prisma.SubscriptionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubscriptionScalarWhereInputSchema),z.lazy(() => SubscriptionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubscriptionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubscriptionScalarWhereInputSchema),z.lazy(() => SubscriptionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  planId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumSubscriptionStatusFilterSchema),z.lazy(() => SubscriptionStatusSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonSubscriptionItemId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lemonCustomerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonOrderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonProductId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lemonVariantId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  renewsAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  endsAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumSubscriptionPaymentMethodFilterSchema),z.lazy(() => SubscriptionPaymentMethodSchema) ]).optional(),
  cardBrand: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cardLast4: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserCreateWithoutPaymentHistoriesInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutUsersInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPaymentHistoriesInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPaymentHistoriesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentHistoriesInputSchema) ]),
}).strict();

export const UserUpsertWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserUpsertWithoutPaymentHistoriesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentHistoriesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentHistoriesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPaymentHistoriesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPaymentHistoriesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentHistoriesInputSchema) ]),
}).strict();

export const UserUpdateWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserUpdateWithoutPaymentHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneWithoutUsersNestedInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPaymentHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedCreateNestedManyWithoutAssignedToInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyOrganizationInputSchema),z.lazy(() => UserCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TicketCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  assignedTo: z.lazy(() => UserCreateNestedOneWithoutAssignedTicketsInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  assignedToId: z.string().optional().nullable(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  updates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketCreateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const TicketCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.TicketCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TicketCreateManyOrganizationInputSchema),z.lazy(() => TicketCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TicketUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TicketUpdateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => TicketCreateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const TicketUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateWithoutOrganizationInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const TicketUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => TicketScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateManyMutationInputSchema),z.lazy(() => TicketUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutTicketsInput> = z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  users: z.lazy(() => UserCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutTicketsInput> = z.object({
  id: z.string().cuid().optional(),
  clerkOrgId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutTicketsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutTicketsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutTicketsInputSchema) ]),
}).strict();

export const UserCreateWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserCreateWithoutAssignedTicketsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutUsersInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryCreateNestedManyWithoutUserInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAssignedTicketsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedTicketsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAssignedTicketsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssignedTicketsInputSchema) ]),
}).strict();

export const TicketUpdateCreateWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateCreateWithoutTicketInput> = z.object({
  id: z.string().cuid().optional(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTicketUpdatesInputSchema).optional()
}).strict();

export const TicketUpdateUncheckedCreateWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedCreateWithoutTicketInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().optional().nullable(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const TicketUpdateCreateOrConnectWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateCreateOrConnectWithoutTicketInput> = z.object({
  where: z.lazy(() => TicketUpdateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema) ]),
}).strict();

export const TicketUpdateCreateManyTicketInputEnvelopeSchema: z.ZodType<Prisma.TicketUpdateCreateManyTicketInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TicketUpdateCreateManyTicketInputSchema),z.lazy(() => TicketUpdateCreateManyTicketInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SatisfactionSurveyCreateWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyCreateWithoutTicketInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  feedback: z.string().optional().nullable(),
  sentAt: z.coerce.date().optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SatisfactionSurveyUncheckedCreateWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyUncheckedCreateWithoutTicketInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  feedback: z.string().optional().nullable(),
  sentAt: z.coerce.date().optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SatisfactionSurveyCreateOrConnectWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyCreateOrConnectWithoutTicketInput> = z.object({
  where: z.lazy(() => SatisfactionSurveyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SatisfactionSurveyCreateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedCreateWithoutTicketInputSchema) ]),
}).strict();

export const NotificationQueueCreateWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueCreateWithoutTicketInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  logs: z.lazy(() => NotificationLogCreateNestedManyWithoutQueueInputSchema).optional()
}).strict();

export const NotificationQueueUncheckedCreateWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedCreateWithoutTicketInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  logs: z.lazy(() => NotificationLogUncheckedCreateNestedManyWithoutQueueInputSchema).optional()
}).strict();

export const NotificationQueueCreateOrConnectWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueCreateOrConnectWithoutTicketInput> = z.object({
  where: z.lazy(() => NotificationQueueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema) ]),
}).strict();

export const NotificationQueueCreateManyTicketInputEnvelopeSchema: z.ZodType<Prisma.NotificationQueueCreateManyTicketInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => NotificationQueueCreateManyTicketInputSchema),z.lazy(() => NotificationQueueCreateManyTicketInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationUpsertWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutTicketsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutTicketsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutTicketsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutTicketsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutTicketsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutTicketsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutTicketsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutTicketsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutTicketsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  users: z.lazy(() => UserUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutTicketsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutTicketsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkOrgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  settings: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  users: z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAssignedTicketsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAssignedTicketsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAssignedTicketsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAssignedTicketsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssignedTicketsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedTicketsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAssignedTicketsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAssignedTicketsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAssignedTicketsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneWithoutUsersNestedInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUpdateManyWithoutUserNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAssignedTicketsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAssignedTicketsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const TicketUpdateUpsertWithWhereUniqueWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUpsertWithWhereUniqueWithoutTicketInput> = z.object({
  where: z.lazy(() => TicketUpdateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TicketUpdateUpdateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedUpdateWithoutTicketInputSchema) ]),
  create: z.union([ z.lazy(() => TicketUpdateCreateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedCreateWithoutTicketInputSchema) ]),
}).strict();

export const TicketUpdateUpdateWithWhereUniqueWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUpdateWithWhereUniqueWithoutTicketInput> = z.object({
  where: z.lazy(() => TicketUpdateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateUpdateWithoutTicketInputSchema),z.lazy(() => TicketUpdateUncheckedUpdateWithoutTicketInputSchema) ]),
}).strict();

export const TicketUpdateUpdateManyWithWhereWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUpdateManyWithWhereWithoutTicketInput> = z.object({
  where: z.lazy(() => TicketUpdateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TicketUpdateUpdateManyMutationInputSchema),z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutTicketInputSchema) ]),
}).strict();

export const SatisfactionSurveyUpsertWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyUpsertWithoutTicketInput> = z.object({
  update: z.union([ z.lazy(() => SatisfactionSurveyUpdateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedUpdateWithoutTicketInputSchema) ]),
  create: z.union([ z.lazy(() => SatisfactionSurveyCreateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedCreateWithoutTicketInputSchema) ]),
  where: z.lazy(() => SatisfactionSurveyWhereInputSchema).optional()
}).strict();

export const SatisfactionSurveyUpdateToOneWithWhereWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateToOneWithWhereWithoutTicketInput> = z.object({
  where: z.lazy(() => SatisfactionSurveyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SatisfactionSurveyUpdateWithoutTicketInputSchema),z.lazy(() => SatisfactionSurveyUncheckedUpdateWithoutTicketInputSchema) ]),
}).strict();

export const SatisfactionSurveyUpdateWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  feedback: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SatisfactionSurveyUncheckedUpdateWithoutTicketInputSchema: z.ZodType<Prisma.SatisfactionSurveyUncheckedUpdateWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  feedback: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationQueueUpsertWithWhereUniqueWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUpsertWithWhereUniqueWithoutTicketInput> = z.object({
  where: z.lazy(() => NotificationQueueWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => NotificationQueueUpdateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedUpdateWithoutTicketInputSchema) ]),
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutTicketInputSchema) ]),
}).strict();

export const NotificationQueueUpdateWithWhereUniqueWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUpdateWithWhereUniqueWithoutTicketInput> = z.object({
  where: z.lazy(() => NotificationQueueWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => NotificationQueueUpdateWithoutTicketInputSchema),z.lazy(() => NotificationQueueUncheckedUpdateWithoutTicketInputSchema) ]),
}).strict();

export const NotificationQueueUpdateManyWithWhereWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUpdateManyWithWhereWithoutTicketInput> = z.object({
  where: z.lazy(() => NotificationQueueScalarWhereInputSchema),
  data: z.union([ z.lazy(() => NotificationQueueUpdateManyMutationInputSchema),z.lazy(() => NotificationQueueUncheckedUpdateManyWithoutTicketInputSchema) ]),
}).strict();

export const NotificationQueueScalarWhereInputSchema: z.ZodType<Prisma.NotificationQueueScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationQueueScalarWhereInputSchema),z.lazy(() => NotificationQueueScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationQueueScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationQueueScalarWhereInputSchema),z.lazy(() => NotificationQueueScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticketId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumNotificationTypeFilterSchema),z.lazy(() => NotificationTypeSchema) ]).optional(),
  recipientPhone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  recipientEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  recipientName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  templateData: z.lazy(() => JsonFilterSchema).optional(),
  preferredChannel: z.union([ z.lazy(() => EnumNotificationChannelFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => EnumNotificationChannelNullableFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumNotificationStatusFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  attempts: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  maxAttempts: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  scheduledAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  failedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TicketCreateWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketCreateWithoutUpdatesInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutTicketsInputSchema),
  assignedTo: z.lazy(() => UserCreateNestedOneWithoutAssignedTicketsInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketUncheckedCreateWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketUncheckedCreateWithoutUpdatesInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  assignedToId: z.string().optional().nullable(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedCreateNestedOneWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketCreateOrConnectWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketCreateOrConnectWithoutUpdatesInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketCreateWithoutUpdatesInputSchema),z.lazy(() => TicketUncheckedCreateWithoutUpdatesInputSchema) ]),
}).strict();

export const UserCreateWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserCreateWithoutTicketUpdatesInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutUsersInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketCreateNestedManyWithoutAssignedToInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTicketUpdatesInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedCreateNestedManyWithoutAssignedToInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTicketUpdatesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTicketUpdatesInputSchema),z.lazy(() => UserUncheckedCreateWithoutTicketUpdatesInputSchema) ]),
}).strict();

export const TicketUpsertWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketUpsertWithoutUpdatesInput> = z.object({
  update: z.union([ z.lazy(() => TicketUpdateWithoutUpdatesInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutUpdatesInputSchema) ]),
  create: z.union([ z.lazy(() => TicketCreateWithoutUpdatesInputSchema),z.lazy(() => TicketUncheckedCreateWithoutUpdatesInputSchema) ]),
  where: z.lazy(() => TicketWhereInputSchema).optional()
}).strict();

export const TicketUpdateToOneWithWhereWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketUpdateToOneWithWhereWithoutUpdatesInput> = z.object({
  where: z.lazy(() => TicketWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TicketUpdateWithoutUpdatesInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutUpdatesInputSchema) ]),
}).strict();

export const TicketUpdateWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketUpdateWithoutUpdatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutTicketsNestedInputSchema).optional(),
  assignedTo: z.lazy(() => UserUpdateOneWithoutAssignedTicketsNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateWithoutUpdatesInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateWithoutUpdatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  assignedToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserUpsertWithoutTicketUpdatesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTicketUpdatesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTicketUpdatesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTicketUpdatesInputSchema),z.lazy(() => UserUncheckedCreateWithoutTicketUpdatesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTicketUpdatesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTicketUpdatesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTicketUpdatesInputSchema) ]),
}).strict();

export const UserUpdateWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserUpdateWithoutTicketUpdatesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneWithoutUsersNestedInputSchema).optional(),
  subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUpdateManyWithoutAssignedToNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTicketUpdatesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTicketUpdatesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedUpdateManyWithoutAssignedToNestedInputSchema).optional()
}).strict();

export const TicketCreateWithoutSurveyInputSchema: z.ZodType<Prisma.TicketCreateWithoutSurveyInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutTicketsInputSchema),
  assignedTo: z.lazy(() => UserCreateNestedOneWithoutAssignedTicketsInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateCreateNestedManyWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketUncheckedCreateWithoutSurveyInputSchema: z.ZodType<Prisma.TicketUncheckedCreateWithoutSurveyInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  assignedToId: z.string().optional().nullable(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  updates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutTicketInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedCreateNestedManyWithoutTicketInputSchema).optional()
}).strict();

export const TicketCreateOrConnectWithoutSurveyInputSchema: z.ZodType<Prisma.TicketCreateOrConnectWithoutSurveyInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketCreateWithoutSurveyInputSchema),z.lazy(() => TicketUncheckedCreateWithoutSurveyInputSchema) ]),
}).strict();

export const TicketUpsertWithoutSurveyInputSchema: z.ZodType<Prisma.TicketUpsertWithoutSurveyInput> = z.object({
  update: z.union([ z.lazy(() => TicketUpdateWithoutSurveyInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutSurveyInputSchema) ]),
  create: z.union([ z.lazy(() => TicketCreateWithoutSurveyInputSchema),z.lazy(() => TicketUncheckedCreateWithoutSurveyInputSchema) ]),
  where: z.lazy(() => TicketWhereInputSchema).optional()
}).strict();

export const TicketUpdateToOneWithWhereWithoutSurveyInputSchema: z.ZodType<Prisma.TicketUpdateToOneWithWhereWithoutSurveyInput> = z.object({
  where: z.lazy(() => TicketWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TicketUpdateWithoutSurveyInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutSurveyInputSchema) ]),
}).strict();

export const TicketUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.TicketUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutTicketsNestedInputSchema).optional(),
  assignedTo: z.lazy(() => UserUpdateOneWithoutAssignedTicketsNestedInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateUpdateManyWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateWithoutSurveyInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateWithoutSurveyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  assignedToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketCreateWithoutNotificationsInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutTicketsInputSchema),
  assignedTo: z.lazy(() => UserCreateNestedOneWithoutAssignedTicketsInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyCreateNestedOneWithoutTicketInputSchema).optional()
}).strict();

export const TicketUncheckedCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketUncheckedCreateWithoutNotificationsInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  assignedToId: z.string().optional().nullable(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  updates: z.lazy(() => TicketUpdateUncheckedCreateNestedManyWithoutTicketInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedCreateNestedOneWithoutTicketInputSchema).optional()
}).strict();

export const TicketCreateOrConnectWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketCreateOrConnectWithoutNotificationsInput> = z.object({
  where: z.lazy(() => TicketWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketCreateWithoutNotificationsInputSchema),z.lazy(() => TicketUncheckedCreateWithoutNotificationsInputSchema) ]),
}).strict();

export const NotificationLogCreateWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogCreateWithoutQueueInput> = z.object({
  id: z.string().cuid().optional(),
  channel: z.lazy(() => NotificationChannelSchema),
  status: z.lazy(() => NotificationStatusSchema),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.string().optional().nullable(),
  attemptNumber: z.number().int(),
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const NotificationLogUncheckedCreateWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUncheckedCreateWithoutQueueInput> = z.object({
  id: z.string().cuid().optional(),
  channel: z.lazy(() => NotificationChannelSchema),
  status: z.lazy(() => NotificationStatusSchema),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.string().optional().nullable(),
  attemptNumber: z.number().int(),
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const NotificationLogCreateOrConnectWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogCreateOrConnectWithoutQueueInput> = z.object({
  where: z.lazy(() => NotificationLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => NotificationLogCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema) ]),
}).strict();

export const NotificationLogCreateManyQueueInputEnvelopeSchema: z.ZodType<Prisma.NotificationLogCreateManyQueueInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => NotificationLogCreateManyQueueInputSchema),z.lazy(() => NotificationLogCreateManyQueueInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TicketUpsertWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketUpsertWithoutNotificationsInput> = z.object({
  update: z.union([ z.lazy(() => TicketUpdateWithoutNotificationsInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutNotificationsInputSchema) ]),
  create: z.union([ z.lazy(() => TicketCreateWithoutNotificationsInputSchema),z.lazy(() => TicketUncheckedCreateWithoutNotificationsInputSchema) ]),
  where: z.lazy(() => TicketWhereInputSchema).optional()
}).strict();

export const TicketUpdateToOneWithWhereWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketUpdateToOneWithWhereWithoutNotificationsInput> = z.object({
  where: z.lazy(() => TicketWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TicketUpdateWithoutNotificationsInputSchema),z.lazy(() => TicketUncheckedUpdateWithoutNotificationsInputSchema) ]),
}).strict();

export const TicketUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketUpdateWithoutNotificationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutTicketsNestedInputSchema).optional(),
  assignedTo: z.lazy(() => UserUpdateOneWithoutAssignedTicketsNestedInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUpdateOneWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateWithoutNotificationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  assignedToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedUpdateOneWithoutTicketNestedInputSchema).optional()
}).strict();

export const NotificationLogUpsertWithWhereUniqueWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUpsertWithWhereUniqueWithoutQueueInput> = z.object({
  where: z.lazy(() => NotificationLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => NotificationLogUpdateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedUpdateWithoutQueueInputSchema) ]),
  create: z.union([ z.lazy(() => NotificationLogCreateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedCreateWithoutQueueInputSchema) ]),
}).strict();

export const NotificationLogUpdateWithWhereUniqueWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUpdateWithWhereUniqueWithoutQueueInput> = z.object({
  where: z.lazy(() => NotificationLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => NotificationLogUpdateWithoutQueueInputSchema),z.lazy(() => NotificationLogUncheckedUpdateWithoutQueueInputSchema) ]),
}).strict();

export const NotificationLogUpdateManyWithWhereWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUpdateManyWithWhereWithoutQueueInput> = z.object({
  where: z.lazy(() => NotificationLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => NotificationLogUpdateManyMutationInputSchema),z.lazy(() => NotificationLogUncheckedUpdateManyWithoutQueueInputSchema) ]),
}).strict();

export const NotificationLogScalarWhereInputSchema: z.ZodType<Prisma.NotificationLogScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => NotificationLogScalarWhereInputSchema),z.lazy(() => NotificationLogScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => NotificationLogScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => NotificationLogScalarWhereInputSchema),z.lazy(() => NotificationLogScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  queueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channel: z.union([ z.lazy(() => EnumNotificationChannelFilterSchema),z.lazy(() => NotificationChannelSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumNotificationStatusFilterSchema),z.lazy(() => NotificationStatusSchema) ]).optional(),
  requestData: z.lazy(() => JsonNullableFilterSchema).optional(),
  responseData: z.lazy(() => JsonNullableFilterSchema).optional(),
  errorMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  attemptNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  sentAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  responseAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const NotificationQueueCreateWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueCreateWithoutLogsInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ticket: z.lazy(() => TicketCreateNestedOneWithoutNotificationsInputSchema)
}).strict();

export const NotificationQueueUncheckedCreateWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedCreateWithoutLogsInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const NotificationQueueCreateOrConnectWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueCreateOrConnectWithoutLogsInput> = z.object({
  where: z.lazy(() => NotificationQueueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutLogsInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutLogsInputSchema) ]),
}).strict();

export const NotificationQueueUpsertWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueUpsertWithoutLogsInput> = z.object({
  update: z.union([ z.lazy(() => NotificationQueueUpdateWithoutLogsInputSchema),z.lazy(() => NotificationQueueUncheckedUpdateWithoutLogsInputSchema) ]),
  create: z.union([ z.lazy(() => NotificationQueueCreateWithoutLogsInputSchema),z.lazy(() => NotificationQueueUncheckedCreateWithoutLogsInputSchema) ]),
  where: z.lazy(() => NotificationQueueWhereInputSchema).optional()
}).strict();

export const NotificationQueueUpdateToOneWithWhereWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueUpdateToOneWithWhereWithoutLogsInput> = z.object({
  where: z.lazy(() => NotificationQueueWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => NotificationQueueUpdateWithoutLogsInputSchema),z.lazy(() => NotificationQueueUncheckedUpdateWithoutLogsInputSchema) ]),
}).strict();

export const NotificationQueueUpdateWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueUpdateWithoutLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ticket: z.lazy(() => TicketUpdateOneRequiredWithoutNotificationsNestedInputSchema).optional()
}).strict();

export const NotificationQueueUncheckedUpdateWithoutLogsInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedUpdateWithoutLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryCreateManyUserInputSchema: z.ZodType<Prisma.PaymentHistoryCreateManyUserInput> = z.object({
  id: z.string(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  customerId: z.string(),
  userEmail: z.string(),
  billingReason: z.string(),
  status: z.lazy(() => PaymentStatusSchema),
  statusFormatted: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  subtotal: z.number().int(),
  discountTotal: z.number().int(),
  tax: z.number().int(),
  taxInclusive: z.boolean(),
  total: z.number().int(),
  refundedAmount: z.number().int().optional(),
  subtotalUsd: z.number().int(),
  discountTotalUsd: z.number().int(),
  taxUsd: z.number().int(),
  totalUsd: z.number().int(),
  refundedAmountUsd: z.number().int().optional(),
  cardBrand: z.string().optional().nullable(),
  cardLastFour: z.string().optional().nullable(),
  invoiceUrl: z.string().optional().nullable(),
  testMode: z.boolean().optional(),
  refundedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TicketCreateManyAssignedToInputSchema: z.ZodType<Prisma.TicketCreateManyAssignedToInput> = z.object({
  id: z.string().cuid().optional(),
  organizationId: z.string(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TicketUpdateCreateManyUserInputSchema: z.ZodType<Prisma.TicketUpdateCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  ticketId: z.string(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const PaymentHistoryUpdateWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  invoiceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  billingReason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  statusFormatted: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currencyRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subtotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxInclusive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  subtotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmountUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLastFour: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  invoiceUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testMode: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  invoiceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  billingReason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  statusFormatted: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currencyRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subtotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxInclusive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  subtotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmountUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLastFour: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  invoiceUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testMode: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentHistoryUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.PaymentHistoryUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  invoiceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subscriptionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  billingReason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema),z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  statusFormatted: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currencyRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subtotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotal: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxInclusive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  subtotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  discountTotalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAmountUsd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLastFour: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  invoiceUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testMode: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  refundedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUpdateWithoutAssignedToInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutTicketsNestedInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateWithoutAssignedToInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateManyWithoutAssignedToInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateManyWithoutAssignedToInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateUpdateWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ticket: z.lazy(() => TicketUpdateOneRequiredWithoutUpdatesNestedInputSchema).optional()
}).strict();

export const TicketUpdateUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticketId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SubscriptionCreateManyPlanInputSchema: z.ZodType<Prisma.SubscriptionCreateManyPlanInput> = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.lazy(() => SubscriptionStatusSchema),
  lemonSqueezyId: z.string(),
  lemonSubscriptionItemId: z.string().optional().nullable(),
  lemonCustomerId: z.string(),
  lemonOrderId: z.string(),
  lemonProductId: z.string(),
  lemonVariantId: z.string(),
  renewsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => SubscriptionPaymentMethodSchema),
  cardBrand: z.string().optional().nullable(),
  cardLast4: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SubscriptionUpdateWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUpdateWithoutPlanInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSubscriptionNestedInputSchema).optional()
}).strict();

export const SubscriptionUncheckedUpdateWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateWithoutPlanInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SubscriptionUncheckedUpdateManyWithoutPlanInputSchema: z.ZodType<Prisma.SubscriptionUncheckedUpdateManyWithoutPlanInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SubscriptionStatusSchema),z.lazy(() => EnumSubscriptionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSqueezyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonSubscriptionItemId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonCustomerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonOrderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonProductId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lemonVariantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  renewsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endsAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => SubscriptionPaymentMethodSchema),z.lazy(() => EnumSubscriptionPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  cardBrand: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cardLast4: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateManyOrganizationInputSchema: z.ZodType<Prisma.UserCreateManyOrganizationInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TicketCreateManyOrganizationInputSchema: z.ZodType<Prisma.TicketCreateManyOrganizationInput> = z.object({
  id: z.string().cuid().optional(),
  citizenName: z.string(),
  citizenPhone: z.string().optional().nullable(),
  citizenEmail: z.string().optional().nullable(),
  citizenAddress: z.string().optional().nullable(),
  content: z.string(),
  category: z.string().optional().nullable(),
  sentiment: z.lazy(() => SentimentSchema).optional().nullable(),
  status: z.lazy(() => TicketStatusSchema).optional(),
  priority: z.lazy(() => TicketPrioritySchema).optional(),
  assignedToId: z.string().optional().nullable(),
  publicToken: z.string().uuid().optional(),
  slaDueAt: z.coerce.date().optional().nullable(),
  repliedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiDraftAnswer: z.string().optional().nullable(),
  aiSuggestedAssigneeId: z.string().optional().nullable(),
  aiConfidenceScore: z.number().optional().nullable(),
  aiNeedsManualReview: z.boolean().optional(),
  aiErrorMessage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  assignedTickets: z.lazy(() => TicketUncheckedUpdateManyWithoutAssignedToNestedInputSchema).optional(),
  ticketUpdates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  assignedTo: z.lazy(() => UserUpdateOneWithoutAssignedTicketsNestedInputSchema).optional(),
  updates: z.lazy(() => TicketUpdateUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  assignedToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updates: z.lazy(() => TicketUpdateUncheckedUpdateManyWithoutTicketNestedInputSchema).optional(),
  survey: z.lazy(() => SatisfactionSurveyUncheckedUpdateOneWithoutTicketNestedInputSchema).optional(),
  notifications: z.lazy(() => NotificationQueueUncheckedUpdateManyWithoutTicketNestedInputSchema).optional()
}).strict();

export const TicketUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.TicketUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  citizenPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citizenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sentiment: z.union([ z.lazy(() => SentimentSchema),z.lazy(() => NullableEnumSentimentFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => TicketStatusSchema),z.lazy(() => EnumTicketStatusFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.lazy(() => TicketPrioritySchema),z.lazy(() => EnumTicketPriorityFieldUpdateOperationsInputSchema) ]).optional(),
  assignedToId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publicToken: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slaDueAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  closedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSummary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiDraftAnswer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiSuggestedAssigneeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiConfidenceScore: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiNeedsManualReview: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  aiErrorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateCreateManyTicketInputSchema: z.ZodType<Prisma.TicketUpdateCreateManyTicketInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().optional().nullable(),
  updateType: z.lazy(() => TicketUpdateTypeSchema),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  replyText: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const NotificationQueueCreateManyTicketInputSchema: z.ZodType<Prisma.NotificationQueueCreateManyTicketInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => NotificationTypeSchema),
  recipientPhone: z.string().optional().nullable(),
  recipientEmail: z.string().optional().nullable(),
  recipientName: z.string(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  preferredChannel: z.lazy(() => NotificationChannelSchema),
  currentChannel: z.lazy(() => NotificationChannelSchema).optional().nullable(),
  status: z.lazy(() => NotificationStatusSchema).optional(),
  attempts: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  scheduledAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TicketUpdateUpdateWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUpdateWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutTicketUpdatesNestedInputSchema).optional()
}).strict();

export const TicketUpdateUncheckedUpdateWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TicketUpdateUncheckedUpdateManyWithoutTicketInputSchema: z.ZodType<Prisma.TicketUpdateUncheckedUpdateManyWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateType: z.union([ z.lazy(() => TicketUpdateTypeSchema),z.lazy(() => EnumTicketUpdateTypeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  replyText: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationQueueUpdateWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUpdateWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  logs: z.lazy(() => NotificationLogUpdateManyWithoutQueueNestedInputSchema).optional()
}).strict();

export const NotificationQueueUncheckedUpdateWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedUpdateWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  logs: z.lazy(() => NotificationLogUncheckedUpdateManyWithoutQueueNestedInputSchema).optional()
}).strict();

export const NotificationQueueUncheckedUpdateManyWithoutTicketInputSchema: z.ZodType<Prisma.NotificationQueueUncheckedUpdateManyWithoutTicketInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => NotificationTypeSchema),z.lazy(() => EnumNotificationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  recipientPhone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipientName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  preferredChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  currentChannel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => NullableEnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxAttempts: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  failedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationLogCreateManyQueueInputSchema: z.ZodType<Prisma.NotificationLogCreateManyQueueInput> = z.object({
  id: z.string().cuid().optional(),
  channel: z.lazy(() => NotificationChannelSchema),
  status: z.lazy(() => NotificationStatusSchema),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.string().optional().nullable(),
  attemptNumber: z.number().int(),
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const NotificationLogUpdateWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUpdateWithoutQueueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attemptNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationLogUncheckedUpdateWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUncheckedUpdateWithoutQueueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attemptNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const NotificationLogUncheckedUpdateManyWithoutQueueInputSchema: z.ZodType<Prisma.NotificationLogUncheckedUpdateManyWithoutQueueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => NotificationChannelSchema),z.lazy(() => EnumNotificationChannelFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => NotificationStatusSchema),z.lazy(() => EnumNotificationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requestData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  responseData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  errorMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attemptNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sentAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responseAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const SubscriptionFindFirstArgsSchema: z.ZodType<Prisma.SubscriptionFindFirstArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubscriptionScalarFieldEnumSchema,SubscriptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SubscriptionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SubscriptionFindFirstOrThrowArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubscriptionScalarFieldEnumSchema,SubscriptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SubscriptionFindManyArgsSchema: z.ZodType<Prisma.SubscriptionFindManyArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubscriptionScalarFieldEnumSchema,SubscriptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SubscriptionAggregateArgsSchema: z.ZodType<Prisma.SubscriptionAggregateArgs> = z.object({
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithRelationInputSchema.array(),SubscriptionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubscriptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SubscriptionGroupByArgsSchema: z.ZodType<Prisma.SubscriptionGroupByArgs> = z.object({
  where: SubscriptionWhereInputSchema.optional(),
  orderBy: z.union([ SubscriptionOrderByWithAggregationInputSchema.array(),SubscriptionOrderByWithAggregationInputSchema ]).optional(),
  by: SubscriptionScalarFieldEnumSchema.array(),
  having: SubscriptionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SubscriptionFindUniqueArgsSchema: z.ZodType<Prisma.SubscriptionFindUniqueArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() ;

export const SubscriptionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SubscriptionFindUniqueOrThrowArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() ;

export const PlanFindFirstArgsSchema: z.ZodType<Prisma.PlanFindFirstArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlanScalarFieldEnumSchema,PlanScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlanFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PlanFindFirstOrThrowArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlanScalarFieldEnumSchema,PlanScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlanFindManyArgsSchema: z.ZodType<Prisma.PlanFindManyArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlanScalarFieldEnumSchema,PlanScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlanAggregateArgsSchema: z.ZodType<Prisma.PlanAggregateArgs> = z.object({
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithRelationInputSchema.array(),PlanOrderByWithRelationInputSchema ]).optional(),
  cursor: PlanWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlanGroupByArgsSchema: z.ZodType<Prisma.PlanGroupByArgs> = z.object({
  where: PlanWhereInputSchema.optional(),
  orderBy: z.union([ PlanOrderByWithAggregationInputSchema.array(),PlanOrderByWithAggregationInputSchema ]).optional(),
  by: PlanScalarFieldEnumSchema.array(),
  having: PlanScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlanFindUniqueArgsSchema: z.ZodType<Prisma.PlanFindUniqueArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
}).strict() ;

export const PlanFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PlanFindUniqueOrThrowArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
}).strict() ;

export const WebhookEventFindFirstArgsSchema: z.ZodType<Prisma.WebhookEventFindFirstArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  where: WebhookEventWhereInputSchema.optional(),
  orderBy: z.union([ WebhookEventOrderByWithRelationInputSchema.array(),WebhookEventOrderByWithRelationInputSchema ]).optional(),
  cursor: WebhookEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WebhookEventScalarFieldEnumSchema,WebhookEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WebhookEventFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WebhookEventFindFirstOrThrowArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  where: WebhookEventWhereInputSchema.optional(),
  orderBy: z.union([ WebhookEventOrderByWithRelationInputSchema.array(),WebhookEventOrderByWithRelationInputSchema ]).optional(),
  cursor: WebhookEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WebhookEventScalarFieldEnumSchema,WebhookEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WebhookEventFindManyArgsSchema: z.ZodType<Prisma.WebhookEventFindManyArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  where: WebhookEventWhereInputSchema.optional(),
  orderBy: z.union([ WebhookEventOrderByWithRelationInputSchema.array(),WebhookEventOrderByWithRelationInputSchema ]).optional(),
  cursor: WebhookEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WebhookEventScalarFieldEnumSchema,WebhookEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WebhookEventAggregateArgsSchema: z.ZodType<Prisma.WebhookEventAggregateArgs> = z.object({
  where: WebhookEventWhereInputSchema.optional(),
  orderBy: z.union([ WebhookEventOrderByWithRelationInputSchema.array(),WebhookEventOrderByWithRelationInputSchema ]).optional(),
  cursor: WebhookEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WebhookEventGroupByArgsSchema: z.ZodType<Prisma.WebhookEventGroupByArgs> = z.object({
  where: WebhookEventWhereInputSchema.optional(),
  orderBy: z.union([ WebhookEventOrderByWithAggregationInputSchema.array(),WebhookEventOrderByWithAggregationInputSchema ]).optional(),
  by: WebhookEventScalarFieldEnumSchema.array(),
  having: WebhookEventScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WebhookEventFindUniqueArgsSchema: z.ZodType<Prisma.WebhookEventFindUniqueArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  where: WebhookEventWhereUniqueInputSchema,
}).strict() ;

export const WebhookEventFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WebhookEventFindUniqueOrThrowArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  where: WebhookEventWhereUniqueInputSchema,
}).strict() ;

export const PaymentHistoryFindFirstArgsSchema: z.ZodType<Prisma.PaymentHistoryFindFirstArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  where: PaymentHistoryWhereInputSchema.optional(),
  orderBy: z.union([ PaymentHistoryOrderByWithRelationInputSchema.array(),PaymentHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentHistoryScalarFieldEnumSchema,PaymentHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentHistoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PaymentHistoryFindFirstOrThrowArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  where: PaymentHistoryWhereInputSchema.optional(),
  orderBy: z.union([ PaymentHistoryOrderByWithRelationInputSchema.array(),PaymentHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentHistoryScalarFieldEnumSchema,PaymentHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentHistoryFindManyArgsSchema: z.ZodType<Prisma.PaymentHistoryFindManyArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  where: PaymentHistoryWhereInputSchema.optional(),
  orderBy: z.union([ PaymentHistoryOrderByWithRelationInputSchema.array(),PaymentHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentHistoryScalarFieldEnumSchema,PaymentHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentHistoryAggregateArgsSchema: z.ZodType<Prisma.PaymentHistoryAggregateArgs> = z.object({
  where: PaymentHistoryWhereInputSchema.optional(),
  orderBy: z.union([ PaymentHistoryOrderByWithRelationInputSchema.array(),PaymentHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaymentHistoryGroupByArgsSchema: z.ZodType<Prisma.PaymentHistoryGroupByArgs> = z.object({
  where: PaymentHistoryWhereInputSchema.optional(),
  orderBy: z.union([ PaymentHistoryOrderByWithAggregationInputSchema.array(),PaymentHistoryOrderByWithAggregationInputSchema ]).optional(),
  by: PaymentHistoryScalarFieldEnumSchema.array(),
  having: PaymentHistoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaymentHistoryFindUniqueArgsSchema: z.ZodType<Prisma.PaymentHistoryFindUniqueArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  where: PaymentHistoryWhereUniqueInputSchema,
}).strict() ;

export const PaymentHistoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PaymentHistoryFindUniqueOrThrowArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  where: PaymentHistoryWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindFirstArgsSchema: z.ZodType<Prisma.OrganizationFindFirstArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindFirstOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindManyArgsSchema: z.ZodType<Prisma.OrganizationFindManyArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationAggregateArgsSchema: z.ZodType<Prisma.OrganizationAggregateArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationGroupByArgsSchema: z.ZodType<Prisma.OrganizationGroupByArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithAggregationInputSchema.array(),OrganizationOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationScalarFieldEnumSchema.array(),
  having: OrganizationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const TicketFindFirstArgsSchema: z.ZodType<Prisma.TicketFindFirstArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  where: TicketWhereInputSchema.optional(),
  orderBy: z.union([ TicketOrderByWithRelationInputSchema.array(),TicketOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketScalarFieldEnumSchema,TicketScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TicketFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TicketFindFirstOrThrowArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  where: TicketWhereInputSchema.optional(),
  orderBy: z.union([ TicketOrderByWithRelationInputSchema.array(),TicketOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketScalarFieldEnumSchema,TicketScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TicketFindManyArgsSchema: z.ZodType<Prisma.TicketFindManyArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  where: TicketWhereInputSchema.optional(),
  orderBy: z.union([ TicketOrderByWithRelationInputSchema.array(),TicketOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketScalarFieldEnumSchema,TicketScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TicketAggregateArgsSchema: z.ZodType<Prisma.TicketAggregateArgs> = z.object({
  where: TicketWhereInputSchema.optional(),
  orderBy: z.union([ TicketOrderByWithRelationInputSchema.array(),TicketOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TicketGroupByArgsSchema: z.ZodType<Prisma.TicketGroupByArgs> = z.object({
  where: TicketWhereInputSchema.optional(),
  orderBy: z.union([ TicketOrderByWithAggregationInputSchema.array(),TicketOrderByWithAggregationInputSchema ]).optional(),
  by: TicketScalarFieldEnumSchema.array(),
  having: TicketScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TicketFindUniqueArgsSchema: z.ZodType<Prisma.TicketFindUniqueArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  where: TicketWhereUniqueInputSchema,
}).strict() ;

export const TicketFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TicketFindUniqueOrThrowArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  where: TicketWhereUniqueInputSchema,
}).strict() ;

export const TicketUpdateFindFirstArgsSchema: z.ZodType<Prisma.TicketUpdateFindFirstArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  where: TicketUpdateWhereInputSchema.optional(),
  orderBy: z.union([ TicketUpdateOrderByWithRelationInputSchema.array(),TicketUpdateOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketUpdateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketUpdateScalarFieldEnumSchema,TicketUpdateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TicketUpdateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TicketUpdateFindFirstOrThrowArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  where: TicketUpdateWhereInputSchema.optional(),
  orderBy: z.union([ TicketUpdateOrderByWithRelationInputSchema.array(),TicketUpdateOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketUpdateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketUpdateScalarFieldEnumSchema,TicketUpdateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TicketUpdateFindManyArgsSchema: z.ZodType<Prisma.TicketUpdateFindManyArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  where: TicketUpdateWhereInputSchema.optional(),
  orderBy: z.union([ TicketUpdateOrderByWithRelationInputSchema.array(),TicketUpdateOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketUpdateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketUpdateScalarFieldEnumSchema,TicketUpdateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TicketUpdateAggregateArgsSchema: z.ZodType<Prisma.TicketUpdateAggregateArgs> = z.object({
  where: TicketUpdateWhereInputSchema.optional(),
  orderBy: z.union([ TicketUpdateOrderByWithRelationInputSchema.array(),TicketUpdateOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketUpdateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TicketUpdateGroupByArgsSchema: z.ZodType<Prisma.TicketUpdateGroupByArgs> = z.object({
  where: TicketUpdateWhereInputSchema.optional(),
  orderBy: z.union([ TicketUpdateOrderByWithAggregationInputSchema.array(),TicketUpdateOrderByWithAggregationInputSchema ]).optional(),
  by: TicketUpdateScalarFieldEnumSchema.array(),
  having: TicketUpdateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TicketUpdateFindUniqueArgsSchema: z.ZodType<Prisma.TicketUpdateFindUniqueArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  where: TicketUpdateWhereUniqueInputSchema,
}).strict() ;

export const TicketUpdateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TicketUpdateFindUniqueOrThrowArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  where: TicketUpdateWhereUniqueInputSchema,
}).strict() ;

export const SatisfactionSurveyFindFirstArgsSchema: z.ZodType<Prisma.SatisfactionSurveyFindFirstArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  where: SatisfactionSurveyWhereInputSchema.optional(),
  orderBy: z.union([ SatisfactionSurveyOrderByWithRelationInputSchema.array(),SatisfactionSurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SatisfactionSurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SatisfactionSurveyScalarFieldEnumSchema,SatisfactionSurveyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SatisfactionSurveyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SatisfactionSurveyFindFirstOrThrowArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  where: SatisfactionSurveyWhereInputSchema.optional(),
  orderBy: z.union([ SatisfactionSurveyOrderByWithRelationInputSchema.array(),SatisfactionSurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SatisfactionSurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SatisfactionSurveyScalarFieldEnumSchema,SatisfactionSurveyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SatisfactionSurveyFindManyArgsSchema: z.ZodType<Prisma.SatisfactionSurveyFindManyArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  where: SatisfactionSurveyWhereInputSchema.optional(),
  orderBy: z.union([ SatisfactionSurveyOrderByWithRelationInputSchema.array(),SatisfactionSurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SatisfactionSurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SatisfactionSurveyScalarFieldEnumSchema,SatisfactionSurveyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SatisfactionSurveyAggregateArgsSchema: z.ZodType<Prisma.SatisfactionSurveyAggregateArgs> = z.object({
  where: SatisfactionSurveyWhereInputSchema.optional(),
  orderBy: z.union([ SatisfactionSurveyOrderByWithRelationInputSchema.array(),SatisfactionSurveyOrderByWithRelationInputSchema ]).optional(),
  cursor: SatisfactionSurveyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SatisfactionSurveyGroupByArgsSchema: z.ZodType<Prisma.SatisfactionSurveyGroupByArgs> = z.object({
  where: SatisfactionSurveyWhereInputSchema.optional(),
  orderBy: z.union([ SatisfactionSurveyOrderByWithAggregationInputSchema.array(),SatisfactionSurveyOrderByWithAggregationInputSchema ]).optional(),
  by: SatisfactionSurveyScalarFieldEnumSchema.array(),
  having: SatisfactionSurveyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SatisfactionSurveyFindUniqueArgsSchema: z.ZodType<Prisma.SatisfactionSurveyFindUniqueArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  where: SatisfactionSurveyWhereUniqueInputSchema,
}).strict() ;

export const SatisfactionSurveyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SatisfactionSurveyFindUniqueOrThrowArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  where: SatisfactionSurveyWhereUniqueInputSchema,
}).strict() ;

export const NotificationQueueFindFirstArgsSchema: z.ZodType<Prisma.NotificationQueueFindFirstArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  where: NotificationQueueWhereInputSchema.optional(),
  orderBy: z.union([ NotificationQueueOrderByWithRelationInputSchema.array(),NotificationQueueOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationQueueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationQueueScalarFieldEnumSchema,NotificationQueueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const NotificationQueueFindFirstOrThrowArgsSchema: z.ZodType<Prisma.NotificationQueueFindFirstOrThrowArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  where: NotificationQueueWhereInputSchema.optional(),
  orderBy: z.union([ NotificationQueueOrderByWithRelationInputSchema.array(),NotificationQueueOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationQueueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationQueueScalarFieldEnumSchema,NotificationQueueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const NotificationQueueFindManyArgsSchema: z.ZodType<Prisma.NotificationQueueFindManyArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  where: NotificationQueueWhereInputSchema.optional(),
  orderBy: z.union([ NotificationQueueOrderByWithRelationInputSchema.array(),NotificationQueueOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationQueueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationQueueScalarFieldEnumSchema,NotificationQueueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const NotificationQueueAggregateArgsSchema: z.ZodType<Prisma.NotificationQueueAggregateArgs> = z.object({
  where: NotificationQueueWhereInputSchema.optional(),
  orderBy: z.union([ NotificationQueueOrderByWithRelationInputSchema.array(),NotificationQueueOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationQueueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const NotificationQueueGroupByArgsSchema: z.ZodType<Prisma.NotificationQueueGroupByArgs> = z.object({
  where: NotificationQueueWhereInputSchema.optional(),
  orderBy: z.union([ NotificationQueueOrderByWithAggregationInputSchema.array(),NotificationQueueOrderByWithAggregationInputSchema ]).optional(),
  by: NotificationQueueScalarFieldEnumSchema.array(),
  having: NotificationQueueScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const NotificationQueueFindUniqueArgsSchema: z.ZodType<Prisma.NotificationQueueFindUniqueArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  where: NotificationQueueWhereUniqueInputSchema,
}).strict() ;

export const NotificationQueueFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.NotificationQueueFindUniqueOrThrowArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  where: NotificationQueueWhereUniqueInputSchema,
}).strict() ;

export const NotificationLogFindFirstArgsSchema: z.ZodType<Prisma.NotificationLogFindFirstArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  where: NotificationLogWhereInputSchema.optional(),
  orderBy: z.union([ NotificationLogOrderByWithRelationInputSchema.array(),NotificationLogOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationLogScalarFieldEnumSchema,NotificationLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const NotificationLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.NotificationLogFindFirstOrThrowArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  where: NotificationLogWhereInputSchema.optional(),
  orderBy: z.union([ NotificationLogOrderByWithRelationInputSchema.array(),NotificationLogOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationLogScalarFieldEnumSchema,NotificationLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const NotificationLogFindManyArgsSchema: z.ZodType<Prisma.NotificationLogFindManyArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  where: NotificationLogWhereInputSchema.optional(),
  orderBy: z.union([ NotificationLogOrderByWithRelationInputSchema.array(),NotificationLogOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ NotificationLogScalarFieldEnumSchema,NotificationLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const NotificationLogAggregateArgsSchema: z.ZodType<Prisma.NotificationLogAggregateArgs> = z.object({
  where: NotificationLogWhereInputSchema.optional(),
  orderBy: z.union([ NotificationLogOrderByWithRelationInputSchema.array(),NotificationLogOrderByWithRelationInputSchema ]).optional(),
  cursor: NotificationLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const NotificationLogGroupByArgsSchema: z.ZodType<Prisma.NotificationLogGroupByArgs> = z.object({
  where: NotificationLogWhereInputSchema.optional(),
  orderBy: z.union([ NotificationLogOrderByWithAggregationInputSchema.array(),NotificationLogOrderByWithAggregationInputSchema ]).optional(),
  by: NotificationLogScalarFieldEnumSchema.array(),
  having: NotificationLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const NotificationLogFindUniqueArgsSchema: z.ZodType<Prisma.NotificationLogFindUniqueArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  where: NotificationLogWhereUniqueInputSchema,
}).strict() ;

export const NotificationLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.NotificationLogFindUniqueOrThrowArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  where: NotificationLogWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SubscriptionCreateArgsSchema: z.ZodType<Prisma.SubscriptionCreateArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  data: z.union([ SubscriptionCreateInputSchema,SubscriptionUncheckedCreateInputSchema ]),
}).strict() ;

export const SubscriptionUpsertArgsSchema: z.ZodType<Prisma.SubscriptionUpsertArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
  create: z.union([ SubscriptionCreateInputSchema,SubscriptionUncheckedCreateInputSchema ]),
  update: z.union([ SubscriptionUpdateInputSchema,SubscriptionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SubscriptionCreateManyArgsSchema: z.ZodType<Prisma.SubscriptionCreateManyArgs> = z.object({
  data: z.union([ SubscriptionCreateManyInputSchema,SubscriptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SubscriptionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SubscriptionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SubscriptionCreateManyInputSchema,SubscriptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SubscriptionDeleteArgsSchema: z.ZodType<Prisma.SubscriptionDeleteArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() ;

export const SubscriptionUpdateArgsSchema: z.ZodType<Prisma.SubscriptionUpdateArgs> = z.object({
  select: SubscriptionSelectSchema.optional(),
  include: SubscriptionIncludeSchema.optional(),
  data: z.union([ SubscriptionUpdateInputSchema,SubscriptionUncheckedUpdateInputSchema ]),
  where: SubscriptionWhereUniqueInputSchema,
}).strict() ;

export const SubscriptionUpdateManyArgsSchema: z.ZodType<Prisma.SubscriptionUpdateManyArgs> = z.object({
  data: z.union([ SubscriptionUpdateManyMutationInputSchema,SubscriptionUncheckedUpdateManyInputSchema ]),
  where: SubscriptionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SubscriptionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SubscriptionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SubscriptionUpdateManyMutationInputSchema,SubscriptionUncheckedUpdateManyInputSchema ]),
  where: SubscriptionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SubscriptionDeleteManyArgsSchema: z.ZodType<Prisma.SubscriptionDeleteManyArgs> = z.object({
  where: SubscriptionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PlanCreateArgsSchema: z.ZodType<Prisma.PlanCreateArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  data: z.union([ PlanCreateInputSchema,PlanUncheckedCreateInputSchema ]),
}).strict() ;

export const PlanUpsertArgsSchema: z.ZodType<Prisma.PlanUpsertArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
  create: z.union([ PlanCreateInputSchema,PlanUncheckedCreateInputSchema ]),
  update: z.union([ PlanUpdateInputSchema,PlanUncheckedUpdateInputSchema ]),
}).strict() ;

export const PlanCreateManyArgsSchema: z.ZodType<Prisma.PlanCreateManyArgs> = z.object({
  data: z.union([ PlanCreateManyInputSchema,PlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PlanCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PlanCreateManyAndReturnArgs> = z.object({
  data: z.union([ PlanCreateManyInputSchema,PlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PlanDeleteArgsSchema: z.ZodType<Prisma.PlanDeleteArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  where: PlanWhereUniqueInputSchema,
}).strict() ;

export const PlanUpdateArgsSchema: z.ZodType<Prisma.PlanUpdateArgs> = z.object({
  select: PlanSelectSchema.optional(),
  include: PlanIncludeSchema.optional(),
  data: z.union([ PlanUpdateInputSchema,PlanUncheckedUpdateInputSchema ]),
  where: PlanWhereUniqueInputSchema,
}).strict() ;

export const PlanUpdateManyArgsSchema: z.ZodType<Prisma.PlanUpdateManyArgs> = z.object({
  data: z.union([ PlanUpdateManyMutationInputSchema,PlanUncheckedUpdateManyInputSchema ]),
  where: PlanWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PlanUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PlanUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PlanUpdateManyMutationInputSchema,PlanUncheckedUpdateManyInputSchema ]),
  where: PlanWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PlanDeleteManyArgsSchema: z.ZodType<Prisma.PlanDeleteManyArgs> = z.object({
  where: PlanWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const WebhookEventCreateArgsSchema: z.ZodType<Prisma.WebhookEventCreateArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  data: z.union([ WebhookEventCreateInputSchema,WebhookEventUncheckedCreateInputSchema ]),
}).strict() ;

export const WebhookEventUpsertArgsSchema: z.ZodType<Prisma.WebhookEventUpsertArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  where: WebhookEventWhereUniqueInputSchema,
  create: z.union([ WebhookEventCreateInputSchema,WebhookEventUncheckedCreateInputSchema ]),
  update: z.union([ WebhookEventUpdateInputSchema,WebhookEventUncheckedUpdateInputSchema ]),
}).strict() ;

export const WebhookEventCreateManyArgsSchema: z.ZodType<Prisma.WebhookEventCreateManyArgs> = z.object({
  data: z.union([ WebhookEventCreateManyInputSchema,WebhookEventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const WebhookEventCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WebhookEventCreateManyAndReturnArgs> = z.object({
  data: z.union([ WebhookEventCreateManyInputSchema,WebhookEventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const WebhookEventDeleteArgsSchema: z.ZodType<Prisma.WebhookEventDeleteArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  where: WebhookEventWhereUniqueInputSchema,
}).strict() ;

export const WebhookEventUpdateArgsSchema: z.ZodType<Prisma.WebhookEventUpdateArgs> = z.object({
  select: WebhookEventSelectSchema.optional(),
  data: z.union([ WebhookEventUpdateInputSchema,WebhookEventUncheckedUpdateInputSchema ]),
  where: WebhookEventWhereUniqueInputSchema,
}).strict() ;

export const WebhookEventUpdateManyArgsSchema: z.ZodType<Prisma.WebhookEventUpdateManyArgs> = z.object({
  data: z.union([ WebhookEventUpdateManyMutationInputSchema,WebhookEventUncheckedUpdateManyInputSchema ]),
  where: WebhookEventWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const WebhookEventUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.WebhookEventUpdateManyAndReturnArgs> = z.object({
  data: z.union([ WebhookEventUpdateManyMutationInputSchema,WebhookEventUncheckedUpdateManyInputSchema ]),
  where: WebhookEventWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const WebhookEventDeleteManyArgsSchema: z.ZodType<Prisma.WebhookEventDeleteManyArgs> = z.object({
  where: WebhookEventWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PaymentHistoryCreateArgsSchema: z.ZodType<Prisma.PaymentHistoryCreateArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  data: z.union([ PaymentHistoryCreateInputSchema,PaymentHistoryUncheckedCreateInputSchema ]),
}).strict() ;

export const PaymentHistoryUpsertArgsSchema: z.ZodType<Prisma.PaymentHistoryUpsertArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  where: PaymentHistoryWhereUniqueInputSchema,
  create: z.union([ PaymentHistoryCreateInputSchema,PaymentHistoryUncheckedCreateInputSchema ]),
  update: z.union([ PaymentHistoryUpdateInputSchema,PaymentHistoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const PaymentHistoryCreateManyArgsSchema: z.ZodType<Prisma.PaymentHistoryCreateManyArgs> = z.object({
  data: z.union([ PaymentHistoryCreateManyInputSchema,PaymentHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaymentHistoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentHistoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentHistoryCreateManyInputSchema,PaymentHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaymentHistoryDeleteArgsSchema: z.ZodType<Prisma.PaymentHistoryDeleteArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  where: PaymentHistoryWhereUniqueInputSchema,
}).strict() ;

export const PaymentHistoryUpdateArgsSchema: z.ZodType<Prisma.PaymentHistoryUpdateArgs> = z.object({
  select: PaymentHistorySelectSchema.optional(),
  include: PaymentHistoryIncludeSchema.optional(),
  data: z.union([ PaymentHistoryUpdateInputSchema,PaymentHistoryUncheckedUpdateInputSchema ]),
  where: PaymentHistoryWhereUniqueInputSchema,
}).strict() ;

export const PaymentHistoryUpdateManyArgsSchema: z.ZodType<Prisma.PaymentHistoryUpdateManyArgs> = z.object({
  data: z.union([ PaymentHistoryUpdateManyMutationInputSchema,PaymentHistoryUncheckedUpdateManyInputSchema ]),
  where: PaymentHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PaymentHistoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentHistoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentHistoryUpdateManyMutationInputSchema,PaymentHistoryUncheckedUpdateManyInputSchema ]),
  where: PaymentHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PaymentHistoryDeleteManyArgsSchema: z.ZodType<Prisma.PaymentHistoryDeleteManyArgs> = z.object({
  where: PaymentHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationCreateArgsSchema: z.ZodType<Prisma.OrganizationCreateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationUpsertArgsSchema: z.ZodType<Prisma.OrganizationUpsertArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
  create: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationCreateManyArgsSchema: z.ZodType<Prisma.OrganizationCreateManyArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationDeleteArgsSchema: z.ZodType<Prisma.OrganizationDeleteArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateArgsSchema: z.ZodType<Prisma.OrganizationUpdateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationUpdateManyArgs> = z.object({
  data: z.union([ OrganizationUpdateManyMutationInputSchema,OrganizationUncheckedUpdateManyInputSchema ]),
  where: OrganizationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationUpdateManyMutationInputSchema,OrganizationUncheckedUpdateManyInputSchema ]),
  where: OrganizationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrganizationDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationDeleteManyArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TicketCreateArgsSchema: z.ZodType<Prisma.TicketCreateArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  data: z.union([ TicketCreateInputSchema,TicketUncheckedCreateInputSchema ]),
}).strict() ;

export const TicketUpsertArgsSchema: z.ZodType<Prisma.TicketUpsertArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  where: TicketWhereUniqueInputSchema,
  create: z.union([ TicketCreateInputSchema,TicketUncheckedCreateInputSchema ]),
  update: z.union([ TicketUpdateInputSchema,TicketUncheckedUpdateInputSchema ]),
}).strict() ;

export const TicketCreateManyArgsSchema: z.ZodType<Prisma.TicketCreateManyArgs> = z.object({
  data: z.union([ TicketCreateManyInputSchema,TicketCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TicketCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TicketCreateManyAndReturnArgs> = z.object({
  data: z.union([ TicketCreateManyInputSchema,TicketCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TicketDeleteArgsSchema: z.ZodType<Prisma.TicketDeleteArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  where: TicketWhereUniqueInputSchema,
}).strict() ;

export const TicketUpdateArgsSchema: z.ZodType<Prisma.TicketUpdateArgs> = z.object({
  select: TicketSelectSchema.optional(),
  include: TicketIncludeSchema.optional(),
  data: z.union([ TicketUpdateInputSchema,TicketUncheckedUpdateInputSchema ]),
  where: TicketWhereUniqueInputSchema,
}).strict() ;

export const TicketUpdateManyArgsSchema: z.ZodType<Prisma.TicketUpdateManyArgs> = z.object({
  data: z.union([ TicketUpdateManyMutationInputSchema,TicketUncheckedUpdateManyInputSchema ]),
  where: TicketWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TicketUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TicketUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TicketUpdateManyMutationInputSchema,TicketUncheckedUpdateManyInputSchema ]),
  where: TicketWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TicketDeleteManyArgsSchema: z.ZodType<Prisma.TicketDeleteManyArgs> = z.object({
  where: TicketWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TicketUpdateCreateArgsSchema: z.ZodType<Prisma.TicketUpdateCreateArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  data: z.union([ TicketUpdateCreateInputSchema,TicketUpdateUncheckedCreateInputSchema ]),
}).strict() ;

export const TicketUpdateUpsertArgsSchema: z.ZodType<Prisma.TicketUpdateUpsertArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  where: TicketUpdateWhereUniqueInputSchema,
  create: z.union([ TicketUpdateCreateInputSchema,TicketUpdateUncheckedCreateInputSchema ]),
  update: z.union([ TicketUpdateUpdateInputSchema,TicketUpdateUncheckedUpdateInputSchema ]),
}).strict() ;

export const TicketUpdateCreateManyArgsSchema: z.ZodType<Prisma.TicketUpdateCreateManyArgs> = z.object({
  data: z.union([ TicketUpdateCreateManyInputSchema,TicketUpdateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TicketUpdateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TicketUpdateCreateManyAndReturnArgs> = z.object({
  data: z.union([ TicketUpdateCreateManyInputSchema,TicketUpdateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TicketUpdateDeleteArgsSchema: z.ZodType<Prisma.TicketUpdateDeleteArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  where: TicketUpdateWhereUniqueInputSchema,
}).strict() ;

export const TicketUpdateUpdateArgsSchema: z.ZodType<Prisma.TicketUpdateUpdateArgs> = z.object({
  select: TicketUpdateSelectSchema.optional(),
  include: TicketUpdateIncludeSchema.optional(),
  data: z.union([ TicketUpdateUpdateInputSchema,TicketUpdateUncheckedUpdateInputSchema ]),
  where: TicketUpdateWhereUniqueInputSchema,
}).strict() ;

export const TicketUpdateUpdateManyArgsSchema: z.ZodType<Prisma.TicketUpdateUpdateManyArgs> = z.object({
  data: z.union([ TicketUpdateUpdateManyMutationInputSchema,TicketUpdateUncheckedUpdateManyInputSchema ]),
  where: TicketUpdateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TicketUpdateUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TicketUpdateUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TicketUpdateUpdateManyMutationInputSchema,TicketUpdateUncheckedUpdateManyInputSchema ]),
  where: TicketUpdateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TicketUpdateDeleteManyArgsSchema: z.ZodType<Prisma.TicketUpdateDeleteManyArgs> = z.object({
  where: TicketUpdateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SatisfactionSurveyCreateArgsSchema: z.ZodType<Prisma.SatisfactionSurveyCreateArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  data: z.union([ SatisfactionSurveyCreateInputSchema,SatisfactionSurveyUncheckedCreateInputSchema ]),
}).strict() ;

export const SatisfactionSurveyUpsertArgsSchema: z.ZodType<Prisma.SatisfactionSurveyUpsertArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  where: SatisfactionSurveyWhereUniqueInputSchema,
  create: z.union([ SatisfactionSurveyCreateInputSchema,SatisfactionSurveyUncheckedCreateInputSchema ]),
  update: z.union([ SatisfactionSurveyUpdateInputSchema,SatisfactionSurveyUncheckedUpdateInputSchema ]),
}).strict() ;

export const SatisfactionSurveyCreateManyArgsSchema: z.ZodType<Prisma.SatisfactionSurveyCreateManyArgs> = z.object({
  data: z.union([ SatisfactionSurveyCreateManyInputSchema,SatisfactionSurveyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SatisfactionSurveyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SatisfactionSurveyCreateManyAndReturnArgs> = z.object({
  data: z.union([ SatisfactionSurveyCreateManyInputSchema,SatisfactionSurveyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SatisfactionSurveyDeleteArgsSchema: z.ZodType<Prisma.SatisfactionSurveyDeleteArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  where: SatisfactionSurveyWhereUniqueInputSchema,
}).strict() ;

export const SatisfactionSurveyUpdateArgsSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateArgs> = z.object({
  select: SatisfactionSurveySelectSchema.optional(),
  include: SatisfactionSurveyIncludeSchema.optional(),
  data: z.union([ SatisfactionSurveyUpdateInputSchema,SatisfactionSurveyUncheckedUpdateInputSchema ]),
  where: SatisfactionSurveyWhereUniqueInputSchema,
}).strict() ;

export const SatisfactionSurveyUpdateManyArgsSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateManyArgs> = z.object({
  data: z.union([ SatisfactionSurveyUpdateManyMutationInputSchema,SatisfactionSurveyUncheckedUpdateManyInputSchema ]),
  where: SatisfactionSurveyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SatisfactionSurveyUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SatisfactionSurveyUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SatisfactionSurveyUpdateManyMutationInputSchema,SatisfactionSurveyUncheckedUpdateManyInputSchema ]),
  where: SatisfactionSurveyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SatisfactionSurveyDeleteManyArgsSchema: z.ZodType<Prisma.SatisfactionSurveyDeleteManyArgs> = z.object({
  where: SatisfactionSurveyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const NotificationQueueCreateArgsSchema: z.ZodType<Prisma.NotificationQueueCreateArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  data: z.union([ NotificationQueueCreateInputSchema,NotificationQueueUncheckedCreateInputSchema ]),
}).strict() ;

export const NotificationQueueUpsertArgsSchema: z.ZodType<Prisma.NotificationQueueUpsertArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  where: NotificationQueueWhereUniqueInputSchema,
  create: z.union([ NotificationQueueCreateInputSchema,NotificationQueueUncheckedCreateInputSchema ]),
  update: z.union([ NotificationQueueUpdateInputSchema,NotificationQueueUncheckedUpdateInputSchema ]),
}).strict() ;

export const NotificationQueueCreateManyArgsSchema: z.ZodType<Prisma.NotificationQueueCreateManyArgs> = z.object({
  data: z.union([ NotificationQueueCreateManyInputSchema,NotificationQueueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const NotificationQueueCreateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationQueueCreateManyAndReturnArgs> = z.object({
  data: z.union([ NotificationQueueCreateManyInputSchema,NotificationQueueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const NotificationQueueDeleteArgsSchema: z.ZodType<Prisma.NotificationQueueDeleteArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  where: NotificationQueueWhereUniqueInputSchema,
}).strict() ;

export const NotificationQueueUpdateArgsSchema: z.ZodType<Prisma.NotificationQueueUpdateArgs> = z.object({
  select: NotificationQueueSelectSchema.optional(),
  include: NotificationQueueIncludeSchema.optional(),
  data: z.union([ NotificationQueueUpdateInputSchema,NotificationQueueUncheckedUpdateInputSchema ]),
  where: NotificationQueueWhereUniqueInputSchema,
}).strict() ;

export const NotificationQueueUpdateManyArgsSchema: z.ZodType<Prisma.NotificationQueueUpdateManyArgs> = z.object({
  data: z.union([ NotificationQueueUpdateManyMutationInputSchema,NotificationQueueUncheckedUpdateManyInputSchema ]),
  where: NotificationQueueWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const NotificationQueueUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationQueueUpdateManyAndReturnArgs> = z.object({
  data: z.union([ NotificationQueueUpdateManyMutationInputSchema,NotificationQueueUncheckedUpdateManyInputSchema ]),
  where: NotificationQueueWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const NotificationQueueDeleteManyArgsSchema: z.ZodType<Prisma.NotificationQueueDeleteManyArgs> = z.object({
  where: NotificationQueueWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const NotificationLogCreateArgsSchema: z.ZodType<Prisma.NotificationLogCreateArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  data: z.union([ NotificationLogCreateInputSchema,NotificationLogUncheckedCreateInputSchema ]),
}).strict() ;

export const NotificationLogUpsertArgsSchema: z.ZodType<Prisma.NotificationLogUpsertArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  where: NotificationLogWhereUniqueInputSchema,
  create: z.union([ NotificationLogCreateInputSchema,NotificationLogUncheckedCreateInputSchema ]),
  update: z.union([ NotificationLogUpdateInputSchema,NotificationLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const NotificationLogCreateManyArgsSchema: z.ZodType<Prisma.NotificationLogCreateManyArgs> = z.object({
  data: z.union([ NotificationLogCreateManyInputSchema,NotificationLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const NotificationLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ NotificationLogCreateManyInputSchema,NotificationLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const NotificationLogDeleteArgsSchema: z.ZodType<Prisma.NotificationLogDeleteArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  where: NotificationLogWhereUniqueInputSchema,
}).strict() ;

export const NotificationLogUpdateArgsSchema: z.ZodType<Prisma.NotificationLogUpdateArgs> = z.object({
  select: NotificationLogSelectSchema.optional(),
  include: NotificationLogIncludeSchema.optional(),
  data: z.union([ NotificationLogUpdateInputSchema,NotificationLogUncheckedUpdateInputSchema ]),
  where: NotificationLogWhereUniqueInputSchema,
}).strict() ;

export const NotificationLogUpdateManyArgsSchema: z.ZodType<Prisma.NotificationLogUpdateManyArgs> = z.object({
  data: z.union([ NotificationLogUpdateManyMutationInputSchema,NotificationLogUncheckedUpdateManyInputSchema ]),
  where: NotificationLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const NotificationLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ NotificationLogUpdateManyMutationInputSchema,NotificationLogUncheckedUpdateManyInputSchema ]),
  where: NotificationLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const NotificationLogDeleteManyArgsSchema: z.ZodType<Prisma.NotificationLogDeleteManyArgs> = z.object({
  where: NotificationLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;