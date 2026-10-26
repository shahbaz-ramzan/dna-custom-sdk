import { Injectable } from '@angular/core';

// import { NetworkService } from 'src/app/service/network.service';
import { QuestionnaireRequest } from '../requests/questionnaire-requests';
import { NetworkService } from '../network/network.service';
import { BehaviorSubject, Observable } from 'rxjs';
// import { QuestionnaireRequest } from 'src/app/service/requests/questionnaire-requests';
export interface QuestionProgress {
  currentQuestionId: number;
  totalQuestions: number;
  isCompleted: boolean;
  answers?: {
    questionId: number;
    most: number;
    least: number;
  }[];
}
@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private questionProgress = new BehaviorSubject<any | null>(null);
  constructor(private networkService: NetworkService) {}

  setQuestionProgress(progress: any) {
    this.questionProgress.next(progress);
    // Optionally persist to localStorage
    localStorage.setItem('questionProgress', JSON.stringify(progress));
  }

  getQuestionProgress(): Observable<any | null> {
    return this.questionProgress.asObservable();
  }

  getQuestionListCall(profileId: any, languageId: any) {
    return this.networkService.httpCall(
      QuestionnaireRequest.getQuestionsList(profileId, languageId)
    );
  }

  getQuestionaAnswerStatusCall(personId: any) {
    return this.networkService.httpCall(
      QuestionnaireRequest.getQuestionAnswerStatus(personId)
    );
  }

  saveQuestionAnswerCall(questionData: any) {
    return this.networkService.httpCall(
      QuestionnaireRequest.saveQuestionAnswer(questionData)
    );
  }

  insert11Q17QAnswers(questionData: any) {
    return this.networkService.httpCall(
      QuestionnaireRequest.insert11Q17QAnswers(questionData)
    );
  }
}
