// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Invoices extends APIResource {
  /**
   * Get Invoice
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<InvoiceRetrieveResponse> {
    return this._client.get(path`/api/v1/invoices/${id}`, options);
  }

  /**
   * List Invoices
   */
  list(
    query: InvoiceListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InvoiceListResponse> {
    return this._client.get('/api/v1/invoices', { query, ...options });
  }
}

export interface InvoiceRetrieveResponse {
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

export interface InvoiceListResponse {
  data: Array<
    | Shared.PurchaseInvoiceClientSelectSchema
    | Shared.SubscriptionInvoiceClientSelectSchema
    | Shared.StandaloneInvoiceClientSelectSchema
  >;

  hasMore: boolean;

  total: number;

  currentCursor?: string;

  nextCursor?: string;
}

export interface InvoiceListParams {
  cursor?: string;

  limit?: string;
}

export declare namespace Invoices {
  export {
    type InvoiceRetrieveResponse as InvoiceRetrieveResponse,
    type InvoiceListResponse as InvoiceListResponse,
    type InvoiceListParams as InvoiceListParams,
  };
}
