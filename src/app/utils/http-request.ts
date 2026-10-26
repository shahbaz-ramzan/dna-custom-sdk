import {
  HttpContext,
  HttpContextToken,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { HttpMethod } from '../constants/network-constants';

// HttpContextToken for auth
export const REQUIRES_AUTH = new HttpContextToken<boolean>(() => false);

// Generic request function
export default function ConstructHttpRequest<T>(
  method: HttpMethod,
  url: string,
  body: T,
  headers: Record<string, string> = {},
  params: Record<string, string | number | boolean> = {},
  requiresAuth: boolean = false
): HttpRequest<T> {
  const httpHeader = getHeaders(headers);
  const httpContext = new HttpContext().set(REQUIRES_AUTH, requiresAuth);

  return new HttpRequest(method, url, body, {
    headers: httpHeader,
    context: httpContext,
  });
}

// Helper functions
function getHeaders(headers: Record<string, string>) {
  let httpHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Content-Security-Policy': "frame-ancestors 'none'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  });
  Object.entries(headers).forEach(([key, value]) => {
    httpHeader = httpHeader.append(key, value);
  });

  return httpHeader;
}
