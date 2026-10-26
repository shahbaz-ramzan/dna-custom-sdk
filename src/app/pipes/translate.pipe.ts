import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation/translation.service';
import { Languages } from '../types/translations';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: string, lang: string): string {
    const translations = this.translationService.getTranslations();
    const translation = translations.find((t) => value === t.Item);

    return translation ? translation[lang as Languages] : value;
  }
}
