import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';

import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { getQuestionsByPattern, PatternType, Questions } from './questions';
import { TranslatePipe } from '../../pipes/translate.pipe';

import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { Languages } from '../../types/translations';
import { City } from '../../types';
import { QuestionnaireService } from '../../services/questionnaire/questionnaire-service';
import {
  UserState,
  UserStateService,
} from '../../services/user/user-state.service';
import { Router } from '@angular/router';
import { MixpanelService } from '../../services/mixpanel/mixpanel.service';
import {
  ApiError,
  ensureApiError,
} from '../../interceptors/api-error.interceptor';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    ProgressSpinnerModule,
    MenuModule,
    ProgressBarModule,
    SelectButtonModule,
    DialogModule,
    TranslatePipe,
    RadioButtonModule,
    ButtonModule,
    DropdownModule,
  ],
  providers: [TranslatePipe],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss',
})
export class QuestionnaireComponent {
  @ViewChild('animateMe') animateMe: ElementRef | null = null;
  logo: any;

  countries: City[] | undefined;
  selectedLang = {
    name: 'English (United States)',
    flag: 'https://flagcdn.com/us.svg',
    code: 'US',
    lang: 'EnglishUnitedStates',
  };
  filterValue: string | undefined = '';
  instructionBody: string = '';
  private userState: UserState | null = null;
  error: string | null = null;
  ngOnInit() {
    this.userStateService
      .getUserState()

      .subscribe({
        next: (state) => {
          this.userState = state;
          this.allQuestions = getQuestionsByPattern(
            state?.questionPattern as any,
          );
        },
        error: (err) => this.handleError(err),
      });

    this.questionnaireService.getQuestionProgress().subscribe({
      next: (state) => {
        if (state?.parentId) {
          this.currentQuestionNumber =
            this.allQuestions?.findIndex(
              (el) => el[0]?.parentId == state.parentId,
            ) + 1;
          this.currentQuestion = this.allQuestions[this.currentQuestionNumber];

          this.questionProgress = Math.ceil(
            (this.currentQuestionNumber / this.allQuestions.length) * 100,
          );
        } else {
          this.currentQuestion = this.allQuestions[0];
        }
      },
      error: (err) => this.handleError(err),
    });
    this.countries = [
      {
        name: 'English (United States)',
        flag: 'https://flagcdn.com/us.svg',
        code: 'US',
        lang: 'EnglishUnitedStates',
      },
      {
        name: 'English (United Kingdom)',
        flag: 'https://flagcdn.com/gb.svg',
        code: 'GB',
        lang: 'EnglishUnitedKingdom',
      },
      {
        name: 'Portuguese (Brazil)',
        flag: 'https://flagcdn.com/br.svg',
        code: 'BR',
        lang: 'PortugueseBrazil',
      },
      {
        name: 'French (Canada)',
        flag: 'https://flagcdn.com/ca.svg',
        code: 'CA',
        lang: 'FrenchCanada',
      },
      {
        name: 'Spanish (Mexico)',
        flag: 'https://flagcdn.com/mx.svg',
        code: 'MX',
        lang: 'SpanishMexico',
      },
      {
        name: 'Dutch (Netherlands)',
        flag: 'https://flagcdn.com/nl.svg',
        code: 'NL',
        lang: 'DutchNetherlands',
      },
      {
        name: 'Urdu (Pakistan)',
        flag: 'https://flagcdn.com/pk.svg',
        code: 'PK',
        lang: 'UrduPakistan',
      },
      {
        name: 'India (Hindi)',
        flag: 'https://flagcdn.com/in.svg',
        code: 'IN',
        lang: 'HindiIndia',
      },
      {
        name: 'Mandarin (Chinese)',
        flag: 'https://flagcdn.com/cn.svg',
        code: 'CN',
        lang: 'MandarinChinese',
      },
      {
        name: 'Afrikaans (South Africa)',
        flag: 'https://flagcdn.com/za.svg',
        code: 'ZA',
        lang: 'AfrikaansSouthAfrica',
      },
      {
        name: 'French (France)',
        flag: 'https://flagcdn.com/fr.svg',
        code: 'FR',
        lang: 'FrenchFrance',
      },
      {
        name: 'German (Germany)',
        flag: 'https://flagcdn.com/de.svg',
        code: 'DE',
        lang: 'GermanGermany',
      },
      {
        name: 'Portuguese (Portugal)',
        flag: 'https://flagcdn.com/pt.svg',
        code: 'PT',
        lang: 'PortuguesePortugal',
      },
      {
        name: 'Spanish (Spain)',
        flag: 'https://flagcdn.com/es.svg',
        code: 'US',
        lang: 'SpanishSpain',
      },
    ];

    this.selectedLang = this.countries.find(
      (c) => c.lang === this.selectedLanguage,
    ) as City;

    this.translatePipe.transform(
      'popup-instructions-body',
      this.selectedLang.lang,
    );
  }

