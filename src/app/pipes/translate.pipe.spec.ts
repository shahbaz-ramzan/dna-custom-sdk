import { TranslatePipe } from './translate.pipe';
import { TranslationService } from '../services/translation/translation.service';

describe('TranslatePipe', () => {
  it('create an instance', () => {
    const pipe = new TranslatePipe({} as TranslationService);
    expect(pipe).toBeTruthy();
  });
});
