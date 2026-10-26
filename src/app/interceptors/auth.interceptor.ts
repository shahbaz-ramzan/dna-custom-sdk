import { HttpInterceptorFn } from '@angular/common/http';
import { REQUIRES_AUTH } from '../utils/http-request';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Logic for adding bearer token here...

  return next(req);
};
