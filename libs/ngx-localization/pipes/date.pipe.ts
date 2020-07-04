import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '../localization.service';

@Pipe({
  name: 'dynamicPureDate',
  pure: true
})
export class DynamicPureDatePipe implements PipeTransform  {

  constructor(
    protected localizationService: LocalizationService
  ) {
    // not empty
  }

  transform(value: any, pattern?: string): string {
    return this.localizationService.date(value, pattern);
  }
}

@Pipe({
  name: 'dynamicDate',
  pure: false
})
export class DynamicDatePipe extends DynamicPureDatePipe implements PipeTransform {
  constructor(localizationService: LocalizationService) {
    super(localizationService);
  }
}
