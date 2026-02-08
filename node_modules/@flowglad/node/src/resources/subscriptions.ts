// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Subscriptions extends APIResource {
  /**
   * Create Subscription
   */
  create(body: SubscriptionCreateParams, options?: RequestOptions): APIPromise<SubscriptionCreateResponse> {
    return this._client.post('/api/v1/subscriptions', { body, ...options });
  }

  /**
   * Get Subscription
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<SubscriptionRetrieveResponse> {
    return this._client.get(path`/api/v1/subscriptions/${id}`, options);
  }

  /**
   * List Subscriptions
   */
  list(
    query: SubscriptionListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SubscriptionListResponse> {
    return this._client.get('/api/v1/subscriptions', { query, ...options });
  }

  /**
   * Adjust an active subscription by changing its plan or quantity. Supports
   * immediate adjustments with proration, end-of-billing-period adjustments for
   * downgrades, and auto timing that automatically chooses based on whether it's an
   * upgrade or downgrade. Also supports priceSlug for referencing prices by slug
   * instead of id. For immediate adjustments with proration, this endpoint waits for
   * the billing run to complete before returning, ensuring the subscription is fully
   * updated.
   */
  adjust(
    id: string,
    body: SubscriptionAdjustParams,
    options?: RequestOptions,
  ): APIPromise<SubscriptionAdjustResponse> {
    return this._client.post(path`/api/v1/subscriptions/${id}/adjust`, { body, ...options });
  }

  /**
   * Cancel Subscription
   */
  cancel(
    id: string,
    body: SubscriptionCancelParams,
    options?: RequestOptions,
  ): APIPromise<SubscriptionCancelResponse> {
    return this._client.post(path`/api/v1/subscriptions/${id}/cancel`, { body, ...options });
  }

  /**
   * Reverses a scheduled subscription cancellation. The subscription must be in
   * `cancellation_scheduled` status. This will restore the subscription to its
   * previous status (typically `active` or `trialing`) and reschedule any billing
   * runs that were aborted. For paid subscriptions, a valid payment method is
   * required.
   */
  uncancel(id: string, options?: RequestOptions): APIPromise<SubscriptionUncancelResponse> {
    return this._client.post(path`/api/v1/subscriptions/${id}/uncancel`, options);
  }
}

export interface SubscriptionCreateResponse {
  subscription: Shared.StandardSubscriptionRecord | Shared.NonRenewingSubscriptionRecord;
}

export interface SubscriptionRetrieveResponse {
  subscription: Shared.StandardSubscriptionRecord | Shared.NonRenewingSubscriptionRecord;
}

export interface SubscriptionListResponse {
  data: Array<Shared.StandardSubscriptionRecord | Shared.NonRenewingSubscriptionRecord>;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export interface SubscriptionAdjustResponse {
  /**
   * Whether this adjustment is an upgrade (true) or downgrade/lateral move (false).
   * An upgrade means the new plan total is greater than the old plan total.
   */
  isUpgrade: boolean;

  /**
   * The actual timing applied. When 'auto' timing is requested, this indicates
   * whether the adjustment was applied immediately (for upgrades) or at the end of
   * the billing period (for downgrades).
   */
  resolvedTiming: 'immediately' | 'at_end_of_current_billing_period';

  subscription: Shared.StandardSubscriptionRecord | Shared.NonRenewingSubscriptionRecord;

  subscriptionItems: Array<SubscriptionAdjustResponse.SubscriptionItem>;
}

export namespace SubscriptionAdjustResponse {
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

export interface SubscriptionCancelResponse {
  subscription: Shared.StandardSubscriptionRecord | Shared.NonRenewingSubscriptionRecord;
}

export interface SubscriptionUncancelResponse {
  subscription: Shared.StandardSubscriptionRecord | Shared.NonRenewingSubscriptionRecord;
}

export interface SubscriptionCreateParams {
  /**
   * The payment method to try if charges for the subscription fail with the default
   * payment method.
   */
  backupPaymentMethodId?: string;

  /**
   * The external ID of the customer. If not provided, customerId is required.
   */
  customerExternalId?: string;

  /**
   * The internal ID of the customer. If not provided, customerExternalId is
   * required.
   */
  customerId?: string;

