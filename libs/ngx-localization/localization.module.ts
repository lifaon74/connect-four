import { NgModule, ModuleWithProviders } from '@angular/core';

import { LocalizationService } from './localization.service';

import { TranslatePipe } from './pipes/translate.pipe';
import { DynamicDatePipe, DynamicPureDatePipe } from './pipes/date.pipe';
import { DynamicCurrencyPipe, DynamicPureCurrencyPipe } from './pipes/currency.pipe';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [HttpClientModule],
  declarations: [TranslatePipe, DynamicDatePipe, DynamicPureDatePipe, DynamicCurrencyPipe, DynamicPureCurrencyPipe],
  exports: [TranslatePipe, DynamicDatePipe, DynamicPureDatePipe, DynamicCurrencyPipe, DynamicPureCurrencyPipe]
})
export class LocalizationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocalizationModule,
      providers: [LocalizationService]
    };
  }
}