  goBack: boolean = false;

  questionListLoading: boolean = false;
  questionStatusLoading: boolean = false;
  savingQuestionLoading: boolean = false;
  discoveryStatusLoading: boolean = false;

  instructionModal: boolean = false;
  isdiscoveryCompleted: boolean = false;

  items: MenuItem[];
  questionProgress: number = 0;

  least: number = 0;
  most: number = 0;

  currentQuestionNumber: number = 0;
  currentQuestion: any[] = [];
  selectionOptions: any[];
  // allQuestions: any[] = [...Questions];
  allQuestions: any[] = [];

  instructionsText: any;

  selectedLanguage = localStorage.getItem('lang') || 'EnglishUnitedStates';

  constructor(
    private mixpanelService: MixpanelService,
    private renderer: Renderer2,
    private translatePipe: TranslatePipe,
    private questionnaireService: QuestionnaireService,
    private userStateService: UserStateService,
    private router: Router,
  ) {
    this.items = [
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
      },
    ];
    this.selectionOptions = [
      {
        icon: 'icon-smile',
        class: 'most',
        label: this.translatePipe.transform(
          'selection-most',
          this.selectedLanguage,
        ),
        value: 'most',
      },
      {
        icon: 'icon-sad-smile',
        class: 'least',
        label: this.translatePipe.transform(
          'selection-least',
          this.selectedLanguage,
        ),
        value: 'least',
      },
    ];

    this.instructionsText = {
      p1: 'Each question has three statements. You’ll be asked to choose two of the statements for each question – how you <b>most</b> naturally operate and how you <strong>least</strong>  naturally operate. Base your choices on how you act, make decisions, and interact. You might find some questions more difficult than others, go with your intuition and don’t dwell on it.',
      p2: 'The questions aren’t focused on money but are designed to help uncover your unconscious behavior. Using a sophisticated calculation, your responses are translated into results on how people like you make decisions about money.',
      p3: 'You’ll receive a summary report at the end that will reveal your financial behavior.',
    };