  /**
   * The default payment method to use when attempting to run charges for the
   * subscription.If not provided, the customer's default payment method will be
   * used. If no default payment method is present, charges will not run. If no
   * default payment method is provided and there is a trial period for the
   * subscription, the subscription will enter 'trial_ended' status at the end of the
   * trial period.
   */
  defaultPaymentMethodId?: string;

  /**
   * If true, the subscription item's unitPrice will be set to 0, resulting in no
   * charges. The original price.unitPrice value in the price record remains
   * unchanged.
   */
  doNotCharge?: boolean;

  /**
   * The interval of the subscription. If not provided, defaults to the interval of
   * the price provided by `priceId` or `priceSlug`.
   */
  interval?: 'day' | 'week' | 'month' | 'year';

  /**
   * The number of intervals that each billing period will last. If not provided,
   * defaults to 1
   */
  intervalCount?: number;

  /**
   * JSON object
   */
  metadata?: { [key: string]: string | number | boolean };

  /**
   * The name of the subscription. If not provided, defaults to the name of the
   * product associated with the price provided by 'priceId' or 'priceSlug'.
   */
  name?: string;

  /**
   * The id of the price to subscribe to. If not provided, priceSlug is required.
   * Used to determine whether the subscription is usage-based or not, and set other
   * defaults such as trial period and billing intervals.
   */
  priceId?: string;

  /**
   * The slug of the price to subscribe to. If not provided, priceId is required.
   * Price slugs are scoped to the customer's pricing model. Used to determine
   * whether the subscription is usage-based or not, and set other defaults such as
   * trial period and billing intervals.
   */
  priceSlug?: string;

  /**
   * The quantity of the price purchased. If not provided, defaults to 1.
   */
  quantity?: number;

  /**
   * The time when the subscription starts. If not provided, defaults to current
   * time.
   */
  startDate?: string;

  /**
   * Epoch time in milliseconds of when the trial ends. If not provided, defaults to
   * startDate + the associated price's trialPeriodDays
   */
  trialEnd?: number;
}

export interface SubscriptionListParams {
  cursor?: string;

  limit?: string;
}

export interface SubscriptionAdjustParams {
  adjustment:
    | SubscriptionAdjustParams.AdjustSubscriptionImmediatelyInput
    | SubscriptionAdjustParams.AdjustSubscriptionAtEndOfCurrentBillingPeriodInput
    | SubscriptionAdjustParams.AdjustSubscriptionAutoTimingInput;
}

export namespace SubscriptionAdjustParams {
  export interface AdjustSubscriptionImmediatelyInput {
    newSubscriptionItems: Array<
      | AdjustSubscriptionImmediatelyInput.StaticSubscriptionItemClientInsertSchema
      | AdjustSubscriptionImmediatelyInput.StaticSubscriptionItemClientSelectSchema
      | AdjustSubscriptionImmediatelyInput.SubscriptionItemWithPriceSlugInput
      | AdjustSubscriptionImmediatelyInput.TerseSubscriptionItem
    >;

    /**
     * Apply the adjustment immediately.
     */
    timing: 'immediately';

    /**
     * Whether to prorate the current billing period. Defaults to true for immediate
     * adjustments.
     */
    prorateCurrentBillingPeriod?: boolean;
  }

  export namespace AdjustSubscriptionImmediatelyInput {
    export interface StaticSubscriptionItemClientInsertSchema {
      /**
       * Epoch milliseconds.
       */
      addedDate: number;

      quantity: number;

      subscriptionId: string;

      type: 'static';

      unitPrice: number;

      /**
       * Used as a flag to soft delete a subscription item without losing its history for
       * auditability. If set, it will be removed from the subscription items list and
       * will not be included in the billing period item list. Epoch milliseconds.
       */
      expiredAt?: number | null;

      externalId?: string | null;

      manuallyCreated?: boolean;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;

      name?: string | null;

      priceId?: string | null;
    }

    export interface StaticSubscriptionItemClientSelectSchema {
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

    export interface SubscriptionItemWithPriceSlugInput {
      /**
       * Epoch milliseconds.
       */
      addedDate: number;

      quantity: number;

      subscriptionId: string;

      type: 'static';

      unitPrice: number;

