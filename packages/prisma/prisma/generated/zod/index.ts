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

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','email','username','createdAt','updatedAt']);

export const SubscriptionScalarFieldEnumSchema = z.enum(['id','userId','planId','status','lemonSqueezyId','lemonSubscriptionItemId','lemonCustomerId','lemonOrderId','lemonProductId','lemonVariantId','renewsAt','endsAt','paymentMethod','cardBrand','cardLast4','createdAt','updatedAt']);

export const PlanScalarFieldEnumSchema = z.enum(['id','title','name','description','content','available','price','lemonSqueezyProductId','lemonSqueezyVariantId','createdAt','updatedAt']);

export const WebhookEventScalarFieldEnumSchema = z.enum(['id','eventId','eventName','resourceId','processedAt','payload','createdAt']);

export const PaymentHistoryScalarFieldEnumSchema = z.enum(['id','userId','invoiceId','subscriptionId','customerId','userEmail','billingReason','status','statusFormatted','currency','currencyRate','subtotal','discountTotal','tax','taxInclusive','total','refundedAmount','subtotalUsd','discountTotalUsd','taxUsd','totalUsd','refundedAmountUsd','cardBrand','cardLastFour','invoiceUrl','testMode','refundedAt','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const SubscriptionStatusSchema = z.enum(['ACTIVE','CANCELLED','EXPIRED','UNPAID','PAST_DUE']);

export type SubscriptionStatusType = `${z.infer<typeof SubscriptionStatusSchema>}`

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
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().nullable(),
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
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  subscription: z.union([z.boolean(),z.lazy(() => SubscriptionArgsSchema)]).optional(),
  paymentHistories: z.union([z.boolean(),z.lazy(() => PaymentHistoryFindManyArgsSchema)]).optional(),
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
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  clerkId: z.boolean().optional(),
  email: z.boolean().optional(),
  username: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  subscription: z.union([z.boolean(),z.lazy(() => SubscriptionArgsSchema)]).optional(),
  paymentHistories: z.union([z.boolean(),z.lazy(() => PaymentHistoryFindManyArgsSchema)]).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  subscription: z.union([ z.lazy(() => SubscriptionNullableScalarRelationFilterSchema),z.lazy(() => SubscriptionWhereInputSchema) ]).optional().nullable(),
  paymentHistories: z.lazy(() => PaymentHistoryListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  subscription: z.lazy(() => SubscriptionOrderByWithRelationInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryOrderByRelationAggregateInputSchema).optional()
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  subscription: z.union([ z.lazy(() => SubscriptionNullableScalarRelationFilterSchema),z.lazy(() => SubscriptionWhereInputSchema) ]).optional().nullable(),
  paymentHistories: z.lazy(() => PaymentHistoryListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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

export const SubscriptionNullableScalarRelationFilterSchema: z.ZodType<Prisma.SubscriptionNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => SubscriptionWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SubscriptionWhereInputSchema).optional().nullable()
}).strict();

export const PaymentHistoryListRelationFilterSchema: z.ZodType<Prisma.PaymentHistoryListRelationFilter> = z.object({
  every: z.lazy(() => PaymentHistoryWhereInputSchema).optional(),
  some: z.lazy(() => PaymentHistoryWhereInputSchema).optional(),
  none: z.lazy(() => PaymentHistoryWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const PaymentHistoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PaymentHistoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
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

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
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

export const UserCreateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserCreateWithoutSubscriptionInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  paymentHistories: z.lazy(() => PaymentHistoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSubscriptionInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSubscriptionInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSubscriptionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  paymentHistories: z.lazy(() => PaymentHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPaymentHistoriesInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subscription: z.lazy(() => SubscriptionUncheckedCreateNestedOneWithoutUserInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPaymentHistoriesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPaymentHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  subscription: z.lazy(() => SubscriptionUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
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