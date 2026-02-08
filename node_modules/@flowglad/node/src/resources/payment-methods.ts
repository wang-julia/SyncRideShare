// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class PaymentMethods extends APIResource {
  /**
   * Get Payment Method
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<PaymentMethodRetrieveResponse> {
    return this._client.get(path`/api/v1/payment-methods/${id}`, options);
  }

  /**
   * List Payment Methods
   */
  list(
    query: PaymentMethodListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PaymentMethodListResponse> {
    return this._client.get('/api/v1/payment-methods', { query, ...options });
  }
}

export interface PaymentMethodRetrieveResponse {
  paymentMethod: Shared.PaymentMethodClientSelectSchema;
}

export interface PaymentMethodListResponse {
  data: Array<Shared.PaymentMethodClientSelectSchema>;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export interface PaymentMethodListParams {
  cursor?: string;

  limit?: string;
}

export declare namespace PaymentMethods {
  export {
    type PaymentMethodRetrieveResponse as PaymentMethodRetrieveResponse,
    type PaymentMethodListResponse as PaymentMethodListResponse,
    type PaymentMethodListParams as PaymentMethodListParams,
  };
}