    this.currentQuestion = this.allQuestions[this.currentQuestionNumber];
  }

  showInstructionDialog() {
    this.instructionModal = true;
  }

  valueChange(index: number, event: any, menu?: any) {
    menu?.hide();
    if (event.option.value == 'most') {
      // If clicking on already selected 'most', deselect it
      if (this.most == index + 1) {
        this.most = 0;
        return;
      }
      // If there's already a 'most' selection, clear all selections

      if (this.most != 0) {
        this.currentQuestion[0].selectedValue = '';
        this.currentQuestion[1].selectedValue = '';
        this.currentQuestion[2].selectedValue = '';
        this.least = 0;
        this.most = 0;
      }
      this.currentQuestion[index].selectedValue = 'most';
      this.most = index + 1;
      if (this.most == this.least) {
        this.least = 0;
      }
    } else if (event.option.value == 'least') {
      if (this.least == index + 1) {
        this.least = 0;
        return;
      }
      if (this.least != 0) {
        this.currentQuestion[0].selectedValue = '';
        this.currentQuestion[1].selectedValue = '';
        this.currentQuestion[2].selectedValue = '';
        this.least = 0;
        this.most = 0;
      }
      this.currentQuestion[index].selectedValue = 'least';
      this.least = index + 1;
      if (this.most == this.least) {
        this.most = 0;
      }
    }

    if (this.least > 0 && this.most > 0) {
      this.savingQuestionLoading = true;
      if (this.userState?.questionPattern === '46') {
        this.mixpanelService.track('INSERT_46Q_ANSWER', {
          creditID: this.userState?.creditId,
          parentID: this.currentQuestion[0]?.parentId,
          question: {
            least: this.least,
            most: this.most,
          },
          questionPattern: this.userState?.questionPattern as any,
        });
        this.questionnaireService
          .saveQuestionAnswerCall({
            creditID: this.userState?.creditId,
            parentID: this.currentQuestionNumber + 1,
            question: {
              least: this.least,
              most: this.most,
            },
          })
          .subscribe({
            next: (response) => {
              this.mixpanelService.track('QUESTION_ANSWER_SAVED', {
                response: response,
              });
              this.handleQuestionResponse(response);
            },
            error: (error) => {
              this.mixpanelService.track('QUESTION_ANSWER_SAVED_ERROR', {
                error: error,
              });
              this.handleError(error);
            },
          });
      } else {
        this.mixpanelService.track('INSERT_11Q17Q_ANSWER', {
          creditID: this.userState?.creditId,
          parentID: this.currentQuestion[0]?.parentId,
          question: {
            least: this.least,
            most: this.most,
          },
          questionPattern: this.userState?.questionPattern as any,
        });
        this.questionnaireService
          .insert11Q17QAnswers({
            creditID: this.userState?.creditId,
            parentID: this.currentQuestion[0]?.parentId,
            question: {
              least: this.least,
              most: this.most,
            },
            questionPattern: this.userState?.questionPattern as any,
          })
          .subscribe({
            next: (response) => {
              this.mixpanelService.track('QUESTION_ANSWER_SAVED', {
                response: response,
              });
              this.handleQuestionResponse(response);
            },
            error: (error) => {
              this.mixpanelService.track('QUESTION_ANSWER_SAVED_ERROR', {
                error: error,
              });
              this.handleError(error);
            },
          });
      }
    }
  }
  private handleQuestionResponse(response: any) {
    this.savingQuestionLoading = false;

    if (this.currentQuestionNumber + 1 < this.allQuestions.length) {
      this.nextQuestion();
    } else {
      this.mixpanelService.track('QUESTIONNAIRE_COMPLETED', {
        creditID: this.userState?.creditId,
        questionPattern: this.userState?.questionPattern as any,
      });
      this.router.navigate(['dashboard'], {
        replaceUrl: true,
      });
    }
  }

  // Create a separate method to handle errors
  private handleError(error: unknown) {
    this.savingQuestionLoading = false;
    const apiError: ApiError = ensureApiError(error);
    this.error = apiError.message;
    this.mixpanelService.track('API_ERROR', {
      context: 'questionnaire',
      status: apiError.status,
      message: apiError.message,
    });
  }
  previousQuestion(menu?: any) {
    menu?.hide();
    this.renderer.addClass(this.animateMe?.nativeElement, 'modal-anim');
    this.goBack = false;
    this.currentQuestionNumber = this.currentQuestionNumber - 1;
    this.currentQuestion = this.allQuestions[this.currentQuestionNumber];
    this.currentQuestion.forEach((q: any, i: number) => {
      if (q.selectedValue === 'most') {
        this.most = i + 1;
      }
      if (q.selectedValue === 'least') {
        this.least = i + 1;
      }
    });
    setTimeout(() => {
      this.renderer.removeClass(this.animateMe?.nativeElement, 'modal-anim');
    }, 500);
  }

  nextQuestion(menu?: any) {
    this.mixpanelService.track('NEXT_QUESTION', {
      questionNumber: this.currentQuestionNumber,
    });
    menu?.hide();
    if (this.most == 0 || this.least == 0) {
      this.renderer.addClass(this.animateMe?.nativeElement, 'shake-anim');
      setTimeout(() => {
        this.renderer.removeClass(this.animateMe?.nativeElement, 'shake-anim');
      }, 500);
      // this.messageService.errorMessage(
      //   'Please select One Least and One Most Option'
      // );
    } else {
      this.renderer.addClass(this.animateMe?.nativeElement, 'modal-anim');
      this.least = 0;
      this.most = 0;
      this.goBack = true;
      this.questionProgress = Math.ceil(
        ((this.currentQuestionNumber + 1) / this.allQuestions.length) * 100,
      );

      this.currentQuestionNumber += 1;
      this.currentQuestion = this.allQuestions[this.currentQuestionNumber];
      this.currentQuestion[0].selectedValue = '';
      this.currentQuestion[1].selectedValue = '';
      this.currentQuestion[2].selectedValue = '';
      this.least = 0;
      this.most = 0;
      setTimeout(() => {
        this.renderer.removeClass(this.animateMe?.nativeElement, 'modal-anim');
      }, 500);
    }
  }

  getCurrentQuestion(parentId: number) {
    if (parentId == 0) {
      this.goBack = false;
    }
    this.currentQuestion = [];
    this.allQuestions[parentId].forEach((question: any) => {
      if (question.parentId === parentId) {
        this.currentQuestion.push({
          title: question.description.split('~', 2)[0],
          description: question.description.split('~', 2)[1],
          selectedValue: '',
          parentId: question.parentId,
        });
      }
    });
  }

  onLanguageChange() {
    localStorage.setItem('lang', this.selectedLang.lang);

    this.selectionOptions = [
      {
        icon: 'icon-smile',
        class: 'most',
        label: this.translatePipe.transform(
          'selection-most',
          this.selectedLang.lang as Languages,
        ),
        value: 'most',
      },
      {
        icon: 'icon-sad-smile',
        class: 'least',
        label: this.translatePipe.transform(
          'selection-least',
          this.selectedLang.lang as Languages,
        ),
        value: 'least',
      },
    ];

    this.translatePipe.transform(
      'popup-instructions-body',
      this.selectedLang.lang,
    );
  }
}
