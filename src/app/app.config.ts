import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authErrorInterceptor } from './interceptors/auth-error.interceptor';
import { apiErrorInterceptor } from './interceptors/api-error.interceptor';
import { NgCircleProgressModule } from 'ng-circle-progress';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Order matters: each interceptor's `next(req)` invokes the next one in this array, so the
    // FIRST entry is outermost and the LAST is innermost (closest to the real HTTP call).
    // authInterceptor attaches the bearer token first; authErrorInterceptor then owns every 401
    // for requests marked HANDLE_AUTH_ERROR; apiErrorInterceptor normalizes whatever failure is
    // left, explicitly skipping the 401s authErrorInterceptor already handled.
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        authErrorInterceptor,
        apiErrorInterceptor,
      ]),
    ),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient],
        },
      }),
      NgCircleProgressModule.forRoot({
        radius: 74,
        space: -8,
        outerStrokeWidth: 16,
        innerStrokeWidth: 16,
        outerStrokeColor: '#78C000',
        innerStrokeColor: '#C7E596',
        animationDuration: 300,
        titleFontSize: '20',
        titleFontWeight: 'bold',
        imageHeight: 100,
        imageWidth: 100,
      })
    ),
  ],
};

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
