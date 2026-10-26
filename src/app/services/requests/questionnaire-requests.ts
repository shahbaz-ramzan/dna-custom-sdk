import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { K } from '../../constants/constants';
// import K from 'src/app/constants/index';
// import { NetworkService } from 'src/app/service/network.service';
import Request from './index';
// import Request from 'src/app/service/requests';
@Injectable({
  providedIn: 'root',
})
export class QuestionnaireRequest extends Request {
  constructor(@Inject('params') private params: any) {
    super(params);
  }

  private static getHeaders() {
    return {
      'subscription-key': localStorage.getItem('subscription-key') || '',
    };
  }

  static getQuestionsList(profileId: any, languageId: any) {
    return new Request(
      K.NETWORK.URL.GET_QUESTIONS_LIST + '/' + profileId + '/' + languageId,
      K.NETWORK.METHODS.GET
    );
  }

  static getQuestionAnswerStatus(personId: any) {
    return new Request(
      K.NETWORK.URL.GET_QUESTION_ANSWER_STATUS + '/' + personId,
      K.NETWORK.METHODS.GET,
      {},
      false,
      this.getHeaders()
    );
  }

  static saveQuestionAnswer(questionData: any) {
    return new Request(
      K.NETWORK.URL.SAVE_QUESTION_ANSWER,
      K.NETWORK.METHODS.POST,
      questionData,
      false,
      this.getHeaders()
    );
  }

  static insert11Q17QAnswers(questionData: any) {
    return new Request(
      K.NETWORK.URL.insert11Q17QAnswers,
      K.NETWORK.METHODS.POST,
      questionData,
      false,
      this.getHeaders()
    );
  }
}
