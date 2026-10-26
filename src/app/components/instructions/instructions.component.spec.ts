import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { InstructionsComponent } from './instructions.component';
import { SettingsService } from '../../services/settings/settings.service';

describe('InstructionsComponent', () => {
  let component: InstructionsComponent;
  let fixture: ComponentFixture<InstructionsComponent>;
  let settingsService: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    settingsService = jasmine.createSpyObj('SettingsService', [
      'getAccountSettings',
      'checkUserExists',
      'createParticipantAccount',
      'getDiscoveryStatus',
    ]);
    settingsService.getAccountSettings.and.returnValue(of({ body: {} } as any));
    settingsService.checkUserExists.and.returnValue(
      throwError(() => new Error('not found')),
    );
    settingsService.createParticipantAccount.and.returnValue(
      of({ body: {} } as any),
    );
    settingsService.getDiscoveryStatus.and.returnValue(of({ status: 200, body: {} } as any));

    await TestBed.configureTestingModule({
      imports: [InstructionsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SettingsService, useValue: settingsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccountSettings', () => {
    // Regression coverage for the bug found while migrating off the legacy
    // `res.body.statusCode === 200` check: a backend that sends a clean
    // `{ data: {...} }` body with no `statusCode` field must still be treated
    // as success, since NetworkService already guarantees a real failure
    // throws before `next` is ever called.
    it('resolves and applies settings from a body with no statusCode field', async () => {
      settingsService.getAccountSettings.and.returnValue(
        of({
          body: {
            data: {
              discoveryType: 'WorkTalent',
              logo: 'logo.png',
              primaryColor: '#000',
              secondaryColor: '#fff',
            },
          },
        } as any),
      );

      await expectAsync(
        (component as any).getAccountSettings(),
      ).toBeResolved();
      expect(localStorage.getItem('discoveryType')).toBe('WorkTalent');
    });

    it('rejects when the underlying request errors', async () => {
      settingsService.getAccountSettings.and.returnValue(
        throwError(() => new Error('network down')),
      );

      await expectAsync(
        (component as any).getAccountSettings(),
      ).toBeRejectedWithError('Failed to get account details');
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      (component as any).params = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        selfRegistrationId: '145',
        accountId: '1244',
      };
    });

    it('resolves and stores user details from a body with no statusCode field', async () => {
      settingsService.createParticipantAccount.and.returnValue(
        of({ body: { data: { personId: 'p1', creditId: 1 } } } as any),
      );

      await expectAsync((component as any).createUser()).toBeResolved();
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      expect(stored.personId).toBe('p1');
    });

    it('rejects when the underlying request errors', async () => {
      settingsService.createParticipantAccount.and.returnValue(
        throwError(() => new Error('network down')),
      );

      await expectAsync((component as any).createUser()).toBeRejectedWithError(
        'Failed to create user',
      );
    });
  });
});
