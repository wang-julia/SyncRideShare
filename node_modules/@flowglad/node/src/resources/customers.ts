// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as CustomersAPI from './customers';
import * as PricesAPI from './prices';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Customers extends APIResource {
  /**
   * Create Customer
   */
  create(body: CustomerCreateParams, options?: RequestOptions): APIPromise<CustomerCreateResponse> {
    return this._client.post('/api/v1/customers', { body, ...options });
  }

  /**
   * Get Customer
   */
  retrieve(externalID: string, options?: RequestOptions): APIPromise<CustomerRetrieveResponse> {
    return this._client.get(path`/api/v1/customers/${externalID}`, options);
  }

  /**
   * Update Customer
   */
  update(
    externalID: string,
    body: CustomerUpdateParams,
    options?: RequestOptions,
  ): APIPromise<CustomerUpdateResponse> {
    return this._client.put(path`/api/v1/customers/${externalID}`, { body, ...options });
  }

  /**
   * List Customers
   */
  list(
    query: CustomerListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CustomerListResponse> {
    return this._client.get('/api/v1/customers', { query, ...options });
  }

  /**
   * Get Billing Details
   */
  retrieveBilling(externalID: string, options?: RequestOptions): APIPromise<CustomerRetrieveBillingResponse> {
    return this._client.get(path`/api/v1/customers/${externalID}/billing`, options);
  }
}

export interface CustomerClientSelectSchema {
  id: string;

  archived: boolean;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  domain: string | null;

  email: string;

  externalId: string;

  iconURL: string | null;

  invoiceNumberBase: string | null;

  livemode: boolean;

  logoURL: string | null;

  name: string;

  organizationId: string;

  pricingModelId: string;

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;

  userId: string | null;

  billingAddress?: Shared.BillingAddress | null;
}

export interface NonRenewingSubscriptionDetails {
  id: string;

  backupPaymentMethodId: string | null;

  /**
   * Omitted.
   */
  billingCycleAnchorDate: null;

  cancellationReason: string | null;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  current: boolean;

  /**
   * Omitted.
   */
  currentBillingPeriodEnd: null;

  /**
   * Omitted.
   */
  currentBillingPeriodStart: null;

  customerId: string;

  defaultPaymentMethodId: string | null;

  doNotCharge: boolean | null;

  /**
   * Omitted.
   */
  interval: null;

  /**
   * Omitted.
   */
  intervalCount: null;

  isFreePlan: boolean | null;

  livemode: boolean;

  name: string | null;

  organizationId: string;

  priceId: string;

  pricingModelId: string;

  renews: boolean;

  replacedBySubscriptionId: string | null;

  runBillingAtPeriodStart: boolean | null;

  /**
   * Epoch milliseconds.
   */
  startDate: number;

  status: 'active' | 'canceled' | 'credit_trial';

  subscriptionItems: Array<NonRenewingSubscriptionDetails.SubscriptionItem>;

  /**
   * Omitted.
   */
  trialEnd: null;

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;

  /**
   * Epoch milliseconds.
   */
  canceledAt?: number | null;

  /**
   * Epoch milliseconds.
   */
  cancelScheduledAt?: number | null;

  /**
   * Experimental fields. May change without notice.
   */
  experimental?: NonRenewingSubscriptionDetails.Experimental;

  /**
   * JSON object
   */
  metadata?: { [key: string]: string | number | boolean } | null;
}

export namespace NonRenewingSubscriptionDetails {
  export interface SubscriptionItem {
    id: string;

    /**
     * Epoch milliseconds.
     */
    addedDate: number;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    externalId: string | null;

    livemode: boolean;

    manuallyCreated: boolean;

    name: string | null;

    price:
      | PricesAPI.SubscriptionPriceClientSelectSchema
      | PricesAPI.SinglePaymentPriceClientSelectSchema
      | PricesAPI.UsagePriceClientSelectSchema;

    priceId: string | null;

    pricingModelId: string;

    quantity: number;

    subscriptionId: string;

    type: 'static';

    unitPrice: number;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    /**
     * Used as a flag to soft delete a subscription item without losing its history for
     * auditability. If set, it will be removed from the subscription items list and
     * will not be included in the billing period item list. Epoch milliseconds.
     */
    expiredAt?: number | null;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;
  }

  /**
   * Experimental fields. May change without notice.
   */
  export interface Experimental {
    featureItems: Array<
      | CustomersAPI.ToggleSubscriptionItemFeatureRecord
      | CustomersAPI.UsageCreditGrantSubscriptionItemFeatureRecord
      | Experimental.ResourceSubscriptionItemFeatureRecord
    >;

    usageMeterBalances: Array<Experimental.UsageMeterBalance>;
  }

  export namespace Experimental {
    export interface ResourceSubscriptionItemFeatureRecord {
      id: string;

      amount: number;

      /**
       * Epoch milliseconds.
       */
      createdAt: number;

      featureId: string;

      livemode: boolean;

      manuallyCreated: boolean;

      name: string;

      pricingModelId: string;

      resourceId: string;

      slug: string;

      subscriptionItemId: string;

      type: 'resource';

      /**
       * Epoch milliseconds.
       */
      updatedAt: number;

      /**
       * Epoch milliseconds.
       */
      detachedAt?: number | null;

      detachedReason?: string | null;

      /**
       * Epoch milliseconds.
       */
      expiredAt?: number | null;

      productFeatureId?: string | null;

      renewalFrequency?: null;

      usageMeterId?: null;
    }

    /**
     * A usage meter and the available balance for that meter, scoped to a given
     * subscription.
     */
    export interface UsageMeterBalance {
      id: string;

      /**
       * The type of aggregation to perform on the usage meter. Defaults to "sum", which
       * aggregates all the usage event amounts for the billing period.
       * "count_distinct_properties" counts the number of distinct properties in the
       * billing period for a given meter.
       */
      aggregationType: 'sum' | 'count_distinct_properties';

      availableBalance: number;

      /**
       * Epoch milliseconds.
       */
      createdAt: number;

      livemode: boolean;

      /**
       * The name of the usage meter
       */
      name: string;

      organizationId: string;

      pricingModelId: string;

      /**
       * The slug of the usage meter
       */
      slug: string;

      subscriptionId: string;

      /**
       * Epoch milliseconds.
       */
      updatedAt: number;
    }
  }
}

export interface StandardSubscriptionDetails {
  id: string;

  backupPaymentMethodId: string | null;

  cancellationReason: string | null;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  current: boolean;

  customerId: string;

  defaultPaymentMethodId: string | null;

  doNotCharge: boolean | null;

  interval: 'day' | 'week' | 'month' | 'year';

  /**
   * A positive integer
   */
  intervalCount: number;

  isFreePlan: boolean | null;

  livemode: boolean;

  name: string | null;

  organizationId: string;

  priceId: string;

  pricingModelId: string;

  renews: true;

  replacedBySubscriptionId: string | null;

  runBillingAtPeriodStart: boolean | null;

  /**
   * Epoch milliseconds.
   */
  startDate: number;

  status:
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'unpaid'
    | 'cancellation_scheduled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'canceled'
    | 'paused';

  subscriptionItems: Array<StandardSubscriptionDetails.SubscriptionItem>;

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;

  /**
   * Epoch milliseconds.
   */
  billingCycleAnchorDate?: number | null;

  /**
   * Epoch milliseconds.
   */
  canceledAt?: number | null;

  /**
   * Epoch milliseconds.
   */
  cancelScheduledAt?: number | null;

  /**
   * Epoch milliseconds.
   */
  currentBillingPeriodEnd?: number | null;

  /**
   * Epoch milliseconds.
   */
  currentBillingPeriodStart?: number | null;

  /**
   * Experimental fields. May change without notice.
   */
  experimental?: StandardSubscriptionDetails.Experimental;

  /**
   * JSON object
   */
  metadata?: { [key: string]: string | number | boolean } | null;

  /**
   * Epoch milliseconds.
   */
  trialEnd?: number | null;
}

export namespace StandardSubscriptionDetails {
  export interface SubscriptionItem {
    id: string;

    /**
     * Epoch milliseconds.
     */
    addedDate: number;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    externalId: string | null;

    livemode: boolean;

    manuallyCreated: boolean;

    name: string | null;

    price:
      | PricesAPI.SubscriptionPriceClientSelectSchema
      | PricesAPI.SinglePaymentPriceClientSelectSchema
      | PricesAPI.UsagePriceClientSelectSchema;

    priceId: string | null;

    pricingModelId: string;

    quantity: number;

    subscriptionId: string;

    type: 'static';

    unitPrice: number;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    /**
     * Used as a flag to soft delete a subscription item without losing its history for
     * auditability. If set, it will be removed from the subscription items list and
     * will not be included in the billing period item list. Epoch milliseconds.
     */
    expiredAt?: number | null;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;
  }

  /**
   * Experimental fields. May change without notice.
   */
  export interface Experimental {
    featureItems: Array<
      | CustomersAPI.ToggleSubscriptionItemFeatureRecord
      | CustomersAPI.UsageCreditGrantSubscriptionItemFeatureRecord
      | Experimental.ResourceSubscriptionItemFeatureRecord
    >;

    usageMeterBalances: Array<Experimental.UsageMeterBalance>;
  }

  export namespace Experimental {
    export interface ResourceSubscriptionItemFeatureRecord {
      id: string;

      amount: number;

      /**
       * Epoch milliseconds.
       */
      createdAt: number;

      featureId: string;

      livemode: boolean;

      manuallyCreated: boolean;

      name: string;

      pricingModelId: string;

      resourceId: string;

      slug: string;

      subscriptionItemId: string;

      type: 'resource';

      /**
       * Epoch milliseconds.
       */
      updatedAt: number;

      /**
       * Epoch milliseconds.
       */
      detachedAt?: number | null;

      detachedReason?: string | null;

      /**
       * Epoch milliseconds.
       */
      expiredAt?: number | null;

      productFeatureId?: string | null;

      renewalFrequency?: null;

      usageMeterId?: null;
    }

    /**
     * A usage meter and the available balance for that meter, scoped to a given
     * subscription.
     */
    export interface UsageMeterBalance {
      id: string;

      /**
       * The type of aggregation to perform on the usage meter. Defaults to "sum", which
       * aggregates all the usage event amounts for the billing period.
       * "count_distinct_properties" counts the number of distinct properties in the
       * billing period for a given meter.
       */
      aggregationType: 'sum' | 'count_distinct_properties';

      availableBalance: number;

      /**
       * Epoch milliseconds.
       */
      createdAt: number;

      livemode: boolean;

      /**
       * The name of the usage meter
       */
      name: string;

      organizationId: string;

      pricingModelId: string;

      /**
       * The slug of the usage meter
       */
      slug: string;

      subscriptionId: string;

      /**
       * Epoch milliseconds.
       */
      updatedAt: number;
    }
  }
}

export interface ToggleSubscriptionItemFeatureRecord {
  id: string;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  featureId: string;

  livemode: boolean;

  manuallyCreated: boolean;

  name: string;

  pricingModelId: string;

  slug: string;

  subscriptionItemId: string;

  type: 'toggle';

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;

  amount?: null;

  /**
   * Epoch milliseconds.
   */
  detachedAt?: number | null;

  detachedReason?: string | null;

  /**
   * Epoch milliseconds.
   */
  expiredAt?: number | null;

  productFeatureId?: string | null;

  renewalFrequency?: null;

  resourceId?: null;

  usageMeterId?: null;
}

export interface UsageCreditGrantSubscriptionItemFeatureRecord {
  id: string;

  amount: number;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  featureId: string;

  livemode: boolean;

  manuallyCreated: boolean;

  name: string;

  pricingModelId: string;

  renewalFrequency: 'once' | 'every_billing_period';

  slug: string;

  subscriptionItemId: string;

  type: 'usage_credit_grant';

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;

  usageMeterId: string;

  /**
   * Epoch milliseconds.
   */
  detachedAt?: number | null;

  detachedReason?: string | null;

  /**
   * Epoch milliseconds.
   */
  expiredAt?: number | null;

  productFeatureId?: string | null;

  resourceId?: null;
}

export interface CustomerCreateResponse {
  data: CustomerCreateResponse.Data;
}

export namespace CustomerCreateResponse {
  export interface Data {
    customer: CustomersAPI.CustomerClientSelectSchema;

    subscription?: Shared.StandardSubscriptionRecord | Shared.NonRenewingSubscriptionRecord;

    subscriptionItems?: Array<Data.SubscriptionItem>;
  }

  export namespace Data {
    export interface SubscriptionItem {
      id: string;

      /**
       * Epoch milliseconds.
       */
      addedDate: number;

      /**
       * Epoch milliseconds.
       */
      createdAt: number;

      externalId: string | null;

      livemode: boolean;

      manuallyCreated: boolean;

      name: string | null;

      priceId: string | null;

      pricingModelId: string;

      quantity: number;

      subscriptionId: string;

      type: 'static';

      unitPrice: number;

      /**
       * Epoch milliseconds.
       */
      updatedAt: number;

      /**
       * Used as a flag to soft delete a subscription item without losing its history for
       * auditability. If set, it will be removed from the subscription items list and
       * will not be included in the billing period item list. Epoch milliseconds.
       */
      expiredAt?: number | null;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;
    }
  }
}

export interface CustomerRetrieveResponse {
  customer: CustomerClientSelectSchema;
}

export interface CustomerUpdateResponse {
  customer: CustomerClientSelectSchema;
}

export interface CustomerListResponse {
  data: Array<CustomerClientSelectSchema>;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export interface CustomerRetrieveBillingResponse {
  /**
   * The billing portal URL for the customer
   */
  billingPortalUrl: string;

  catalog: Shared.PricingModelDetailsRecord;

  customer: CustomerClientSelectSchema;

  invoices: Array<CustomerRetrieveBillingResponse.Invoice>;

  paymentMethods: Array<Shared.PaymentMethodClientSelectSchema>;

  pricingModel: Shared.PricingModelDetailsRecord;

  purchases: Array<
    | CustomerRetrieveBillingResponse.SubscriptionPurchaseClientSelectSchema
    | CustomerRetrieveBillingResponse.SinglePaymentPurchaseClientSelectSchema
    | CustomerRetrieveBillingResponse.UsagePurchaseClientSelectSchema
  >;

  subscriptions: Array<NonRenewingSubscriptionDetails | StandardSubscriptionDetails>;

  /**
   * The most recently created current subscription for the customer. If createdAt
   * timestamps tie, the most recently updated subscription will be returned. If
   * updatedAt also ties, subscription id is used as the final tiebreaker.
   */
  currentSubscription?: NonRenewingSubscriptionDetails | StandardSubscriptionDetails;

  /**
   * The current subscriptions for the customer. By default, customers can only have
   * one active subscription at a time. This will only return multiple subscriptions
   * if you have enabled multiple subscriptions per customer.
   */
  currentSubscriptions?: Array<NonRenewingSubscriptionDetails | StandardSubscriptionDetails>;
}

export namespace CustomerRetrieveBillingResponse {
  export interface Invoice {
    /**
     * An invoice record, which describes a bill that can be associated with a
     * purchase, subscription, or stand alone. Each invoice has a specific type that
     * determines its behavior and required fields.
     */
    invoice:
      | Shared.PurchaseInvoiceClientSelectSchema
      | Shared.SubscriptionInvoiceClientSelectSchema
      | Shared.StandaloneInvoiceClientSelectSchema;

    invoiceLineItems: Array<
      Shared.StaticInvoiceLineItemClientSelectSchema | Shared.UsageInvoiceLineItemClientSelectSchema
    >;
  }

  export interface SubscriptionPurchaseClientSelectSchema {
    id: string;

    archived: boolean | null;

    bankPaymentOnly: boolean | null;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    customerId: string;

    firstInvoiceValue: number;

    /**
     * A positive integer
     */
    intervalCount: number;

    intervalUnit: 'day' | 'week' | 'month' | 'year';

    livemode: boolean;

    name: string;

    organizationId: string;

    position: number;

    priceId: string;

    /**
     * A positive integer
     */
    pricePerBillingCycle: number;

    priceType: 'subscription';

    pricingModelId: string;

    proposal: string | null;

    /**
     * A positive integer
     */
    quantity: number;

    status: 'open' | 'pending' | 'failed' | 'paid' | 'refunded' | 'partial_refund' | 'fraudulent';

    /**
     * Omitted.
     */
    totalPurchaseValue: null;

    trialPeriodDays: number;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    billingAddress?: Shared.BillingAddress | null;

    /**
     * Epoch milliseconds.
     */
    billingCycleAnchor?: number | null;

    /**
     * Epoch milliseconds.
     */
    endDate?: number | null;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;

    /**
     * Epoch milliseconds.
     */
    purchaseDate?: number | null;
  }

  export interface SinglePaymentPurchaseClientSelectSchema {
    id: string;

    archived: boolean | null;

    bankPaymentOnly: boolean | null;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    customerId: string;

    firstInvoiceValue: number;

    /**
     * Omitted.
     */
    intervalCount: null;

    /**
     * Omitted.
     */
    intervalUnit: null;

    livemode: boolean;

    name: string;

    organizationId: string;

    position: number;

    priceId: string;

    /**
     * Omitted.
     */
    pricePerBillingCycle: null;

    priceType: 'single_payment';

    pricingModelId: string;

    proposal: string | null;

    /**
     * A positive integer
     */
    quantity: number;

    status: 'open' | 'pending' | 'failed' | 'paid' | 'refunded' | 'partial_refund' | 'fraudulent';

    totalPurchaseValue: number;

    /**
     * Omitted.
     */
    trialPeriodDays: null;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    billingAddress?: Shared.BillingAddress | null;

    /**
     * Epoch milliseconds.
     */
    billingCycleAnchor?: number | null;

    /**
     * Epoch milliseconds.
     */
    endDate?: number | null;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;

    /**
     * Epoch milliseconds.
     */
    purchaseDate?: number | null;
  }

  export interface UsagePurchaseClientSelectSchema {
    id: string;

    archived: boolean | null;

    bankPaymentOnly: boolean | null;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    customerId: string;

    firstInvoiceValue: number;

    /**
     * Omitted.
     */
    intervalCount: null;

    /**
     * Omitted.
     */
    intervalUnit: null;

    livemode: boolean;

    name: string;

    organizationId: string;

    position: number;

    priceId: string;

    /**
     * Omitted.
     */
    pricePerBillingCycle: null;

    priceType: 'usage';

    pricingModelId: string;

    proposal: string | null;

    /**
     * A positive integer
     */
    quantity: number;

    status: 'open' | 'pending' | 'failed' | 'paid' | 'refunded' | 'partial_refund' | 'fraudulent';

    totalPurchaseValue: number;

    /**
     * Omitted.
     */
    trialPeriodDays: null;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    billingAddress?: Shared.BillingAddress | null;

    /**
     * Epoch milliseconds.
     */
    billingCycleAnchor?: number | null;

    /**
     * Epoch milliseconds.
     */
    endDate?: number | null;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;

    /**
     * Epoch milliseconds.
     */
    purchaseDate?: number | null;
  }
}

export interface CustomerCreateParams {
  customer: CustomerCreateParams.Customer;
}

export namespace CustomerCreateParams {
  export interface Customer {
    email: string;

    externalId: string;

    name: string;

    archived?: boolean;

    domain?: string | null;

    iconURL?: string | null;

    logoURL?: string | null;

    userId?: string | null;
  }
}

export interface CustomerUpdateParams {
  customer: CustomerUpdateParams.Customer;
}

export namespace CustomerUpdateParams {
  export interface Customer {
    archived?: boolean;

    domain?: string | null;

    email?: string;

    iconURL?: string | null;

    logoURL?: string | null;

    name?: string;

    userId?: string | null;
  }
}

export interface CustomerListParams {
  cursor?: string;

  limit?: string;
}

export declare namespace Customers {
  export {
    type CustomerClientSelectSchema as CustomerClientSelectSchema,
    type NonRenewingSubscriptionDetails as NonRenewingSubscriptionDetails,
    type StandardSubscriptionDetails as StandardSubscriptionDetails,
    type ToggleSubscriptionItemFeatureRecord as ToggleSubscriptionItemFeatureRecord,
    type UsageCreditGrantSubscriptionItemFeatureRecord as UsageCreditGrantSubscriptionItemFeatureRecord,
    type CustomerCreateResponse as CustomerCreateResponse,
    type CustomerRetrieveResponse as CustomerRetrieveResponse,
    type CustomerUpdateResponse as CustomerUpdateResponse,
    type CustomerListResponse as CustomerListResponse,
    type CustomerRetrieveBillingResponse as CustomerRetrieveBillingResponse,
    type CustomerCreateParams as CustomerCreateParams,
    type CustomerUpdateParams as CustomerUpdateParams,
    type CustomerListParams as CustomerListParams,
  };
}
