// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as DiscountsAPI from './discounts';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Discounts extends APIResource {
  /**
   * Create Discount
   */
  create(body: DiscountCreateParams, options?: RequestOptions): APIPromise<DiscountCreateResponse> {
    return this._client.post('/api/v1/discounts', { body, ...options });
  }

  /**
   * Get Discount
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<DiscountRetrieveResponse> {
    return this._client.get(path`/api/v1/discounts/${id}`, options);
  }

  /**
   * Update Discount
   */
  update(
    id: string,
    body: DiscountUpdateParams,
    options?: RequestOptions,
  ): APIPromise<DiscountUpdateResponse> {
    return this._client.put(path`/api/v1/discounts/${id}`, { body, ...options });
  }

  /**
   * List Discounts
   */
  list(
    query: DiscountListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DiscountListResponse> {
    return this._client.get('/api/v1/discounts', { query, ...options });
  }
}

export interface DefaultDiscountClientSelectSchema {
  id: string;

  active: boolean;

  /**
   * A positive integer
   */
  amount: number;

  amountType: 'percent' | 'fixed';

  /**
   * The discount code, must be unique and between 3 and 20 characters.
   */
  code: string;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  duration: 'once';

  livemode: boolean;

  name: string;

  organizationId: string;

  pricingModelId: string;

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;

  numberOfPayments?: null;
}

export interface ForeverDiscountClientSelectSchema {
  id: string;

  active: boolean;

  /**
   * A positive integer
   */
  amount: number;

  amountType: 'percent' | 'fixed';

  /**
   * The discount code, must be unique and between 3 and 20 characters.
   */
  code: string;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  duration: 'forever';

  livemode: boolean;

  name: string;

  organizationId: string;

  pricingModelId: string;

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;

  numberOfPayments?: null;
}

export interface NumberOfPaymentsDiscountClientSelectSchema {
  id: string;

  active: boolean;

  /**
   * A positive integer
   */
  amount: number;

  amountType: 'percent' | 'fixed';

  /**
   * The discount code, must be unique and between 3 and 20 characters.
   */
  code: string;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  duration: 'number_of_payments';

  livemode: boolean;

  name: string;

  /**
   * A positive integer
   */
  numberOfPayments: number;

  organizationId: string;

  pricingModelId: string;

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;
}

export interface DiscountCreateResponse {
  /**
   * A discount record, which describes a discount that can be applied to purchases
   * or subscriptions. Discounts can be one-time, have a fixed number of payments, or
   * be applied indefinitely.
   */
  discount:
    | ForeverDiscountClientSelectSchema
    | NumberOfPaymentsDiscountClientSelectSchema
    | DefaultDiscountClientSelectSchema;
}

export interface DiscountRetrieveResponse {
  discount:
    | DiscountRetrieveResponse.DiscountsForeverDiscountClientSelectSchema
    | DiscountRetrieveResponse.DiscountsNumberOfPaymentsDiscountClientSelectSchema
    | DiscountRetrieveResponse.DiscountsDefaultDiscountClientSelectSchema;
}

export namespace DiscountRetrieveResponse {
  export interface DiscountsForeverDiscountClientSelectSchema
    extends DiscountsAPI.ForeverDiscountClientSelectSchema {
    redemptionCount: number;
  }

  export interface DiscountsNumberOfPaymentsDiscountClientSelectSchema
    extends DiscountsAPI.NumberOfPaymentsDiscountClientSelectSchema {
    redemptionCount: number;
  }

  export interface DiscountsDefaultDiscountClientSelectSchema
    extends DiscountsAPI.DefaultDiscountClientSelectSchema {
    redemptionCount: number;
  }
}

export interface DiscountUpdateResponse {
  /**
   * A discount record, which describes a discount that can be applied to purchases
   * or subscriptions. Discounts can be one-time, have a fixed number of payments, or
   * be applied indefinitely.
   */
  discount:
    | ForeverDiscountClientSelectSchema
    | NumberOfPaymentsDiscountClientSelectSchema
    | DefaultDiscountClientSelectSchema;
}

