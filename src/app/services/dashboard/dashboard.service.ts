import { Injectable } from '@angular/core';
import { NetworkService } from '../network/network.service';
import { environment } from '../../../environments/environment';
import { NETWORK } from '../../constants/network-constants';
import ConstructHttpRequest from '../../utils/http-request';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private networkService: NetworkService) {}

  private getHeaders() {
    return {
      'subscription-key': localStorage.getItem('subscription-key') || '',
    };
  }

  getUniqueStyleAndDesc(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_UNIQUE_STYLE_AND_DESC}/${personId}/22`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getVideoUrl(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_VIDEO_URL}/${personId}`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getPerformanceGuides(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_PERFORMANCE_GUIDE}/${personId}/22`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getBDNA5Scores(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_BDNA_5_SCORE}/${personId}/22`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getFDNA5Scores(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_FDNA_5_SCORE}/${personId}/22`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getMarketMoodData(date: string, personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_MARKET_MOOD_DATA}/${personId}/-1/${date}`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getBehaviorBiases(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_BEHAVIORAL_BIASES}/${personId}/22`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getHiringData(personId: any) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_HIRING_DATA}/${personId}`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getBDNADashboardSetting(accountId: string, selfRegistrationId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_BDNA_DASHBOARD_SETTING}/${selfRegistrationId}/${accountId}`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getFDNADashboardSetting(selfRegistrationId: string, accountId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_FDNA_DASHBOARD_SETTING}/${selfRegistrationId}/${accountId}`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }

  getSubscriptionFeature(accountId: string) {
    const url = `${environment.publicApiUrl}${NETWORK.uri.GET_SUBSCRIPTIONS_FEATURE}/${accountId}`;
    const request = ConstructHttpRequest(
      NETWORK.METHODS.GET,
      url,
      null,
      this.getHeaders()
    );

    return this.networkService.httpCall(request, true);
  }
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

  getUniqueStyleVideoLinks() {
    const url = `${NETWORK.baseLangUrl}/${NETWORK.uri.GET_UNIQUE_STYLE_VIDEO_LINKS}${NETWORK.azureSharedAccessKey}`;

    const request = ConstructHttpRequest(NETWORK.METHODS.GET, url, {}, {});

    return this.networkService.httpCall(request, true);
  }
}
