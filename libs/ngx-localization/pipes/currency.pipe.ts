import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '../localization.service';

@Pipe({
  name: 'dynamicPureCurrency',
  pure: true
})
export class DynamicPureCurrencyPipe implements PipeTransform  {

  constructor(
    protected localizationService: LocalizationService
  ) {
    // not empty
  }

  transform(value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): string {
    return this.localizationService.currency(value, currencyCode, symbolDisplay, digits);
  }
}

@Pipe({
  name: 'dynamicCurrency',
  pure: false
})
export class DynamicCurrencyPipe extends DynamicPureCurrencyPipe implements PipeTransform {
  constructor(localizationService: LocalizationService) {
    super(localizationService);
  }
}