      /**
       * Used as a flag to soft delete a subscription item without losing its history for
       * auditability. If set, it will be removed from the subscription items list and
       * will not be included in the billing period item list. Epoch milliseconds.
       */
      expiredAt?: number | null;

      externalId?: string | null;

      manuallyCreated?: boolean;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;

      name?: string | null;

      priceId?: string | null;

      /**
       * The slug of the price to subscribe to. If not provided, priceId is required.
       * Price slugs are scoped to the customer's pricing model. Used to determine
       * whether the subscription is usage-based or not, and set other defaults such as
       * trial period and billing intervals.
       */
      priceSlug?: string;
    }

    export interface TerseSubscriptionItem {
      /**
       * The id of the price to subscribe to. If not provided, priceSlug is required.
       * Used to determine whether the subscription is usage-based or not, and set other
       * defaults such as trial period and billing intervals.
       */
      priceId?: string;

      /**
       * The slug of the price to subscribe to. If not provided, priceId is required.
       * Price slugs are scoped to the customer's pricing model. Used to determine
       * whether the subscription is usage-based or not, and set other defaults such as
       * trial period and billing intervals.
       */
      priceSlug?: string;

      /**
       * The quantity of units. Defaults to 1.
       */
      quantity?: number;
    }
  }

  export interface AdjustSubscriptionAtEndOfCurrentBillingPeriodInput {
    newSubscriptionItems: Array<
      | AdjustSubscriptionAtEndOfCurrentBillingPeriodInput.StaticSubscriptionItemClientInsertSchema
      | AdjustSubscriptionAtEndOfCurrentBillingPeriodInput.StaticSubscriptionItemClientSelectSchema
      | AdjustSubscriptionAtEndOfCurrentBillingPeriodInput.SubscriptionItemWithPriceSlugInput
      | AdjustSubscriptionAtEndOfCurrentBillingPeriodInput.TerseSubscriptionItem
    >;

    timing: 'at_end_of_current_billing_period';
  }

  export namespace AdjustSubscriptionAtEndOfCurrentBillingPeriodInput {
    export interface StaticSubscriptionItemClientInsertSchema {
      /**
       * Epoch milliseconds.
       */
      addedDate: number;

      quantity: number;

      subscriptionId: string;

      type: 'static';

      unitPrice: number;

      /**
       * Used as a flag to soft delete a subscription item without losing its history for
       * auditability. If set, it will be removed from the subscription items list and
       * will not be included in the billing period item list. Epoch milliseconds.
       */
      expiredAt?: number | null;

      externalId?: string | null;

      manuallyCreated?: boolean;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;

      name?: string | null;

      priceId?: string | null;
    }

    export interface StaticSubscriptionItemClientSelectSchema {
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

    export interface SubscriptionItemWithPriceSlugInput {
      /**
       * Epoch milliseconds.
       */
      addedDate: number;

      quantity: number;

      subscriptionId: string;

      type: 'static';

      unitPrice: number;

      /**
       * Used as a flag to soft delete a subscription item without losing its history for
       * auditability. If set, it will be removed from the subscription items list and
       * will not be included in the billing period item list. Epoch milliseconds.
       */
      expiredAt?: number | null;

      externalId?: string | null;

      manuallyCreated?: boolean;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;

      name?: string | null;

      priceId?: string | null;

      /**
       * The slug of the price to subscribe to. If not provided, priceId is required.
       * Price slugs are scoped to the customer's pricing model. Used to determine
       * whether the subscription is usage-based or not, and set other defaults such as
       * trial period and billing intervals.
       */
      priceSlug?: string;
    }

    export interface TerseSubscriptionItem {
      /**
       * The id of the price to subscribe to. If not provided, priceSlug is required.
       * Used to determine whether the subscription is usage-based or not, and set other
       * defaults such as trial period and billing intervals.
       */
      priceId?: string;

      /**
       * The slug of the price to subscribe to. If not provided, priceId is required.
       * Price slugs are scoped to the customer's pricing model. Used to determine
       * whether the subscription is usage-based or not, and set other defaults such as
       * trial period and billing intervals.
       */
      priceSlug?: string;

      /**
       * The quantity of units. Defaults to 1.
       */
      quantity?: number;
    }
  }

