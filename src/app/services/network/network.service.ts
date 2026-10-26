import {
  HttpClient,
  HttpContext,
  HttpEventType,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, timeout } from 'rxjs/operators';
import { HANDLE_AUTH_ERROR } from '../../interceptors/auth-error.interceptor';
import {
  ApiError,
  catchApiError,
} from '../../interceptors/api-error.interceptor';
import { K } from '../../constants/constants';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: {
    message?: string;
    debugMessage?: string;
    collections?: {
      [key: string]: string;
    };
  };
  statusCode?: number; // Make statusCode optional
}

export type { ApiError };

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(private http: HttpClient) {}

  private handleRequest<T>(request: Observable<any>): Observable<T> {
    return request.pipe(
      timeout(K.NETWORK.URL.TIMEOUT),
      filter((r) => r.type === HttpEventType.Response),
      map((response: HttpResponse<ApiResponse<T>>) => {
        const body = response.body;

        // Some endpoints signal a logical failure inside an otherwise-200 response body
        // (a `statusCode` >= 400 alongside `errors`) instead of a real HTTP error status.
        // Re-throwing it as an HttpErrorResponse lets `catchApiError` below normalize it the
        // same way as a genuine transport-level failure.
        if (
          body &&
          typeof body.statusCode === 'number' &&
          body.statusCode >= 400
        ) {
          throw new HttpErrorResponse({
            error: body.errors || { message: 'Unknown error' },
            status: body.statusCode,
            statusText: body.message || 'Error',
          });
        }

        // If no data property exists, return the entire body as T
        return response as T;
      }),
      catchApiError((error) => {
        console.error('API Error:', error);
        return error;
      }),
    );
  }

  httpCall<RequestBody, ResponseBody>(
    request: any,
    isRawRequest = false,
  ): Observable<ResponseBody> {
    // Marks this as our own backend call so authErrorInterceptor handles its 401s uniformly.
    // A third-party HttpClient call made elsewhere (not through this method) stays unmarked so
    // an unrelated service's 401 can't trigger the SDK fatal-error flow.
    const context = new HttpContext().set(HANDLE_AUTH_ERROR, true);

    if (isRawRequest) {
      return this.handleRequest<ResponseBody>(
        this.http.request<ApiResponse<ResponseBody>>(
          request as HttpRequest<any>,
        ),
      );
    }

    const config = request;
    return this.handleRequest<ResponseBody>(
      this.http.request<ApiResponse<ResponseBody>>(config.method, config.url, {
        body: config.body,
        headers: config.headers,
        observe: 'response',
        context,
      }),
    );
  }
}
