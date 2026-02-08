// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Resources extends APIResource {
  /**
   * Create Resource
   */
  create(body: ResourceCreateParams, options?: RequestOptions): APIPromise<ResourceCreateResponse> {
    return this._client.post('/api/v1/resources', { body, ...options });
  }

  /**
   * Get Resource
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<ResourceRetrieveResponse> {
    return this._client.get(path`/api/v1/resources/${id}`, options);
  }

  /**
   * Update Resource
   */
  update(
    id: string,
    body: ResourceUpdateParams,
    options?: RequestOptions,
  ): APIPromise<ResourceUpdateResponse> {
    return this._client.put(path`/api/v1/resources/${id}`, { body, ...options });
  }

  /**
   * List Resources
   */
  list(query: ResourceListParams, options?: RequestOptions): APIPromise<ResourceListResponse> {
    return this._client.get('/api/v1/resources', { query, ...options });
  }
}

export interface ResourceCreateResponse {
  resource: ResourceCreateResponse.Resource;
}

export namespace ResourceCreateResponse {
  export interface Resource {
    id: string;

    active: boolean;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    livemode: boolean;

    name: string;

    organizationId: string;

    pricingModelId: string;

    slug: string;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;
  }
}

export interface ResourceRetrieveResponse {
  resource: ResourceRetrieveResponse.Resource;
}

export namespace ResourceRetrieveResponse {
  export interface Resource {
    id: string;

    active: boolean;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    livemode: boolean;

    name: string;

    organizationId: string;

    pricingModelId: string;

    slug: string;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;
  }
}

export interface ResourceUpdateResponse {
  resource: ResourceUpdateResponse.Resource;
}

export namespace ResourceUpdateResponse {
  export interface Resource {
    id: string;

    active: boolean;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    livemode: boolean;

    name: string;

    organizationId: string;

    pricingModelId: string;

    slug: string;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;
  }
}

export interface ResourceListResponse {
  resources: Array<ResourceListResponse.Resource>;
}

export namespace ResourceListResponse {
  export interface Resource {
    id: string;

    active: boolean;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    livemode: boolean;

    name: string;

    organizationId: string;

    pricingModelId: string;

    slug: string;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;
  }
}

export interface ResourceCreateParams {
  resource: ResourceCreateParams.Resource;
}

export namespace ResourceCreateParams {
  export interface Resource {
    name: string;

    pricingModelId: string;

    slug: string;

    active?: boolean;
  }
}

export interface ResourceUpdateParams {
  resource: ResourceUpdateParams.Resource;
}

export namespace ResourceUpdateParams {
  export interface Resource {
    id: string;

    active?: boolean;

    name?: string;

    slug?: string;
  }
}

export interface ResourceListParams {
  pricingModelId: string;
}

export declare namespace Resources {
  export {
    type ResourceCreateResponse as ResourceCreateResponse,
    type ResourceRetrieveResponse as ResourceRetrieveResponse,
    type ResourceUpdateResponse as ResourceUpdateResponse,
    type ResourceListResponse as ResourceListResponse,
    type ResourceCreateParams as ResourceCreateParams,
    type ResourceUpdateParams as ResourceUpdateParams,
    type ResourceListParams as ResourceListParams,
  };
}
