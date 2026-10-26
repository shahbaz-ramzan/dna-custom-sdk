import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NETWORK } from '../../constants/network-constants';
import { TranslationResponse } from '../../types/translations';
import ConstructHttpRequest from '../../utils/http-request';
import { NetworkService } from '../network/network.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: Array<TranslationResponse> = [];

  constructor(private networkService: NetworkService) {}

  loadTranslations() {
    const url = `${NETWORK.baseLangUrl}/${NETWORK.uri.LANG_TABLE_POC}${NETWORK.azureSharedAccessKey}`;

    const request = ConstructHttpRequest(NETWORK.METHODS.GET, url, {}, {});

    return this.networkService.httpCall(request, true);
  }

  saveTranslations(translations: TranslationResponse[]) {
    this.translations = [...translations];
  }

  getTranslations() {
    return [...this.translations];
  }
}
