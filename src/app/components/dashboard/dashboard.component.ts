import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from '../../pipes/safe.pipe';
import moment from 'moment';
import { K } from '../../constants/constants';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import {
  UserState,
  UserStateService,
} from '../../services/user/user-state.service';
import { MixpanelService } from '../../services/mixpanel/mixpanel.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  ApiError,
  ensureApiError,
} from '../../interceptors/api-error.interceptor';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    SafePipe,
    CardModule,
    NgCircleProgressModule,
    ProgressSpinnerModule,
    AccordionModule,
    DialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  logo: string = '';
  isLoading = false;
  word: string = '';
  uniqueStyleAndDescription: any = {};
  uniqueStyleThumbnail: string = '';
  modalVideolink: string = '';
  uniqueStyleVideo: string = '';
  marketMoodVideo: string = 'https://www.youtube.com/embed/pcIbrCrxgZA';
  biasesVideo: any = {};
  display = false;
  showCard: any = {
    video: true,
    performanceKeys: true,
    report: true,
    workTalents: false, // only in Talent case
    careerInsights: false, // only in Talent case
    fbOverview: false, // only in case of investor
    marketMood: false, // only in case of investor
    fbInsights: false, // only in case of investor
    bBiases: false, // only in case of investor
  };
  discoveryType: string = '';
  secondaryColor = '';
  secondaryColor2 = '';
  primaryColor = '';
  performanceGuide: any = {};
  marketMood: any = {};
  scoreFDNA5: any = [];
  careerInsightsData: any = [];
  behavioralBiases: any = [];
  scoreBDNA5: any = [];
  displayTrialModal = false;
  discoveryDto: any = {};
  subscriptionFeatures: any;
  dashboardBDNASetting: any;
  dashboardFDNASetting: any;
  videoUrl: any;
  vowels: any = ['a', 'e', 'i', 'o', 'u'];
  private userState: UserState | null = null;
  error: string | null = null;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private userStateService: UserStateService,
    private mixpanelService: MixpanelService,
  ) {
    this.primaryColor = localStorage.getItem('primaryColor') || '#eead32';
    this.secondaryColor = localStorage.getItem('secondaryColor') || '#2e9b64';
    this.logo = localStorage.getItem('logo') || '';
    document.documentElement.style.setProperty(
      `--primary-color`,
      this.primaryColor,
    );
    document.documentElement.style.setProperty(
      `--secondary-color`,
      this.secondaryColor,
    );
    this.discoveryType = localStorage.getItem('discoveryType') || '';
  }

  ngOnInit(): void {
    window.parent.postMessage(
      {
        type: 'screenChanged',
        screen: 'dashboard',
      },
      '*',
    );
    const currentDate = moment().format('DD-MM-YYYY');
    this.mixpanelService.track('DASHBOARD_LOADED');
    this.userStateService.getUserState().subscribe({
      next: (state) => {
        if (state) {
          this.userState = state;
          if (this.userState?.accountId) {
            this.isLoading = true;
            this.dashboardService
              .getUniqueStyleAndDesc(this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.word = data.behaviorTypeName;
                    this.uniqueStyleAndDescription = { ...data };
                    this.uniqueStyleThumbnail =
                      K.APP.UNIQUE_STYLE_THUMBNAIL[this.word];
                    this.isLoading = false;

                    this.dashboardService.getUniqueStyleVideoLinks().subscribe({
                      next: (response: any) => {
                        const resArray = response?.body?.value;
                        resArray.forEach((item: any) => {
                          if (item.UniqueStyle === this.word) {
                            const videoId = item.videoURL.split('be/')[1];
                            this.uniqueStyleVideo = `https://www.youtube.com/embed/${videoId}`;
                          }
                        });
                      },
                      error: (err) =>
                        this.handleApiError(err, 'getUniqueStyleVideoLinks'),
                    });
                  }
                },
                error: (err) =>
                  this.handleApiError(err, 'getUniqueStyleAndDesc'),
              });

            this.dashboardService
              .getVideoUrl(this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.uniqueStyleVideo =
                      'https://www.youtube.com/embed/' +
                      (this.discoveryType === 'Investor'
                        ? data.fdnaVideo.split('=')[1]
                        : data.bdnaVideo.split('=')[1]);
                  }
                },
                error: (err) => this.handleApiError(err, 'getVideoUrl'),
              });

            this.dashboardService
              .getPerformanceGuides(this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.performanceGuide = data;
                  }
                },
                error: (err) =>
                  this.handleApiError(err, 'getPerformanceGuides'),
              });

            this.dashboardService
              .getBDNA5Scores(this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.scoreBDNA5 = this.parseFDNAandBDNAObjects(data);

                    this.scoreBDNA5.map((talent: any) => {
                      talent['titleSparsed'] = talent?.title?.split(' ');
                    });
                  }
                },
                error: (err) => this.handleApiError(err, 'getBDNA5Scores'),
              });

            this.dashboardService
              .getFDNA5Scores(this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.scoreFDNA5 = this.parseFDNAandBDNAObjects(data);
                    this.scoreFDNA5.map((talent: any) => {
                      talent['titleSparsed'] = talent?.title?.split(' ');
                    });
                  }
                },
                error: (err) => this.handleApiError(err, 'getFDNA5Scores'),
              });

            this.dashboardService
              .getMarketMoodData(currentDate, this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.marketMood = {
                      ...data,
                      marketMoodDescriptions: this.removeBoldTagFromMoodData(
                        data?.marketMoodDescriptions,
                      ),
                    };
                  }
                },
                error: (err) => this.handleApiError(err, 'getMarketMoodData'),
              });

            this.dashboardService
              .getBehaviorBiases(this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.behavioralBiases = this.parseBehaviorBiasesList(data);
                    let biaseName: string = this.behavioralBiases[0]?.name;
                    this.biasesVideo.firstBiase =
                      K.APP.BEHAVIORAL_BIASES_VIDEOS[biaseName];
                    biaseName = this.behavioralBiases[1]?.name;
                    this.biasesVideo.secondBiase =
                      K.APP.BEHAVIORAL_BIASES_VIDEOS[biaseName];
                  }
                },
                error: (err) => this.handleApiError(err, 'getBehaviorBiases'),
              });

            this.dashboardService
              .getHiringData(this.userState?.personId)
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                  }
                },
                error: (err) => this.handleApiError(err, 'getHiringData'),
              });

            this.dashboardService
              .getBDNADashboardSetting(
                this.userState?.accountId || '',
                this.userState?.selfRegistrationId || '',
              )
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.dashboardBDNASetting = data;
                    if (this.discoveryType === 'WorkTalent') {
                      this.discoveryDto = this.dashboardBDNASetting;
                      this.setCardPermissions(this.discoveryType);
                    }
                  }
                },
                error: (err) =>
                  this.handleApiError(err, 'getBDNADashboardSetting'),
              });

            this.dashboardService
              .getFDNADashboardSetting(
                this.userState?.selfRegistrationId || '',
                this.userState?.accountId || '',
              )
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.dashboardFDNASetting = data;
                    if (this.discoveryType === 'Investor') {
                      this.discoveryDto = this.dashboardFDNASetting;
                      this.setCardPermissions(this.discoveryType);
                    }
                  }
                },
                error: (err) =>
                  this.handleApiError(err, 'getFDNADashboardSetting'),
              });

            this.dashboardService
              .getSubscriptionFeature(this.userState?.accountId || '')
              .subscribe({
                next: (response: any) => {
                  const data = response.body?.data;
                  if (data) {
                    this.subscriptionFeatures = data;
                  }
                },
                error: (err) =>
                  this.handleApiError(err, 'getSubscriptionFeature'),
              });
            this.dashboardService
              .getCareerInsights(this.userState?.personId as any)
              .subscribe({
                next: (response: any) => {
                  this.careerInsightsData = response?.body?.data?.talents;
                },
                error: (err) => this.handleApiError(err, 'getCareerInsights'),
              });
          }
        }
      },
      error: (err) => this.handleApiError(err, 'getUserState'),
    });
  }

  private handleApiError(error: unknown, context: string): void {
    const apiError: ApiError = ensureApiError(error);
    this.error = apiError.message;
    this.isLoading = false;
    this.mixpanelService.track('API_ERROR', {
      context,
      status: apiError.status,
      message: apiError.message,
    });
  }

  setCardPermissions(userType: string) {
    if (userType === 'Investor') {
      this.showCard = {
        ...this.showCard,
        report: this.discoveryDto?.isViewReport,
        video: this.discoveryDto?.isVideo,
        performanceKeys: this.discoveryDto?.isPGuide,
        fbOverview: this.discoveryDto?.isBehavOverview,
        marketMood: this.discoveryDto?.isMarketMood,
        fbInsights: this.discoveryDto?.isFDNA5Score,
        bBiases: this.discoveryDto?.isBehavioralBiases,
      };
    } else if (userType === 'WorkTalent') {
      this.showCard = {
        ...this.showCard,
        workTalents: this.discoveryDto?.isBDNA5KeyWorkTalents,
        report: this.discoveryDto?.isViewReport,
        careerInsights: this.discoveryDto?.isDesiredTaskBasedTalent,
        performanceKeys: this.discoveryDto?.isPGuide,
        video: this.discoveryDto?.isVideo,
      };
    }
  }

  showDialog(dialogType: any) {
    if (dialogType == 'uniqueStyle') {
      this.modalVideolink = this.uniqueStyleVideo;
    } else if (dialogType == 'marketMood') {
      this.modalVideolink = this.marketMoodVideo;
    } else if (dialogType == 'biase0') {
      this.modalVideolink = this.biasesVideo.firstBiase;
    } else if (dialogType == 'biase1') {
      this.modalVideolink = this.biasesVideo.secondBiase;
    }
    this.display = true;
  }

  viewReport() {
    if (this.discoveryType === 'Investor') {
      this.router.navigate(['/fdna-report'], {
        replaceUrl: true,
      });
    } else if (this.discoveryType === 'WorkTalent') {
      this.router.navigate(['/bdna-report'], {
        replaceUrl: true,
      });
    }
  }

  parseFDNAandBDNAObjects(insightsRawData: any) {
    const insights: any[] = [];
    Object.keys(insightsRawData ?? []).forEach((ins: any) => {
      if (typeof insightsRawData[ins] === 'object') {
        const splittedTitle = ins.split(/(?=[A-Z])/).join(' ');
        const normalizedTitle =
          splittedTitle.charAt(0).toUpperCase() + splittedTitle.slice(1);
        const insObject = {
          key: ins,
          title: normalizedTitle,
          ...insightsRawData[ins],
        };
        insights.push(insObject);
      }
    });

    return insights;
  }

  removeBoldTagFromMoodData(mood: any) {
    return mood?.map((moodData: any) => {
      return {
        heading: moodData.heading.replace(/<b>|<\/b>/g, ''),
        description: moodData.description,
      };
    });
  }

  parseBehaviorBiasesList(behavioralBiases: any) {
    let biasesList: any[] = [];

    Object.keys(behavioralBiases ?? []).forEach((bIndex: any) => {
      if (typeof behavioralBiases[bIndex] === 'object')
        biasesList.push(behavioralBiases[bIndex]);
    });
    biasesList.sort((a: any, b: any) => b.population - a.population);
    return biasesList;
  }
}
