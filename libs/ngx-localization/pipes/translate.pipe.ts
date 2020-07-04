import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LocalizationService } from '../localization.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {

  protected _translatePromise: Promise<void>;

  protected _cachedParams: string;
  protected _cachedResult: string;

  protected _onLocaleChangeSubscription: any;

  constructor(
    protected localizationService: LocalizationService
  ) {
    this._translatePromise = Promise.resolve();
    this._cachedParams = '';
    this._cachedResult = '';

    this._onLocaleChangeSubscription = localizationService.onLocaleChange.subscribe(() => {
      this._cachedParams = null;
    });
  }

  transform(value: string, params: any = {}): string {
    if (params === null) {
      params = {};
    }

    const paramsKey = `${value}-${JSON.stringify(params)}`;
    if (paramsKey !== this._cachedParams) {
      this._cachedParams = paramsKey;
      this._translatePromise = this._translatePromise
        .then(() => {
          return this.localizationService.translateAsync(value, params)
            .then((translation: string) => {
              this._cachedResult = translation;
            }, () => {
              this._cachedResult = value;
            });
        });

    }

    return this._cachedResult;
  }

  ngOnDestroy(): void {
    this._onLocaleChangeSubscription.unsubscribe();
  }

}


