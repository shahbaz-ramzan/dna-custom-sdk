import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import {
  authErrorInterceptor,
  HANDLE_AUTH_ERROR,
} from './auth-error.interceptor';
import { HttpContext } from '@angular/common/http';

describe('authErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let router: Router;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authErrorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpTestingController.verify());

  it('is created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('ignores a 401 on a request not marked HANDLE_AUTH_ERROR', () => {
    httpClient.get('/api/x').subscribe({ error: () => {} });
    const navigateSpy = spyOn(router, 'navigate');
    httpTestingController
      .expectOne('/api/x')
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('navigates to /not-found on a 401 for a request marked HANDLE_AUTH_ERROR', () => {
    const navigateSpy = spyOn(router, 'navigate');
    httpClient
      .get('/api/x', {
        context: new HttpContext().set(HANDLE_AUTH_ERROR, true),
      })
      .subscribe({ error: () => {} });
    httpTestingController
      .expectOne('/api/x')
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(navigateSpy).toHaveBeenCalledWith(['/not-found'], {
      replaceUrl: true,
    });
  });
});
