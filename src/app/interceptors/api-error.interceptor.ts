import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { K } from '../constants/constants';
import { HANDLE_AUTH_ERROR } from './auth-error.interceptor';

// ---------------------------------------------------------------------------
// One normalized error shape for every real (non-2xx) HTTP failure, so callers
// only ever need to read `.message` instead of digging through whatever body
// shape a given endpoint happened to return.
// ---------------------------------------------------------------------------

export interface ApiError {
  status: number;
  /** Always user-readable: the backend's own message when it sent one, else generic text per status. */
  message: string;
}

const MESSAGES: Record<number, string> = {
  [K.NETWORK.STATUS_CODE.TIMED_OUT]:
    'Unable to reach the server. Please check your internet connection and try again.',
  [K.NETWORK.STATUS_CODE.BAD_REQUEST]:
    'The request could not be completed. Please review the information entered and try again.',
  [K.NETWORK.STATUS_CODE.UNAUTHORIZED]:
    'Your session has expired. Please refresh and try again.',
  [K.NETWORK.STATUS_CODE.FORBIDDEN]:
    'You do not have permission to perform this action.',
  [K.NETWORK.STATUS_CODE.NOT_FOUND]:
    'The requested information could not be found.',
  [K.NETWORK.STATUS_CODE.CONFLICT]:
    'This change conflicts with a more recent update. Please refresh the page and try again.',
  [K.NETWORK.STATUS_CODE.SERVER_ERROR]:
    'An unexpected error occurred on the server. Please try again, or contact support if the issue persists.',
  [K.NETWORK.STATUS_CODE.SERVICE_UNAVAILABLE]:
    'The service is temporarily unavailable. Please try again in a few minutes.',
};

const TIMEOUT_MESSAGE =
  'The request took longer than expected and was cancelled. Please try again.';

/** Fallback for an unrecognized status or a non-HTTP throw. Intentionally vague but never a dead end. */
const DEFAULT_MESSAGE =
  'An unexpected error occurred. Please try again, or contact support if the issue persists.';

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    !(value instanceof HttpErrorResponse) &&
    typeof (value as ApiError).status === 'number' &&
    typeof (value as ApiError).message === 'string'
  );
}

/**
 * The message the backend actually sent, checked in the order this app's endpoints are seen to
 * use it (see network.service.ts's previous inline handling of `errors.collections`). Falling
 * back to the first string value in `errors.collections` reproduces the same first-key-wins
 * behavior generically instead of hardcoding endpoint-specific field names.
 */
export function serverMessage(body: any): string | undefined {
  return (
    body?.errors?.collections?.error ||
    firstCollectionsValue(body?.errors?.collections) ||
    body?.errors?.message ||
    (typeof body?.errors === 'string' ? body.errors : undefined) ||
    body?.message ||
    undefined
  );
}

function firstCollectionsValue(collections: unknown): string | undefined {
  if (typeof collections !== 'object' || collections === null) return undefined;
  for (const value of Object.values(collections)) {
    if (typeof value === 'string' && value) return value;
  }
  return undefined;
}

/**
 * Guarantees a genuine ApiError whatever reaches it, so every reader can safely read `.message`.
 * Also normalizes a client-side request timeout (Angular's `timeout()` operator throws a
 * `TimeoutError`, which is not an HttpErrorResponse).
 */
export function ensureApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (error instanceof HttpErrorResponse) {
    return {
      status: error.status,
      message:
        serverMessage(error.error) || MESSAGES[error.status] || DEFAULT_MESSAGE,
    };
  }

  const isTimeout = error instanceof Error && error.name === 'TimeoutError';

  return {
    status: K.NETWORK.STATUS_CODE.TIMED_OUT,
    message: isTimeout ? TIMEOUT_MESSAGE : DEFAULT_MESSAGE,
  };
}

/** Drop-in replacement for a repeated `catchError((error) => throwError(() => ...))` in a service/component. */
export function catchApiError<T>(onError: (error: ApiError) => unknown) {
  return catchError<T, Observable<T>>((error: unknown) => {
    const result = onError(ensureApiError(error));
    return throwError(() => result);
  });
}

/**
 * Normalizes every failed HTTP request into an `ApiError` and rethrows it. Classification only -
 * registered in app.config.ts after `authErrorInterceptor`, so a 401 already tagged
 * `HANDLE_AUTH_ERROR` is left untouched (that interceptor is the sole owner of the auth-error flow).
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        log(req.method, req.url, event.status, 'SUCCESS', event.body);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      log(req.method, req.url, error.status, 'FAILED', error.error);

      if (
        req.context.get(HANDLE_AUTH_ERROR) &&
        error.status === K.NETWORK.STATUS_CODE.UNAUTHORIZED
      ) {
        return throwError(() => error);
      }
      return throwError(() => ensureApiError(error));
    }),
  );
};

function log(
  method: string,
  url: string,
  status: number,
  outcome: 'SUCCESS' | 'FAILED',
  body: unknown,
): void {
  if (!isDevMode()) return;
  // eslint-disable-next-line no-console
  console.log(`[API ${outcome}] ${method} ${url} -> ${status}`, body);
}
