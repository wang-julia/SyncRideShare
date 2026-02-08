// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class UsageMeters extends APIResource {
  /**
   * Create Usage Meter
   */
  create(body: UsageMeterCreateParams, options?: RequestOptions): APIPromise<UsageMeterCreateResponse> {
    return this._client.post('/api/v1/usage-meters', { body, ...options });
  }

  /**
   * Get Usage Meter
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<UsageMeterRetrieveResponse> {
    return this._client.get(path`/api/v1/usage-meters/${id}`, options);
  }

  /**
   * Update Usage Meter
   */
  update(
    id: string,
    body: UsageMeterUpdateParams,
    options?: RequestOptions,
  ): APIPromise<UsageMeterUpdateResponse> {
    return this._client.put(path`/api/v1/usage-meters/${id}`, { body, ...options });
  }

  /**
   * List Usage Meters
   */
  list(
    query: UsageMeterListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UsageMeterListResponse> {
    return this._client.get('/api/v1/usage-meters', { query, ...options });
  }
}

export interface UsageMeterCreateResponse {
  usageMeter: Shared.UsageMeterClientSelectSchema;
}

export interface UsageMeterRetrieveResponse {
  usageMeter: Shared.UsageMeterClientSelectSchema;
}

export interface UsageMeterUpdateResponse {
  usageMeter: Shared.UsageMeterClientSelectSchema;
}

export interface UsageMeterListResponse {
  data: Array<Shared.UsageMeterClientSelectSchema>;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export interface UsageMeterCreateParams {
  usageMeter: UsageMeterCreateParams.UsageMeter;

  price?: UsageMeterCreateParams.Price;
}

export namespace UsageMeterCreateParams {
  export interface UsageMeter {
    name: string;

    pricingModelId: string;

    slug: string;

    /**
     * The type of aggregation to perform on the usage meter. Defaults to "sum", which
     * aggregates all the usage event amounts for the billing period.
     * "count_distinct_properties" counts the number of distinct properties in the
     * billing period for a given meter.
     */
    aggregationType?: 'sum' | 'count_distinct_properties';
  }

  export interface Price {
    type?: 'single_payment' | 'subscription' | 'usage';

    unitPrice?: number;

    usageEventsPerUnit?: number;
  }
}

export interface UsageMeterUpdateParams {
  usageMeter: UsageMeterUpdateParams.UsageMeter;
}

export namespace UsageMeterUpdateParams {
  export interface UsageMeter {
    id: string;

    /**
     * The type of aggregation to perform on the usage meter. Defaults to "sum", which
     * aggregates all the usage event amounts for the billing period.
     * "count_distinct_properties" counts the number of distinct properties in the
     * billing period for a given meter.
     */
    aggregationType?: 'sum' | 'count_distinct_properties';

    name?: string;

    slug?: string;
  }
}

export interface UsageMeterListParams {
  cursor?: string;

  limit?: string;
}

export declare namespace UsageMeters {
  export {
    type UsageMeterCreateResponse as UsageMeterCreateResponse,
    type UsageMeterRetrieveResponse as UsageMeterRetrieveResponse,
    type UsageMeterUpdateResponse as UsageMeterUpdateResponse,
    type UsageMeterListResponse as UsageMeterListResponse,
    type UsageMeterCreateParams as UsageMeterCreateParams,
    type UsageMeterUpdateParams as UsageMeterUpdateParams,
    type UsageMeterListParams as UsageMeterListParams,
  };
}
