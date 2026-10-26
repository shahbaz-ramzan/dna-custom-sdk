import { Injectable } from '@angular/core';
import { NetworkService } from '../network/network.service';
import { environment } from '../../../environments/environment';
import { NETWORK } from '../../constants/network-constants';
import ConstructHttpRequest from '../../utils/http-request';

@Injectable({
  providedIn: 'root',
})
export class bdnaReportService {
  constructor(private networkService: NetworkService) {}

  private getHeaders() {
    return {
      'subscription-key': localStorage.getItem('subscription-key') || '',
    };
  }

  getUniqueStyleAndDesc(personId: any, languageId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_UNIQUE_STYLE_AND_DESC}/${personId}/${languageId}`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getUniqueStyleandDescription(personId: string, languageId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_UNIQUE_STYLE_AND_DESC}/${personId}/${languageId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  // Unused - never called anywhere in the app. Superseded by DashboardService.getSubscriptionFeature
  // (singular), which uses NETWORK.uri.GET_SUBSCRIPTIONS_FEATURE instead.
  // getSubscriptionFeatures(accountId: string) {
  //   const url = `${environment.publicApiUrl}${NETWORK.URL.GET_SUBSCRIPTION_FEATURES}/${accountId}`;
  //
  //   const request = ConstructHttpRequest(
  //     NETWORK.METHODS.GET,
  //     url,
  //     null,
  //     this.getHeaders()
  //   );
  //
  //   return this.networkService.httpCall(request, true);
  // }

  getBDNADashboardSetting(selfRegistrationId: string, accountId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_BDNA_DASHBOARD_SETTING}/${selfRegistrationId}/${accountId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getFDNADashboardSetting(selfRegistrationId: string, accountId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_FDNA_DASHBOARD_SETTING}/${selfRegistrationId}/${accountId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getPerformanceGuide(personId: string, languageId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_PERFORMANCE_GUIDE}/${personId}/${languageId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getVideoUrl(personId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_VIDEO_URL}/${personId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getBDNA5Scores(personId: string, languageId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_BDNA5_SCORE}/${personId}/${languageId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getFDNA5Scores(personId: string, languageId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_FDNA5_SCORE}/${personId}/${languageId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getMarketMoodArray(personId: string, portfolioValue: any, date: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_MARKET_MOOD_ARRAY}/${personId}/${portfolioValue}/${date}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getBehavioralBiases(personId: string, languageId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_BEHAVIORAL_BIASES}/${personId}/${languageId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getCustomReportName(accountId: any, reportId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_CUSTOM_REPORT}/${accountId}/${reportId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  changeAccountPassword(credentials: any) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.CHANGE_ACCOUNT_PASSWORD}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.POST,
      url,
      credentials,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  //   static changeInvestorPassword(credentials: any) {
  //     return new Request(
  //       K.NETWORK.URL.CHANGE_INVESTOR_PASSWORD,
  //       K.NETWORK.METHOD.POST,
  //       credentials
  //     );
  //   }

  getCareerInsights(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.URL.GET_CAREERS_INSIGHTS}/${personId}`;

    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
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

  parseBehaviorBiasesList(behavioralBiases: any) {
    let biasesList: any[] = [];

    Object.keys(behavioralBiases ?? []).forEach((bIndex: any) => {
      if (typeof behavioralBiases[bIndex] === 'object')
        biasesList.push(behavioralBiases[bIndex]);
    });
    biasesList.sort((a: any, b: any) => b.population - a.population);
    return biasesList;
  }

  removeBoldTagFromMoodData(mood: any) {
    return mood?.map((moodData: any) => {
      return {
        heading: moodData.heading.replace(/<b>|<\/b>/g, ''),
        description: moodData.description,
      };
    });
  }

  toDataURL(url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        const base64Image = reader.result
          ?.toString()
          .replace('application/octet-stream', 'image/jpeg');
        callback(base64Image);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
}
