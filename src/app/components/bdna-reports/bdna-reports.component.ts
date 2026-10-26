import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Store } from '@ngrx/store';
import moment from 'moment';
import { K } from '../../constants/constants';
import Encryption from '../../utils/Encryption';
import {
  ApiError,
  ensureApiError,
} from '../../interceptors/api-error.interceptor';
// import { DashboardServiceService } from '../dashboard/dashboard-service.service';
import { CommonModule, Location, NgFor, NgIf } from '@angular/common';

// import { Actions, ofType } from '@ngrx/effects';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import { MixpanelService } from 'src/app/service/mixpanel.service';
import { MixpanelService } from '../../services/mixpanel/mixpanel.service';

import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { MsgService } from 'src/app/service/msg.service';

import { bdnaReportService } from '../../services/bdna-reports/bdna-reports.service';
import { SafePipe } from '../../pipes/safe.pipe';
import { CardModule } from 'primeng/card';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { QrCodeModule } from 'ng-qrcode';

import {
  UserState,
  UserStateService,
} from '../../services/user/user-state.service';
import { APP_CONSTANTS } from '../../constants/app-constants';

@Component({
  selector: 'app-bdna-reports',
  templateUrl: './bdna-reports.component.html',
  styleUrls: ['./bdna-reports.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    SafePipe,
    CardModule,
    NgCircleProgressModule,
    AccordionModule,
    DialogModule,
    CommonModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ButtonModule,
    QrCodeModule,
  ],
})
export class BdnaReportsComponent implements OnInit, OnDestroy {
  private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();
  langId: any = K.APP.LANGUAGE_ID;
  accountId: any;
  selfRegId: any;
  user_object: any;
  logo: any;
  secondaryColor2: any;
  secondaryColor: any;
  primaryColor: any;
  footerDate: any;
  footerYear: any;
  participantName: any;
  isLoading: any;
  uniqueStyleAndDescription: any;
  dashboardBDNASetting: any;
  performanceGuide: any;
  videoUrl: any;
  scoreBDNA5: any;
  uniqueStyleVideo = '';
  counter: number = 0;
  discoveryDto: any;
  showCard: any = {
    video: true,
    performanceKeys: true,
    report: true,
    careerInsights: false,
    workTalents: false, // only in Talent case
  };
  reportColor: any;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  isDownloadReady = false;
  pageNumber: number = 4;
  canvasPrepared: boolean = false;
  vowels: any = ['a', 'e', 'i', 'o', 'u'];
  word = '';
  careerInsightsData: any;
  reportName: string = 'Work Talent';
  canvasData: any[] = [];
  pdf: any = new jsPDF('p', 'mm', 'letter', true);
  pageNumberMap = new Map();
  private userState: UserState | null = null;
  error: string | null = null;

  constructor(
    private bdnaReportService: bdnaReportService,
    private userStateService: UserStateService,
    private router: Router,
    private mixpanelService: MixpanelService,
  ) {
    this.accountId = localStorage.getItem('accountId');
    this.selfRegId = localStorage.getItem('registrationId');

    this.logo =
      !localStorage.getItem('logo') || localStorage.getItem('logo') === ''
        ? 'assets/images/404-logo.png'
        : localStorage.getItem('logo');

    this.user_object = Encryption.decryptData(
      localStorage.getItem(K.APP.USER_OBJECT) || '',
    );
    if (this.user_object) {
      this.user_object = JSON.parse(this.user_object);
    }
    this.participantName =
      this.user_object.fisrtName + ' ' + this.user_object.lastName;
    this.footerYear = moment(new Date()).format('YYYY');
    this.footerDate = moment(new Date()).format('DD-MMM-YY');

    this.primaryColor = localStorage.getItem('primaryColor');
    this.secondaryColor = localStorage.getItem('secondaryColor');
    document.documentElement.style.setProperty(
      `--primary-color`,
      this.primaryColor,
    );
    document.documentElement.style.setProperty(
      `--secondary-color`,
      this.secondaryColor,
    );
    if (this.primaryColor === K.APP.DEFAULT_PRIMARY_COLOR) {
      this.reportColor = this.secondaryColor;
    } else {
      this.reportColor = this.primaryColor;
    }
    this.bdnaReportService.toDataURL(this.logo, (dataUrl: any) => {
      this.logo = dataUrl;
    });
    this.mixpanelService.track('Report Viewed', {
      ...this.user_object,
      discoveryType: 'Talent',
    });
  }

