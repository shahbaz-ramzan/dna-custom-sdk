import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserState {
  personId?: string;
  creditId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  currentQuestionId?: number;
  isCompleted?: boolean;
  questionPattern?: string;
  accountId?: string;
  selfRegistrationId?: string;
  discoveryType?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userState = new BehaviorSubject<UserState | null>(null);

  setUserState(state: UserState) {
    this.userState.next(state);
    // Optionally persist to localStorage
    // localStorage.setItem('userState', JSON.stringify(state));
  }

  getUserState(): Observable<UserState | null> {
    return this.userState.asObservable();
  }

  clearUserState() {
    this.userState.next(null);
    // localStorage.removeItem('userState');
  }
}
