import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import JSEncrypt from 'jsencrypt';
import { PrimeNGConfig } from 'primeng/api';

import { WizardFormComponent } from './components/wizard-form/wizard-form.component';

import { NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from '../environments/environment';
import { ErrorPageComponent } from './components/errorPage/not-found.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { MixpanelService } from './services/mixpanel/mixpanel.service';
import { TranslationService } from './services/translation/translation.service';
interface IframeParams {
  subscriptionKey: string | false;
  selfRegistrationId: string;
  firstname: string;
  lastname: string;
  email: string;
  accountId: string;
  questionPattern: string | number;
}
interface UserDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // add other user properties
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ProgressSpinnerModule,
    WizardFormComponent,
    NgIf,
    QuestionnaireComponent,
    ErrorPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showForm = false;
  loading = true;
  error: string | null = null;
  acountId: string = '';
  selfRegId: string = '';
  creditId: string = '';
  personId: string = '';
  questionPattern: any;
  private params: IframeParams | null = null;
  private readonly USE_STATIC_PARAMS = true;
  private readonly STATIC_PARAMS: IframeParams = {
    // use same user subscriptionKey, accountId, selfRegistrationId, email, firstname, lastname, questionPattern as provided in the original code
    subscriptionKey: '<SUBSCRIPTION_KEY>',
    accountId: '1244',
    selfRegistrationId: '148',
    email: '<TEST_EMAIL>',
    firstname: '<FIRST_NAME>',
    lastname: '<LAST_NAME>',
    questionPattern: '11',
  };
  constructor(
    private primengConfig: PrimeNGConfig,
    private TranslationService: TranslationService,
    private router: Router,
    private mixpanelService: MixpanelService,
  ) {
    mixpanelService.init();
  }

  ngOnInit() {
    if (this.USE_STATIC_PARAMS) {
      this.initializeStaticParams();
    } else {
      this.setupIframeMessageListener();
    }
    this.initializeSDK();
  }

  private initializeStaticParams(): void {
    this.params = { ...this.STATIC_PARAMS };
    localStorage.setItem(
      'subscription-key',
      this.STATIC_PARAMS.subscriptionKey || '',
    );
    localStorage.setItem('accountId', this.STATIC_PARAMS.accountId);
    localStorage.setItem(
      'selfRegistrationId',
      this.STATIC_PARAMS.selfRegistrationId,
    );
    localStorage.setItem('params', JSON.stringify(this.params));
  }

  private setupIframeMessageListener() {
    window.addEventListener('message', (event) => {
      try {
        const encrypt = new JSEncrypt();
        encrypt.setPrivateKey(environment.privateKey);
        const decryptedKey = encrypt.decrypt(event.data);
        localStorage.setItem('subscription-key', decryptedKey || '');

        const urlParams = new URLSearchParams(window.location.search);

        this.params = {
          subscriptionKey: decryptedKey || '',
          questionPattern: urlParams.get('questionPattern')?.trim() || '',
          selfRegistrationId: urlParams.get('selfRegistrationId')?.trim() || '',
          firstname: urlParams.get('firstname')?.trim() || '',
          lastname: urlParams.get('lastname')?.trim() || '',
          accountId: urlParams.get('accountId')?.trim() || '',
          email: urlParams.get('email')?.trim() || '',
        };
        localStorage.setItem(
          'selfRegistrationId',
          this.params?.selfRegistrationId,
        );
        localStorage.setItem('accountId', this.params?.accountId);
        localStorage.setItem('params', JSON.stringify(this.params));

        this.mixpanelService.addUser(this.params?.email);
        this.mixpanelService.createProfile({
          $name: this.params?.firstname + ' ' + this.params?.lastname,
          $email: this.params?.email,
          QuestionPattern: this.params?.questionPattern,
          SelfRegistrationId: this.params?.selfRegistrationId,
          Accounts: this.params?.accountId,
          DiscoveryResource: 'SDK',
        });
      } catch (error) {
        this.mixpanelService.track('SDK_ERROR', { error: error });
        this.error = 'Failed to process configuration data';
      }
    });
  }

  private async waitForParams(timeoutMs: number = 5000): Promise<void> {
    if (this.params) return;

    this.loading = true;
    return new Promise<void>((resolve, reject) => {
      const checkParams = setInterval(() => {
        if (this.params) {
          clearInterval(checkParams);
          clearTimeout(timeoutId);
          resolve();
        }
      }, 100);

      const timeoutId = setTimeout(() => {
        clearInterval(checkParams);
        reject(new Error('Timeout waiting for SDK parameters'));
      }, timeoutMs);
    });
  }

  private async initializeSDK() {
    try {
      if (!this.params && !this.USE_STATIC_PARAMS) {
        try {
          await this.waitForParams();
        } catch (error) {
          this.mixpanelService.track('PARAMS_ERROR', { error: error });
          throw new Error('Failed to receive SDK parameters');
        }
      }
      await this.parseAndValidateParams();
      this.primengConfig.ripple = true;
      await this.loadTranslations();

      this.router.navigate(['instructions'], {
        replaceUrl: true,
      });

      this.showForm = true;
      this.notifyParent('SDK_READY', { success: true });
    } catch (error: any) {
      this.mixpanelService.track('PARAMS_ERROR', { error: error });
      this.error = error.message;
      const errorState = {
        title: 'SDK Initialization Failed',
        message: this.getErrorMessage(error),
        details: JSON.stringify(
          {
            error: error.message,
            timestamp: new Date().toISOString(),
            context: error.context || 'SDK_INIT',
          },
          null,
          2,
        ),
      };

      localStorage.setItem('errorState', JSON.stringify(errorState));
      this.router.navigate(['/not-found'], {
        replaceUrl: true,
      });
      this.notifyParent('SDK_ERROR', { error: error.message });
    } finally {
      this.loading = false;
    }
  }

  private async parseAndValidateParams(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Wait for params to be set by the message listener
        if (!this.params) {
          reject(new Error('Parameters not received from parent frame'));
          return;
        }

        // Validate required parameters
        if (!this.validateParams(this.params)) {
          reject(new Error('Missing required parameters'));
          return;
        }
        this.mixpanelService.track('PARAMS_VALIDATED', {
          params: this.params,
        });
        resolve();
      } catch (error) {
        reject(new Error('Failed to parse parameters'));
      }
    });
  }

  private validateParams(params: IframeParams): boolean {
    return !!(params.accountId && params.selfRegistrationId && params.email);
  }

  private async loadTranslations(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.TranslationService.loadTranslations().subscribe({
        next: (response: any) => {
          const value = response.body?.value;
          if (value?.length) {
            this.TranslationService.saveTranslations(value);
            this.mixpanelService.track('TRANSLATIONS_LOADED', {
              translations: value,
            });
            resolve();
          } else {
            this.mixpanelService.track('TRANSLATIONS_ERROR', {
              error: 'No translations found',
            });
            reject(new Error('No translations found'));
          }
        },
        error: (error) => {
          this.mixpanelService.track('TRANSLATIONS_ERROR', {
            error: error,
          });
          reject(new Error('Failed to load translations'));
        },
      });
    });
  }

  private notifyParent(type: string, data: any) {
    window.parent.postMessage(
      {
        type,
        data,
        source: 'SDK',
      },
      '*',
    );
  }

  private getErrorMessage(error: any): string {
    this.showForm = true;
    const errorMessages: { [key: string]: string } = {
      'Missing required parameters':
        'The SDK is missing required configuration parameters',
      'Failed to parse parameters': 'Invalid configuration parameters provided',
      'Failed to load translations':
        'Unable to load language translations. Please check your network connection',
      'User verification failed': 'Unable to verify account details',
      'Parameters not initialized': 'SDK initialization parameters are missing',
      'Failed to get account details': 'Unable to get account details',
    };
    return (
      errorMessages[error.message] ||
      'An unexpected error occurred while initializing the SDK'
    );
  }
}