  ngOnInit(): void {
    this.userStateService.getUserState().subscribe({
      next: (state) => {
        if (state) {
          this.userState = state;
          this.user_object = this.userState;
          this.participantName = `${this.user_object.firstName} ${this.user_object.lastName}`;

          this.bdnaReportService
            .getUniqueStyleandDescription(
              this.userState?.personId as any,
              this.langId,
            )
            .subscribe({
              next: (response: any) => {
                this.counter++;
                this.uniqueStyleAndDescription = response?.body?.data;
                this.uniqueStyleVideo =
                  APP_CONSTANTS.BDNA_UNIQUE_STYLE[
                    response?.body?.data?.behaviorTypeName
                  ];

                if (
                  this.vowels.includes(
                    this.uniqueStyleAndDescription?.behaviorTypeName[0].toLowerCase(),
                  )
                ) {
                  this.word = 'An';
                } else {
                  this.word = 'A';
                }
              },
              error: (err) =>
                this.handleApiError(err, 'getUniqueStyleandDescription'),
            });
          this.bdnaReportService
            .getBDNADashboardSetting(
              this.userState?.selfRegistrationId as any,
              this.accountId,
            )
            .subscribe({
              next: (response: any) => {
                this.counter++;
                // A real failure already routes to `error:` below via NetworkService/catchApiError,
                // so a successful `next` callback here is already a confirmed success.
                const data = response?.body?.data ?? response?.body;
                this.mixpanelService.track('Report Content Permissions Success', {
                  ...this.user_object,
                  discoveryType: 'talent',
                  permissions: data,
                });
                this.discoveryDto = data;
                this.showCard = {
                  workTalents: this.discoveryDto?.isBDNA5KeyWorkTalents,
                  report: this.discoveryDto?.isViewReport,
                  careerInsights: this.discoveryDto?.isDesiredTaskBasedTalent,
                  performanceKeys: this.discoveryDto?.isPGuide,
                  video: this.discoveryDto?.isVideo,
                };
              },
              error: (err) =>
                this.handleApiError(err, 'getBDNADashboardSetting'),
            });

          this.mixpanelService.track('Report Content Permission Request', {
            ...this.user_object,
            discoveryType: 'talent',
            requestBody: {
              selfRegId: this.selfRegId,
              accountId: this.accountId,
            },
          });
          this.bdnaReportService
            .getPerformanceGuide(this.userState?.personId as any, this.langId)
            .subscribe({
              next: (response: any) => {
                this.counter++;
                this.performanceGuide = response?.body?.data;
              },
              error: (err) => this.handleApiError(err, 'getPerformanceGuide'),
            });

          this.bdnaReportService
            .getBDNA5Scores(this.userState?.personId as any, this.langId)
            .subscribe({
              next: (response: any) => {
                this.counter++;
                this.scoreBDNA5 = response?.body;
                this.scoreBDNA5 =
                  this.bdnaReportService.parseFDNAandBDNAObjects(
                    this.scoreBDNA5,
                  );
                this.scoreBDNA5.map((talent: any) => {
                  talent['titleSparsed'] = talent?.title?.split(' ');
                });
              },
              error: (err) => this.handleApiError(err, 'getBDNA5Scores'),
            });
          this.bdnaReportService
            .getCareerInsights(this.userState?.personId as any)
            .subscribe({
              next: (response: any) => {
                this.counter++;
                this.careerInsightsData = response?.body?.data?.talents;
              },
              error: (err) => this.handleApiError(err, 'getCareerInsights'),
            });

          setTimeout(() => {
            if (!this.canvasPrepared) {
              this.setPageNumber();
              setTimeout(() => {
                this.prepareCanvas();
              }, 2000);
              this.canvasPrepared = true;
            }
          }, 15000);
        }
      },
      error: (err) => this.handleApiError(err, 'getUserState'),
    });
  }

  private handleApiError(error: unknown, context: string): void {
    const apiError: ApiError = ensureApiError(error);
    this.error = apiError.message;
    this.mixpanelService.track('API_ERROR', {
      context,
      status: apiError.status,
      message: apiError.message,
    });
  }

  onBack() {
    this.router.navigate(['/dashboard'], {
      replaceUrl: true,
    });
  }

  async prepareCanvas() {
    this.isDownloadReady = false;
    for (let i = 1; i <= this.pageNumber; i++) {
      var data: any = document.getElementById(i.toString());
      if (data) {
        data.style.fontFeatureSettings = '"liga" 0';
        const canvas = await html2canvas(data, { scale: 3 });
        this.canvasData.push(canvas);
        var imgWidth = 215;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        let contentDataURL = canvas.toDataURL('image/png');
        this.pdf.addPage();
        this.pdf.addImage(
          contentDataURL,
          'PNG',
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          'FAST',
        );
      }
    }
    this.pdf.deletePage(1);
    this.isDownloadReady = true;
  }

  setPageNumber() {
    let currentPageNumber = 0;
    for (let i = 1; i <= this.pageNumber; i++) {
      var data: any = document.getElementById(i.toString());
      if (data) {
        currentPageNumber++;
        this.pageNumberMap.set(data.id, currentPageNumber);
      }
    }
  }
  downloadPdf() {
    this.mixpanelService.track('Report Downloaded', {
      ...this.user_object,
      reportType: this.reportName,
    });
    this.pdf.save(`${this.reportName} Report.pdf`);
  }

  loadText() {
    let dotCount = 1 + (this.canvasData.length % 3);
    let text = 'Preparing Download' + '.'.repeat(dotCount);
    return text;
  }

  ngOnDestroy() {
    this._destroyed$.next(true);
    this._destroyed$.unsubscribe();
  }
}
