/**
 * Types for the boundless-nestjs public read API. Every response is wrapped in
 * `{ success, message, data, meta }`; `apiFetch` strips that envelope, so callers
 * type the call with the generated response DTO, e.g.
 * `apiFetch<Schemas['BuildersDirectoryResponseDto']>('/users/directory')`.
 */

import type { components, paths } from './generated/schema';

export type { components, paths };

/**
 * Every named schema (DTO) from `openapi.snapshot.json`. API shapes come from
 * here, never hand-written. Maintainers update the snapshot; regenerate the
 * types with `npm run codegen:snapshot`.
 */
export type Schemas = components['schemas'];

// The envelope is added by a global interceptor, so the OpenAPI document does
// not describe it. These are the only hand-written response types.

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
}

export interface ApiEnvelope<T> {
  success: true;
  message: string;
  data: T;
  meta: ResponseMeta;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorEnvelope {
  success: false;
  /** A list of strings when request validation rejects several rules at once. */
  message: string | string[];
  errors?: ApiErrorDetail[];
  meta: ResponseMeta;
}
