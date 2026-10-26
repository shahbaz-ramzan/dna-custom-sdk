import { Routes } from '@angular/router';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ErrorPageComponent } from './components/errorPage/not-found.component';
import { BdnaReportsComponent } from './components/bdna-reports/bdna-reports.component';
import { FdnaReportsComponent } from './components/fdna-reports/fdna-reports.component';

export const routes: Routes = [
  { path: 'instructions', component: InstructionsComponent },
  { path: 'questionnaire', component: QuestionnaireComponent },
  { path: 'bdna-report', component: BdnaReportsComponent },
  { path: 'fdna-report', component: FdnaReportsComponent },

  {
    path: 'not-found',
    component: ErrorPageComponent,
  },
  // {
  //   path: '**',
  //   redirectTo: 'error',
  // },
  { path: 'dashboard', component: DashboardComponent },
];
