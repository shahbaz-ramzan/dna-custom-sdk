import { Injectable } from '@angular/core';
import { NetworkService } from '../network/network.service';
import { environment } from '../../../environments/environment';
import { NETWORK } from '../../constants/network-constants';
import ConstructHttpRequest from '../../utils/http-request';
import { AccountRequest } from '../requests/account-requests';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private networkService: NetworkService) {}

  getAccountSettings(accountId: any, selfRegId: any) {
    const url = `${environment.privateNoAuthUrl}${NETWORK.uri.GET_ACCOUNT_SETTINGS}/${accountId}/${selfRegId}`;

    const request = ConstructHttpRequest(NETWORK.METHODS.GET, url, {});
    return this.networkService.httpCall(request, true);
  }

  checkUserExists(userName: any) {
    return this.networkService.httpCall(
      AccountRequest.checkUserExistsReq(userName)
    );
  }

  createParticipantAccount(userData: any) {
    return this.networkService.httpCall(
      AccountRequest.createParticipantAccountReq(userData)
    );
  }

  getDiscoveryStatus(creditId: any) {
    return this.networkService.httpCall(
      AccountRequest.getDiscoveryStatusReq(creditId)
    );
  }
}