  export interface AdjustSubscriptionAutoTimingInput {
    newSubscriptionItems: Array<
      | AdjustSubscriptionAutoTimingInput.StaticSubscriptionItemClientInsertSchema
      | AdjustSubscriptionAutoTimingInput.StaticSubscriptionItemClientSelectSchema
      | AdjustSubscriptionAutoTimingInput.SubscriptionItemWithPriceSlugInput
      | AdjustSubscriptionAutoTimingInput.TerseSubscriptionItem
    >;

    /**
     * Automatically determine timing: upgrades happen immediately, downgrades at end
     * of period.
     */
    timing: 'auto';

    /**
     * Whether to prorate if the adjustment is applied immediately. Defaults to true.
     */
    prorateCurrentBillingPeriod?: boolean;
  }

  export namespace AdjustSubscriptionAutoTimingInput {
    export interface StaticSubscriptionItemClientInsertSchema {
      /**
       * Epoch milliseconds.
       */
      addedDate: number;

      quantity: number;

      subscriptionId: string;

      type: 'static';

      unitPrice: number;

      /**
       * Used as a flag to soft delete a subscription item without losing its history for
       * auditability. If set, it will be removed from the subscription items list and
       * will not be included in the billing period item list. Epoch milliseconds.
       */
      expiredAt?: number | null;

      externalId?: string | null;

      manuallyCreated?: boolean;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;

      name?: string | null;

      priceId?: string | null;
    }

    export interface StaticSubscriptionItemClientSelectSchema {
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

    export interface SubscriptionItemWithPriceSlugInput {
      /**
       * Epoch milliseconds.
       */
      addedDate: number;

      quantity: number;

      subscriptionId: string;

      type: 'static';

      unitPrice: number;

      /**
       * Used as a flag to soft delete a subscription item without losing its history for
       * auditability. If set, it will be removed from the subscription items list and
       * will not be included in the billing period item list. Epoch milliseconds.
       */
      expiredAt?: number | null;

      externalId?: string | null;

      manuallyCreated?: boolean;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;

      name?: string | null;

      priceId?: string | null;

      /**
       * The slug of the price to subscribe to. If not provided, priceId is required.
       * Price slugs are scoped to the customer's pricing model. Used to determine
       * whether the subscription is usage-based or not, and set other defaults such as
       * trial period and billing intervals.
       */
      priceSlug?: string;
    }

    export interface TerseSubscriptionItem {
      /**
       * The id of the price to subscribe to. If not provided, priceSlug is required.
       * Used to determine whether the subscription is usage-based or not, and set other
       * defaults such as trial period and billing intervals.
       */
      priceId?: string;

      /**
       * The slug of the price to subscribe to. If not provided, priceId is required.
       * Price slugs are scoped to the customer's pricing model. Used to determine
       * whether the subscription is usage-based or not, and set other defaults such as
       * trial period and billing intervals.
       */
      priceSlug?: string;

      /**
       * The quantity of units. Defaults to 1.
       */
      quantity?: number;
    }
  }
}

export interface SubscriptionCancelParams {
  cancellation:
    | SubscriptionCancelParams.CancelSubscriptionAtEndOfBillingPeriodInput
    | SubscriptionCancelParams.CancelSubscriptionImmediatelyInput;
}

export namespace SubscriptionCancelParams {
  export interface CancelSubscriptionAtEndOfBillingPeriodInput {
    timing: 'at_end_of_current_billing_period';
  }

  export interface CancelSubscriptionImmediatelyInput {
    timing: 'immediately';
  }
}

export declare namespace Subscriptions {
  export {
    type SubscriptionCreateResponse as SubscriptionCreateResponse,
    type SubscriptionRetrieveResponse as SubscriptionRetrieveResponse,
    type SubscriptionListResponse as SubscriptionListResponse,
    type SubscriptionAdjustResponse as SubscriptionAdjustResponse,
    type SubscriptionCancelResponse as SubscriptionCancelResponse,
    type SubscriptionUncancelResponse as SubscriptionUncancelResponse,
    type SubscriptionCreateParams as SubscriptionCreateParams,
    type SubscriptionListParams as SubscriptionListParams,
    type SubscriptionAdjustParams as SubscriptionAdjustParams,
    type SubscriptionCancelParams as SubscriptionCancelParams,
  };
}
