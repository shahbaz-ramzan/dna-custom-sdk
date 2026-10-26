import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from '../../pipes/safe.pipe';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { City } from '../../types';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Languages } from '../../types/translations';
import { SettingsService } from '../../services/settings/settings.service';
import {
  BDNA_INSTRUCTIONS,
  COUNTRIES,
  FDNA_INSTRUCTIONS,
  K,
} from '../../constants/constants';
import { MixpanelService } from '../../services/mixpanel/mixpanel.service';
import { UserStateService } from '../../services/user/user-state.service';
import { QuestionnaireService } from '../../services/questionnaire/questionnaire-service';
interface UserDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    DialogModule,
    ButtonModule,
    SafePipe,
    DropdownModule,
    TranslatePipe,
  ],
  providers: [TranslatePipe],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent implements OnInit {
  discoveryType: string = '';
  instructionsVideo: string = '';
  instructionsText: any = '';
  instructionsBody = '';
  displayModal = false;
  logo: string = localStorage.getItem('logo') || '';
  countries: City[] | undefined;
  selectionOptions: any[];

  dummyText: string = '';

  selectedLang = {
    name: 'English (United States)',
    flag: 'https://flagcdn.com/us.svg',
    code: 'US',
    lang: 'EnglishUnitedStates',
  };
  params: any;
  loading = false;
  error: string | null = null;
  acountId: string = '';
  selfRegId: string = '';
  creditId: string = '';
  personId: string = '';
  questionPattern: any;
  buttonTitle: string = 'Loading Discovery';
  buttonTranslationKey: string = 'talent-instructions-screen-loading-button';
  isCompleted = false;
  constructor(
    private router: Router,
    private translatePipe: TranslatePipe,
    private settingsService: SettingsService,
    private mixpanelService: MixpanelService,
    private userStateService: UserStateService,
    private QuestionareService: QuestionnaireService
  ) {
    this.selectionOptions = [
      {
        icon: 'icon-smile',
        class: 'most',
        label: this.translatePipe.transform(
          'selection-most',
          localStorage.getItem('lang') || 'EnglishUnitedStates'
        ),
        value: 'most',
      },
      {
        icon: 'icon-sad-smile',
        class: 'least',
        label: this.translatePipe.transform(
          'selection-least',
          localStorage.getItem('lang') || 'EnglishUnitedStates'
        ),
        value: 'least',
      },
    ];
    if (this.discoveryType === 'Investor') {
      this.instructionsVideo = K.APP.INSTRUCTIONS_VIDEOS.INVESTOR;
      this.instructionsText = FDNA_INSTRUCTIONS;
    } else if (this.discoveryType === 'WorkTalent') {
      this.instructionsVideo = K.APP.INSTRUCTIONS_VIDEOS.TALENT;
      this.instructionsText = BDNA_INSTRUCTIONS;
    }
    this.params = JSON.parse(localStorage.getItem('params') || '{}');
  }

  ngOnInit(): void {
    this.loading = true;
    this.countries = COUNTRIES;
    this.selectedLang = COUNTRIES.find(
      (c) => c.lang === (localStorage.getItem('lang') || 'EnglishUnitedStates')
    ) as City;
    this.initializeSDK();
    this.setButtonTranslationKey();
  }

  showModalDialog() {
    this.displayModal = true;
  }

  onClick() {
    if (this.isCompleted) {
      this.router.navigate(['dashboard'], {
        replaceUrl: true,
      });
    } else {
      this.router.navigate(['questionnaire'], {
        replaceUrl: true,
      });
    }
  }

  onLanguageChange() {
    localStorage.setItem('lang', this.selectedLang.lang);

    this.selectionOptions = [
      {
        icon: 'icon-smile',
        class: 'most',
        label: this.translatePipe.transform(
          'selection-most',
          this.selectedLang.lang as Languages
        ),
        value: 'most',
      },
      {
        icon: 'icon-sad-smile',
        class: 'least',
        label: this.translatePipe.transform(
          'selection-least',
          this.selectedLang.lang as Languages
        ),
        value: 'least',
      },
    ];
  }

  private async initializeSDK(): Promise<void> {
    try {
      await this.getAccountSettings();
      await this.handleUserFlow();
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
          2
        ),
      };

      localStorage.setItem('errorState', JSON.stringify(errorState));
      this.router.navigate(['/not-found'], {
        replaceUrl: true,
      });
    } finally {
      this.loading = false;
    }
  }

  private async getAccountSettings(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.settingsService
        .getAccountSettings(
          this.params?.accountId,
          this.params?.selfRegistrationId
        )
        .subscribe({
          next: (res: any) => {
            // A successful response here is already guaranteed by NetworkService (real HTTP
            // failures, including the legacy 200-body statusCode>=400 envelope, are converted
            // to a thrown ApiError upstream) - no need to re-check statusCode, which some
            // backends (e.g. the current dev environment) don't send on success at all.
            this.applySettings(res.body?.data ?? res.body);
            resolve();
          },
          error: (error) => reject(new Error('Failed to get account details')),
        });
    });
  }

  private applySettings(settings: any) {
    this.logo = !settings.logo ? 'assets/images/404-logo.png' : settings.logo;
    localStorage.setItem('discoveryType', settings.discoveryType);
    localStorage.setItem('logo', this.logo);
    localStorage.setItem('primaryColor', settings.primaryColor);
    localStorage.setItem('secondaryColor', settings.secondaryColor);

    if (settings.discoveryType === 'Investor') {
      this.instructionsVideo = K.APP.INSTRUCTIONS_VIDEOS.INVESTOR;
    } else if (settings.discoveryType === 'WorkTalent') {
      this.instructionsVideo = K.APP.INSTRUCTIONS_VIDEOS.TALENT;
    }

    document.documentElement.style.setProperty(
      '--primary-color',
      settings.primaryColor
    );
    document.documentElement.style.setProperty(
      '--secondary-color',
      settings.secondaryColor
    );
  }

  private async handleUserFlow(): Promise<void> {
    if (!this.params) {
      throw new Error('Parameters not initialized');
    }
    try {
      const userExists: any = await this.checkUserExist();
      if (!userExists?.personId) {
        this.mixpanelService.track('USER_NOT_FOUND', {
          email: this.params?.email,
        });
        const res: any = await this.createUser();
        this.mixpanelService.track('USER_CREATED', {
          personId: res.personId,
          creditId: res.creditId,
          questionPattern: res?.questionPattern,
          accountId: this.params?.accountId,
          selfRegistrationId: this.params?.selfRegistrationId,
        });
        this.questionPattern = res?.questionPattern;

        this.userStateService.setUserState({
          personId: res.personId,
          creditId: res.creditId,
          questionPattern: res?.questionPattern,
          accountId: this.params?.accountId,
          selfRegistrationId: this.params?.selfRegistrationId,
          email: this.params?.email,
          firstName: this.params?.firstname,
          lastName: this.params?.lastname,
        });
        this.mixpanelService.createProfile({
          PersonId: res.personId,
          Accounts: this.params?.accountId,
        });
        this.buttonTitle = 'Start Discovery';
        this.isCompleted = false;
        this.loading = false;
        this.setButtonTranslationKey();
      } else {
        this.mixpanelService.track('USER_FOUND', {
          personId: userExists.personId,
          creditId: userExists.creditId,
          questionPattern: userExists?.questionPattern,
          accountId: this.params?.accountId,
          selfRegistrationId: this.params?.selfRegistrationId,
        });
        this.mixpanelService.createProfile({
          PersonId: userExists.personId,
          Accounts: this.params?.accountId,
        });

        this.creditId = userExists.creditId;
        this.personId = userExists.personId;
        this.questionPattern = userExists?.questionPattern;
        this.userStateService.setUserState({
          personId: userExists.personId,
          creditId: userExists.creditId,
          questionPattern: userExists?.questionPattern,
          accountId: this.params?.accountId,
          selfRegistrationId: this.params?.selfRegistrationId,
          email: this.params?.email,
          firstName: this.params?.firstname,
          lastName: this.params?.lastname,
        });
        await this.getDiscoveryStatus();
      }
    } catch (error: any) {
      throw new Error('User verification failed');
    }
  }

  // Update the checkUserExist method
  private async checkUserExist(): Promise<any> {
    if (!this.params) {
      throw new Error('Parameters not initialized');
    }

    return new Promise((resolve, reject) => {
      this.settingsService.checkUserExists(this.params?.email).subscribe({
        next: (res: any) => {
          // A 204 (or any response with no body/personId) means this user doesn't exist yet -
          // an expected, non-error outcome (the backend used to signal this with a 500, caught
          // below by `error:`) - not a real failure, so it resolves to {} the same way.
          const data = res.body?.data ?? res.body;
          if (data?.personId) {
            this.creditId = data.creditId;
            resolve({
              creditId: data.creditId,
              personId: data.personId,
              questionPattern: data.questionPattern,
            });
          } else {
            resolve({});
          }
        },
        error: (error) => resolve({}),
      });
    });
  }

  // Add createUser method
  private async createUser(): Promise<void> {
    if (!this.params) {
      throw new Error('Parameters not initialized');
    }

    return new Promise((resolve, reject) => {
      const userData = {
        email: this.params?.email,
        firstName: this.params?.firstname,
        lastName: this.params?.lastname,
        selfRegistrationId: this.params?.selfRegistrationId,
        accountId: this.params?.accountId,
        questionPattern: this.params?.questionPattern,
        // add any other required fields
      };

      this.settingsService.createParticipantAccount(userData).subscribe({
        next: (res: any) => {
          const data = res.body?.data ?? res.body;
          this.storeUserDetails(data);
          resolve(data);
        },
        error: (error) => reject(new Error('Failed to create user')),
      });
    });
  }

  private async getDiscoveryStatus(): Promise<void> {
    if (!this.params) {
      throw new Error('Parameters not initialized');
    }

    return new Promise((resolve, reject) => {
      this.settingsService.getDiscoveryStatus(this.creditId).subscribe({
        next: (statusRes: any) => {
          const statusData = statusRes.body?.data;
          if (statusData) {
            const patternMap: any = {
              '11': 'q11Model',
              '17': 'q17Model',
              '46': 'q46Model',
            };
            const questionModel = patternMap[this.questionPattern];
            const isCompleted = statusData[questionModel].completed;
            this.mixpanelService.track('DISCOVERY_STATUS', {
              isCompleted: isCompleted,
            });

            if (isCompleted) {
              this.buttonTitle = 'View Discovery';
              this.isCompleted = true;
              this.loading = false;
              this.setButtonTranslationKey();

              resolve();
            } else {
              this.QuestionareService.getQuestionaAnswerStatusCall(
                this.personId
              ).subscribe({
                next: (progressRes: any) => {
                  const progressData = progressRes?.body?.data;
                  if (progressData) {
                    const questionData =
                      progressData?.discoveryQuestionAnswerDto;
                    this.QuestionareService.setQuestionProgress(questionData);
                    this.mixpanelService.track('QUESTION_PROGRESS', {
                      questionData: questionData,
                    });

                    if (questionData?.parentId === 46) {
                      this.buttonTitle = 'View Discovery';
                      this.loading = false;
                      this.isCompleted = true;
                      // this.router.navigate(['dashboard']);
                    } else {
                      this.buttonTitle = 'Start Discovery';
                      this.loading = false;
                      this.isCompleted = false;
                      // this.router.navigate(['instructions']);
                      // this.router.navigate(['questionnaire']);
                    }
                    this.setButtonTranslationKey();

                    resolve();
                  } else {
                    reject(new Error('Failed to get question progress'));
                  }
                },
                error: (error) => {
                  this.mixpanelService.track('QUESTION_PROGRESS_ERROR', {
                    error: error,
                  });
                  reject(new Error('Failed to fetch question progress'));
                },
              });
            }
          } else {
            reject(new Error('Failed to get discovery status'));
          }
        },
        error: () => {
          this.mixpanelService.track('DISCOVERY_STATUS_ERROR', {
            error: 'Failed to fetch discovery status',
          });
          reject(new Error('Failed to fetch discovery status'));
        },
      });
    });
  }
  private storeUserDetails(user: UserDetails): void {
    // Store in localStorage or a service
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
        accountId: this.params?.accountId,
        selfRegistrationId: this.params?.selfRegistrationId,
      })
    );
  }
  private getErrorMessage(error: any): string {
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

  private setButtonTranslationKey() {
    switch (this.buttonTitle) {
      case 'Loading Discovery':
        this.buttonTranslationKey = 'talent-instructions-screen-loading-button';
        break;
      case 'Start Discovery':
        this.buttonTranslationKey = 'talent-instructions-screen-start-button';
        break;
      case 'View Discovery':
        this.buttonTranslationKey = 'talent-instructions-screen-view-button';
        break;
      default:
        this.buttonTranslationKey = 'talent-instructions-screen-start-button';
    }
  }
}
