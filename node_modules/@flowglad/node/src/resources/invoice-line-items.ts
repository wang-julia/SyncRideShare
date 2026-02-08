// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class InvoiceLineItems extends APIResource {
  /**
   * Get Invoice Line Item
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<InvoiceLineItemRetrieveResponse> {
    return this._client.get(path`/api/v1/invoice-line-items/${id}`, options);
  }

  /**
   * List Invoice Line Items
   */
  list(
    query: InvoiceLineItemListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InvoiceLineItemListResponse> {
    return this._client.get('/api/v1/invoice-line-items', { query, ...options });
  }
}

export type InvoiceLineItemRetrieveResponse =
  | Shared.StaticInvoiceLineItemClientSelectSchema
  | Shared.UsageInvoiceLineItemClientSelectSchema;

export interface InvoiceLineItemListResponse {
  data: Array<Shared.StaticInvoiceLineItemClientSelectSchema | Shared.UsageInvoiceLineItemClientSelectSchema>;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export interface InvoiceLineItemListParams {
  cursor?: string;

  limit?: string;
}

export declare namespace InvoiceLineItems {
  export {
    type InvoiceLineItemRetrieveResponse as InvoiceLineItemRetrieveResponse,
    type InvoiceLineItemListResponse as InvoiceLineItemListResponse,
    type InvoiceLineItemListParams as InvoiceLineItemListParams,
  };
}