export interface DiscountListResponse {
  data: Array<
    | DiscountListResponse.DiscountsForeverDiscountClientSelectSchema
    | DiscountListResponse.DiscountsNumberOfPaymentsDiscountClientSelectSchema
    | DiscountListResponse.DiscountsDefaultDiscountClientSelectSchema
  >;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export namespace DiscountListResponse {
  export interface DiscountsForeverDiscountClientSelectSchema
    extends DiscountsAPI.ForeverDiscountClientSelectSchema {
    redemptionCount: number;
  }

  export interface DiscountsNumberOfPaymentsDiscountClientSelectSchema
    extends DiscountsAPI.NumberOfPaymentsDiscountClientSelectSchema {
    redemptionCount: number;
  }

  export interface DiscountsDefaultDiscountClientSelectSchema
    extends DiscountsAPI.DefaultDiscountClientSelectSchema {
    redemptionCount: number;
  }
}

export interface DiscountCreateParams {
  /**
   * A discount record, which describes a discount that can be applied to purchases
   * or subscriptions. Discounts can be one-time, have a fixed number of payments, or
   * be applied indefinitely.
   */
  discount:
    | DiscountCreateParams.DefaultDiscountClientInsertSchema
    | DiscountCreateParams.NumberOfPaymentsDiscountClientInsertSchema
    | DiscountCreateParams.ForeverDiscountClientInsertSchema;
}

export namespace DiscountCreateParams {
  export interface DefaultDiscountClientInsertSchema {
    /**
     * A positive integer
     */
    amount: number;

    amountType: 'percent' | 'fixed';

    /**
     * The discount code, must be unique and between 3 and 20 characters.
     */
    code: string;

    duration: 'once';

    name: string;

    active?: boolean;

    numberOfPayments?: null;

    pricingModelId?: string;
  }

  export interface NumberOfPaymentsDiscountClientInsertSchema {
    /**
     * A positive integer
     */
    amount: number;

    amountType: 'percent' | 'fixed';

    /**
     * The discount code, must be unique and between 3 and 20 characters.
     */
    code: string;

    duration: 'number_of_payments';

    name: string;

    /**
     * A positive integer
     */
    numberOfPayments: number;

    active?: boolean;

    pricingModelId?: string;
  }

  export interface ForeverDiscountClientInsertSchema {
    /**
     * A positive integer
     */
    amount: number;

    amountType: 'percent' | 'fixed';

    /**
     * The discount code, must be unique and between 3 and 20 characters.
     */
    code: string;

    duration: 'forever';

    name: string;

    active?: boolean;

    numberOfPayments?: null;

    pricingModelId?: string;
  }
}

export interface DiscountUpdateParams {
  /**
   * A discount record, which describes a discount that can be applied to purchases
   * or subscriptions. Discounts can be one-time, have a fixed number of payments, or
   * be applied indefinitely.
   */
  discount:
    | DiscountUpdateParams.DefaultDiscountClientUpdateSchema
    | DiscountUpdateParams.NumberOfPaymentsDiscountClientUpdateSchema
    | DiscountUpdateParams.ForeverDiscountClientUpdateSchema;
}

export namespace DiscountUpdateParams {
  export interface DefaultDiscountClientUpdateSchema {
    id: string;

    /**
     * A positive integer
     */
    amount: number;

    amountType: 'percent' | 'fixed';

    /**
     * The discount code, must be unique and between 3 and 20 characters.
     */
    code: string;

    duration: 'once';

    active?: boolean;

    name?: string;

    numberOfPayments?: null;
  }

  export interface NumberOfPaymentsDiscountClientUpdateSchema {
    id: string;

    /**
     * A positive integer
     */
    amount: number;

    amountType: 'percent' | 'fixed';

    /**
     * The discount code, must be unique and between 3 and 20 characters.
     */
    code: string;

    duration: 'number_of_payments';

    /**
     * A positive integer
     */
    numberOfPayments: number;

    active?: boolean;

    name?: string;
  }

  export interface ForeverDiscountClientUpdateSchema {
    id: string;

    /**
     * A positive integer
     */
    amount: number;

    amountType: 'percent' | 'fixed';

    /**
     * The discount code, must be unique and between 3 and 20 characters.
     */
    code: string;

    duration: 'forever';

    active?: boolean;

    name?: string;

    numberOfPayments?: null;
  }
}

export interface DiscountListParams {
  cursor?: string;

  limit?: string;
}

export declare namespace Discounts {
  export {
    type DefaultDiscountClientSelectSchema as DefaultDiscountClientSelectSchema,
    type ForeverDiscountClientSelectSchema as ForeverDiscountClientSelectSchema,
    type NumberOfPaymentsDiscountClientSelectSchema as NumberOfPaymentsDiscountClientSelectSchema,
    type DiscountCreateResponse as DiscountCreateResponse,
    type DiscountRetrieveResponse as DiscountRetrieveResponse,
    type DiscountUpdateResponse as DiscountUpdateResponse,
    type DiscountListResponse as DiscountListResponse,
    type DiscountCreateParams as DiscountCreateParams,
    type DiscountUpdateParams as DiscountUpdateParams,
    type DiscountListParams as DiscountListParams,
  };
}
