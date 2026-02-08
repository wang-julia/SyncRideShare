// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class ResourceClaims extends APIResource {
  /**
   * Claim a resource for a subscription. Exactly one of quantity, externalId, or
   * externalIds must be provided.
   */
  claim(
    subscriptionID: string,
    body: ResourceClaimClaimParams,
    options?: RequestOptions,
  ): APIPromise<ResourceClaimClaimResponse> {
    return this._client.post(path`/api/v1/resource-claims/${subscriptionID}/claim`, { body, ...options });
  }

  /**
   * List resource usage information for all resources on the subscription.
   */
  listUsages(
    subscriptionID: string,
    query: ResourceClaimListUsagesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ResourceClaimListUsagesResponse> {
    return this._client.get(path`/api/v1/resource-claims/${subscriptionID}/usages`, { query, ...options });
  }

  /**
   * Release claimed resources for a subscription. Exactly one of quantity,
   * externalId, externalIds, or claimIds must be provided.
   */
  release(
    subscriptionID: string,
    body: ResourceClaimReleaseParams,
    options?: RequestOptions,
  ): APIPromise<ResourceClaimReleaseResponse> {
    return this._client.post(path`/api/v1/resource-claims/${subscriptionID}/release`, { body, ...options });
  }

  /**
   * Get resource usage information for a subscription. Exactly one of resourceSlug
   * or resourceId must be provided.
   */
  retrieveUsage(
    subscriptionID: string,
    query: ResourceClaimRetrieveUsageParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ResourceClaimRetrieveUsageResponse> {
    return this._client.get(path`/api/v1/resource-claims/${subscriptionID}/usage`, { query, ...options });
  }
}

export interface ResourceClaimClaimResponse {
  claims: Array<ResourceClaimClaimResponse.Claim>;

  usage: ResourceClaimClaimResponse.Usage;
}

export namespace ResourceClaimClaimResponse {
  export interface Claim {
    id: string;

    /**
     * Epoch milliseconds.
     */
    claimedAt: number;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    externalId: string | null;

    livemode: boolean;

    organizationId: string;

    pricingModelId: string;

    releaseReason: string | null;

    resourceId: string;

    subscriptionId: string;

    subscriptionItemFeatureId: string;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;

    /**
     * Epoch milliseconds.
     */
    releasedAt?: number | null;
  }

  export interface Usage {
    available: number;

    capacity: number;

    claimed: number;

    resourceId: string;

    resourceSlug: string;
  }
}

/**
 * List of resource usage data for the subscription.
 */
export type ResourceClaimListUsagesResponse =
  Array<ResourceClaimListUsagesResponse.ResourceClaimListUsagesResponseItem>;

export namespace ResourceClaimListUsagesResponse {
  /**
   * The usage data for a resource.
   */
  export interface ResourceClaimListUsagesResponseItem {
    claims: Array<ResourceClaimListUsagesResponseItem.Claim>;

    usage: ResourceClaimListUsagesResponseItem.Usage;
  }

  export namespace ResourceClaimListUsagesResponseItem {
    export interface Claim {
      id: string;

      /**
       * Epoch milliseconds.
       */
      claimedAt: number;

      /**
       * Epoch milliseconds.
       */
      createdAt: number;

      externalId: string | null;

      livemode: boolean;

      organizationId: string;

      pricingModelId: string;

      releaseReason: string | null;

      resourceId: string;

      subscriptionId: string;

      subscriptionItemFeatureId: string;

      /**
       * Epoch milliseconds.
       */
      updatedAt: number;

      /**
       * JSON object
       */
      metadata?: { [key: string]: string | number | boolean } | null;

      /**
       * Epoch milliseconds.
       */
      releasedAt?: number | null;
    }

    export interface Usage {
      available: number;

      capacity: number;

      claimed: number;

      resourceId: string;

      resourceSlug: string;
    }
  }
}

export interface ResourceClaimReleaseResponse {
  releasedClaims: Array<ResourceClaimReleaseResponse.ReleasedClaim>;

  usage: ResourceClaimReleaseResponse.Usage;
}

export namespace ResourceClaimReleaseResponse {
  export interface ReleasedClaim {
    id: string;

    /**
     * Epoch milliseconds.
     */
    claimedAt: number;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    externalId: string | null;

    livemode: boolean;

    organizationId: string;

    pricingModelId: string;

    releaseReason: string | null;

    resourceId: string;

    subscriptionId: string;

    subscriptionItemFeatureId: string;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;

    /**
     * Epoch milliseconds.
     */
    releasedAt?: number | null;
  }

  export interface Usage {
    available: number;

    capacity: number;

    claimed: number;

    resourceId: string;

    resourceSlug: string;
  }
}

/**
 * The usage data for a resource.
 */
export interface ResourceClaimRetrieveUsageResponse {
  claims: Array<ResourceClaimRetrieveUsageResponse.Claim>;

  usage: ResourceClaimRetrieveUsageResponse.Usage;
}

export namespace ResourceClaimRetrieveUsageResponse {
  export interface Claim {
    id: string;

    /**
     * Epoch milliseconds.
     */
    claimedAt: number;

    /**
     * Epoch milliseconds.
     */
    createdAt: number;

    externalId: string | null;

    livemode: boolean;

    organizationId: string;

    pricingModelId: string;

    releaseReason: string | null;

    resourceId: string;

    subscriptionId: string;

    subscriptionItemFeatureId: string;

    /**
     * Epoch milliseconds.
     */
    updatedAt: number;

    /**
     * JSON object
     */
    metadata?: { [key: string]: string | number | boolean } | null;

    /**
     * Epoch milliseconds.
     */
    releasedAt?: number | null;
  }

  export interface Usage {
    available: number;

    capacity: number;

    claimed: number;

    resourceId: string;

    resourceSlug: string;
  }
}

export interface ResourceClaimClaimParams {
  /**
   * The slug of the resource to claim
   */
  resourceSlug: string;

  /**
   * Create a single named claim with this external identifier (idempotent).
   */
  externalId?: string;

  /**
   * Create multiple named claims with these external identifiers (idempotent per
   * ID).
   */
  externalIds?: Array<string>;

  /**
   * Optional metadata to attach to the claim(s)
   */
  metadata?: { [key: string]: string | number | boolean };

  /**
   * Create N anonymous claims without external identifiers.
   */
  quantity?: number;
}

export interface ResourceClaimListUsagesParams {
  resourceIds?: Array<string>;

  resourceSlugs?: Array<string>;
}

export interface ResourceClaimReleaseParams {
  /**
   * The slug of the resource to release
   */
  resourceSlug: string;

  /**
   * Release specific claims by their claim IDs (works for both anonymous and named
   * claims).
   */
  claimIds?: Array<string>;

  /**
   * Release a specific named claim by its external identifier.
   */
  externalId?: string;

  /**
   * Release multiple named claims by their external identifiers.
   */
  externalIds?: Array<string>;

  /**
   * Release N anonymous claims (FIFO order). Only releases claims without external
   * identifiers.
   */
  quantity?: number;
}

export interface ResourceClaimRetrieveUsageParams {
  resourceId?: string;

  resourceSlug?: string;
}

export declare namespace ResourceClaims {
  export {
    type ResourceClaimClaimResponse as ResourceClaimClaimResponse,
    type ResourceClaimListUsagesResponse as ResourceClaimListUsagesResponse,
    type ResourceClaimReleaseResponse as ResourceClaimReleaseResponse,
    type ResourceClaimRetrieveUsageResponse as ResourceClaimRetrieveUsageResponse,
    type ResourceClaimClaimParams as ResourceClaimClaimParams,
    type ResourceClaimListUsagesParams as ResourceClaimListUsagesParams,
    type ResourceClaimReleaseParams as ResourceClaimReleaseParams,
    type ResourceClaimRetrieveUsageParams as ResourceClaimRetrieveUsageParams,
  };
}
