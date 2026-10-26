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
import {
  UserState,
  UserStateService,
} from '../../services/user/user-state.service';
import { QrCodeModule } from 'ng-qrcode';
import { APP_CONSTANTS } from '../../constants/app-constants';
@Component({
  selector: 'app-fdna-reports',
  templateUrl: './fdna-reports.component.html',
  styleUrls: ['./fdna-reports.component.scss'],
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
export class FdnaReportsComponent implements OnInit {
  private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();
  langId: any = K.APP.LANGUAGE_ID;
  accountId: any;
  selfRegId: any;
  user_object: any;
  logo: any;
  secondaryColor2: any;
  secondaryColor: any;
  primaryColor: any;
  participantName: string;
  footerYear: string;
  footerDate: string;
  reportColor: any;

  isLoading: any;
  uniqueStyleAndDescription: any;
  dashboardFDNASetting: any;
  performanceGuide: any;
  videoUrl: any;
  scoreFDNA5: any;
  uniqueStyleVideo = '';
  marketMood: any;
  behavioralBiases: any;
  discoveryDto: any;
  counter: number = 0;
  biasesVideo: any = {
    firstBiase: '',
    secondBiase: '',
  };
  marketMoodVideo: string = 'https://www.youtube.com/embed/pcIbrCrxgZA';
  showCard: any = {
    video: true,
    performanceKeys: true,
    report: true,
    fbOverview: false, // only in case of investor
    marketMood: false, // only in case of investor
    fbInsights: false, // only in case of investor
    bBiases: false, // only in case of investor
  };

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  isDownloadReady = false;
  pageNumber: number = 4;
  canvasPrepared: boolean = false;
  vowels: any = ['a', 'e', 'i', 'o', 'u'];
  word = '';
  reportName: string = 'Financial Behavior';
  private userState: UserState | null = null;
  error: string | null = null;

  pageNumberMap = new Map();

  constructor(
    private _location: Location,
    private router: Router,
    private mixpanelService: MixpanelService,
    private userStateService: UserStateService,
    private bdnaReportService: bdnaReportService,
  ) {
    this.accountId = localStorage.getItem('accountId');
    this.selfRegId = localStorage.getItem('selfRegistrationId');
    this.participantName = '';

    this.logo =
      !localStorage.getItem('logo') || localStorage.getItem('logo') === ''
        ? "'assets/images/404-logo.png'"
        : localStorage.getItem('logo');

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
      this.secondaryColor2 = getComputedStyle(document.body).getPropertyValue(
        '--secondary-color2',
      );
      this.reportColor = this.secondaryColor2;
    } else {
      this.secondaryColor2 = localStorage.getItem('secondaryColor');
      this.reportColor = this.primaryColor;
    }
    this.bdnaReportService.toDataURL(this.logo, (dataUrl: any) => {
      this.logo = dataUrl;
    });
  }

  ngOnInit(): void {
    const currentDate = moment().format('DD-MM-YYYY');

    this.userStateService.getUserState().subscribe({
      next: (state) => {
        if (state) {
          this.userState = state;
          this.user_object = this.userState;
          this.participantName = `${this.user_object.firstName} ${this.user_object.lastName}`;
          this.mixpanelService.track('Report Viewed', {
            ...this.user_object,
            discoveryType: 'Investor',
          });

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
                  APP_CONSTANTS.FDNA_UNIQUE_STYLE[
                    response?.body?.data.behaviorTypeName
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
            .getFDNADashboardSetting(this.selfRegId, this.accountId)
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
                this.dashboardFDNASetting = data;
                this.discoveryDto = this.dashboardFDNASetting;
                this.showCard = {
                  ...this.showCard,
                  report: this.dashboardFDNASetting?.isViewReport,
                  video: this.dashboardFDNASetting?.isVideo,
                  performanceKeys: this.dashboardFDNASetting?.isPGuide,
                  fbOverview: this.dashboardFDNASetting?.isBehavOverview,
                  marketMood: this.dashboardFDNASetting?.isMarketMood,
                  fbInsights: this.dashboardFDNASetting?.isFDNA5Score,
                  bBiases: this.dashboardFDNASetting?.isBehavioralBiases,
                };
              },
              error: (err) =>
                this.handleApiError(err, 'getFDNADashboardSetting'),
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
            .getFDNA5Scores(this.userState?.personId as any, this.langId)
            .subscribe({
              next: (response: any) => {
                this.counter++;
                this.scoreFDNA5 = response?.body;
                this.scoreFDNA5 =
                  this.bdnaReportService.parseFDNAandBDNAObjects(
                    this.scoreFDNA5,
                  );
                this.scoreFDNA5.map((talent: any) => {
                  talent['titleSparsed'] = talent?.title?.split(' ');
                });
              },
              error: (err) => this.handleApiError(err, 'getFDNA5Scores'),
            });

          this.bdnaReportService
            .getMarketMoodArray(
              this.userState?.personId as any,
              -1,
              currentDate,
            )
            .subscribe({
              next: (response: any) => {
                this.counter++;
                this.marketMood = response?.body?.data;
                this.marketMood = {
                  ...this.marketMood,
                  marketMoodDescriptions:
                    this.bdnaReportService.removeBoldTagFromMoodData(
                      this.marketMood?.marketMoodDescriptions,
                    ),
                };
              },
              error: (err) => this.handleApiError(err, 'getMarketMoodArray'),
            });
          this.bdnaReportService
            .getBehavioralBiases(this.userState?.personId as any, this.langId)
            .subscribe({
              next: (response: any) => {
                this.counter++;
                this.behavioralBiases = response?.body;
                this.behavioralBiases =
                  this.bdnaReportService.parseBehaviorBiasesList(
                    this.behavioralBiases,
                  );
                let biaseName: string = this.behavioralBiases[0]?.name;
                this.biasesVideo.firstBiase =
                  K.APP.BEHAVIORAL_BIASES_VIDEOS[biaseName];
                biaseName = this.behavioralBiases[1]?.name;
                this.biasesVideo.secondBiase =
                  K.APP.BEHAVIORAL_BIASES_VIDEOS[biaseName];
              },
              error: (err) => this.handleApiError(err, 'getBehavioralBiases'),
            });
          setTimeout(() => {
            //TODO remove this after loading implementation

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

  canvasData: any[] = [];
  pdf: any = new jsPDF('p', 'mm', 'letter', true);
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
