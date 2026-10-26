import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { K } from '../constants/constants';
import { notifyParent } from '../utils/notify-parent';

/**
 * Opt-in flag: only requests explicitly marked with this context get 401 -> fatal-error handling.
 * `withInterceptors` applies to every HttpClient call app-wide, so this keeps a request made
 * outside `NetworkService.httpCall` (if one is ever added) from ending the SDK session just
 * because that unrelated call happened to 401.
 */
export const HANDLE_AUTH_ERROR = new HttpContextToken<boolean>(() => false);

/**
 * This SDK has no login/logout session of its own - auth is just a subscription-key/token
 * handed to it via the host iframe's postMessage. So a 401 here can't be resolved by
 * re-authenticating; it means the SDK's credentials are no longer valid. The existing
 * `initializeSDK()` failure path in app.component.ts is reused: record the error for the
 * `/not-found` page, tell the host page, then navigate there.
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(HANDLE_AUTH_ERROR)) {
    return next(req);
  }

  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === K.NETWORK.STATUS_CODE.UNAUTHORIZED) {
        const message =
          'Your session is no longer valid. Please reload to continue.';
        localStorage.setItem(
          'errorState',
          JSON.stringify({
            title: 'SDK Authentication Failed',
            message,
            details: JSON.stringify(
              {
                status: error.status,
                url: req.url,
                timestamp: new Date().toISOString(),
              },
              null,
              2,
            ),
          }),
        );
        notifyParent('SDK_ERROR', { error: message });
        router.navigate(['/not-found'], { replaceUrl: true });
      }
      return throwError(() => error);
    }),
  );
};
