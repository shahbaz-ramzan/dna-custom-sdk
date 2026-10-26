import { Component, Inject, Injectable } from '@angular/core';

import { K } from '../../constants/constants';

import Request from './index';
@Injectable({
  providedIn: 'root',
})
export class AccountRequest extends Request {
  constructor(@Inject('params') private params: any) {
    super(params);
  }

  private static getHeaders() {
    return {
      'subscription-key': localStorage.getItem('subscription-key') || '',
    };
  }

  static checkUserExistsReq(userName: string) {
    return new Request(
      `${K.NETWORK.URL.CHECK_USER_EXISTS}/${userName}`,
      K.NETWORK.METHODS.GET,
      {},
      false,
      this.getHeaders()
    );
  }

  static createParticipantAccountReq(userData: any) {
    return new Request(
      K.NETWORK.URL.CREATE_PARTICIPANT_ACCOUNT,
      K.NETWORK.METHODS.POST,
      userData,
      false,
      this.getHeaders()
    );
  }

  static getDiscoveryStatusReq(creditId: any) {
    return new Request(
      `${K.NETWORK.URL.GET_DISCOVERY_STATUS}/${creditId}`,
      K.NETWORK.METHODS.GET,
      {},
      false,
      this.getHeaders()
    );
  }
}
