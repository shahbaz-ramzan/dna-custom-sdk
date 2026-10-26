import { HttpErrorResponse } from '@angular/common/http';
import {
  ensureApiError,
  isApiError,
  serverMessage,
} from './api-error.interceptor';
import { K } from '../constants/constants';

describe('api-error.interceptor helpers', () => {
  it('isApiError recognizes a normalized error and rejects an HttpErrorResponse', () => {
    expect(isApiError({ status: 400, message: 'x' })).toBeTrue();
    expect(isApiError(new HttpErrorResponse({ status: 400 }))).toBeFalse();
  });

  it('serverMessage reads the backend message from errors.collections', () => {
    expect(
      serverMessage({
        errors: { collections: { field: 'Field is required' } },
      }),
    ).toBe('Field is required');
  });

  it('ensureApiError passes an existing ApiError through untouched', () => {
    const error = { status: 409, message: 'conflict' };
    expect(ensureApiError(error)).toBe(error);
  });

  it('ensureApiError maps an HttpErrorResponse to a generic status message when the backend sent none', () => {
    const result = ensureApiError(
      new HttpErrorResponse({ status: K.NETWORK.STATUS_CODE.SERVER_ERROR }),
    );
    expect(result.status).toBe(K.NETWORK.STATUS_CODE.SERVER_ERROR);
    expect(result.message).toContain('unexpected error occurred on the server');
  });

  it('ensureApiError maps a TimeoutError to the timeout message', () => {
    const timeoutError = new Error('Timeout has occurred');
    timeoutError.name = 'TimeoutError';
    const result = ensureApiError(timeoutError);
    expect(result.status).toBe(K.NETWORK.STATUS_CODE.TIMED_OUT);
    expect(result.message).toContain('took longer than expected');
  });
});
