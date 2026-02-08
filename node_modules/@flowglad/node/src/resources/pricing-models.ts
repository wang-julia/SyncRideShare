// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class PricingModels extends APIResource {
  /**
   * Create Pricing Model
   */
  create(body: PricingModelCreateParams, options?: RequestOptions): APIPromise<PricingModelCreateResponse> {
    return this._client.post('/api/v1/pricing-models', { body, ...options });
  }

  /**
   * Get Pricing Model
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<PricingModelRetrieveResponse> {
    return this._client.get(path`/api/v1/pricing-models/${id}`, options);
  }

  /**
   * Update Pricing Model
   */
  update(
    id: string,
    body: PricingModelUpdateParams,
    options?: RequestOptions,
  ): APIPromise<PricingModelUpdateResponse> {
    return this._client.put(path`/api/v1/pricing-models/${id}`, { body, ...options });
  }

  /**
   * List Pricing Models
   */
  list(
    query: PricingModelListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PricingModelListResponse> {
    return this._client.get('/api/v1/pricing-models', { query, ...options });
  }

  /**
   * Clone a PricingModel
   */
  clone(
    id: string,
    body: PricingModelCloneParams,
    options?: RequestOptions,
  ): APIPromise<PricingModelCloneResponse> {
    return this._client.post(path`/api/v1/pricing-models/${id}/clone`, { body, ...options });
  }

  /**
   * Get Default Pricing Model for Organization
   */
  retrieveDefault(options?: RequestOptions): APIPromise<PricingModelRetrieveDefaultResponse> {
    return this._client.get('/api/v1/pricing-models/default', options);
  }
}

export interface PricingModelClientSelectSchema {
  id: string;

  /**
   * Epoch milliseconds.
   */
  createdAt: number;

  isDefault: boolean;

  livemode: boolean;

  name: string;

  organizationId: string;

  /**
   * Epoch milliseconds.
   */
  updatedAt: number;
}

export interface PricingModelCreateResponse {
  pricingModel: PricingModelClientSelectSchema;
}

export interface PricingModelRetrieveResponse {
  pricingModel: Shared.PricingModelDetailsRecord;
}

export interface PricingModelUpdateResponse {
  pricingModel: PricingModelClientSelectSchema;
}

export interface PricingModelListResponse {
  data: Array<PricingModelClientSelectSchema>;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export interface PricingModelCloneResponse {
  pricingModel: Shared.PricingModelDetailsRecord;
}

export interface PricingModelRetrieveDefaultResponse {
  pricingModel: Shared.PricingModelDetailsRecord;
}

export interface PricingModelCreateParams {
  pricingModel: PricingModelCreateParams.PricingModel;

  defaultPlanIntervalUnit?: 'day' | 'week' | 'month' | 'year';
}

export namespace PricingModelCreateParams {
  export interface PricingModel {
    name: string;

    isDefault?: boolean;
  }
}

export interface PricingModelUpdateParams {
  pricingModel: PricingModelUpdateParams.PricingModel;
}

export namespace PricingModelUpdateParams {
  export interface PricingModel {
    id: string;

    isDefault?: boolean;

    name?: string;
  }
}

export interface PricingModelListParams {
  cursor?: string;

  limit?: string;
}

export interface PricingModelCloneParams {
  /**
   * The name of the new pricing model.
   */
  name: string;

  destinationEnvironment?: 'livemode' | 'testmode';
}

export declare namespace PricingModels {
  export {
    type PricingModelClientSelectSchema as PricingModelClientSelectSchema,
    type PricingModelCreateResponse as PricingModelCreateResponse,
    type PricingModelRetrieveResponse as PricingModelRetrieveResponse,
    type PricingModelUpdateResponse as PricingModelUpdateResponse,
    type PricingModelListResponse as PricingModelListResponse,
    type PricingModelCloneResponse as PricingModelCloneResponse,
    type PricingModelRetrieveDefaultResponse as PricingModelRetrieveDefaultResponse,
    type PricingModelCreateParams as PricingModelCreateParams,
    type PricingModelUpdateParams as PricingModelUpdateParams,
    type PricingModelListParams as PricingModelListParams,
    type PricingModelCloneParams as PricingModelCloneParams,
  };
}
