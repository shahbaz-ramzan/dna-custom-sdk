import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Question, Questions } from '../../constants/questions';
import { KeyValuePipe, NgClass, NgFor, NgIf } from '@angular/common';

import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Languages } from '../../types/translations';

@Component({
  selector: 'app-wizard-form',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    NgClass,
    KeyValuePipe,
    StepperModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    TranslatePipe,
  ],
  templateUrl: './wizard-form.component.html',
  styleUrl: './wizard-form.component.scss',
})
export class WizardFormComponent {
  questions: Map<string, Question> = Questions;
  activeStep: number = 0;

  selectedLanguage = (localStorage.getItem('lang') as Languages) || 'enUS';

  disableFields(question: Question) {
    const { options } = question;
    let selectedMostIndex: number = -1;
    let selectedLeastIndex: number = -1;

    options.forEach((o, i) => {
      if (o.value === 'most') {
        selectedMostIndex = i;
      }
      if (o.value === 'least') {
        selectedLeastIndex = i;
      }
    });

    // Handling "Most" options disabling
    options.forEach((o, i) => {
      o.disableMost = selectedMostIndex >= 0 && i !== selectedMostIndex; // disable all "Most" options except the selected option
    });
    if (selectedLeastIndex >= 0) {
      options[selectedLeastIndex].disableMost = true;
    }

    // Handling "Least" options disabling
    options.forEach((o, i) => {
      o.disableLeast = selectedLeastIndex >= 0 && i !== selectedLeastIndex; // disable all "Least" options except the selected option
    });
    if (selectedMostIndex >= 0) {
      options[selectedMostIndex].disableLeast = true;
    }

    // Handling button "Next" button disabling
    const selectedItems = options.filter(
      (o) => o.value === 'most' || o.value === 'least'
    );
    question.areAnswersValid = selectedItems.length === 2;
  }

  onSubmit() {
    this.activeStep = 0;
    this.questions.forEach((q) => {
      q.areAnswersValid = false;
      q.options.forEach((o) => {
        o.disableLeast = false;
        o.disableMost = false;
        o.value = '';
      });
    });
  }

  onLanguageChange() {
    localStorage.setItem('lang', this.selectedLanguage);
  }
}
