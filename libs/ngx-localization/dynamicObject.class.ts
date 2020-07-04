// import { isDevMode } from '@angular/core';
import { LocalizationService } from './localization.service';


export class DynamicObject<T> {
  static cacheTimeout: number = 400;
  static cacheLimit: number = 100; // 4
  static allowCache: boolean = true; // !isDevMode()

  public cacheTimeout: number = DynamicObject.cacheTimeout;
  public cacheLimit: number = DynamicObject.cacheLimit;
  public cached: number = 0;

  constructor(public object: any = {}) {
    if(!LocalizationService.service) {
      throw new Error('LocalizationService must have been initialized');
    }
    this.cacheNext();
  }

  cacheNext(numberToCache: number = 9999, cacheTimeout: number = this.cacheTimeout, cacheLimit: number = this.cacheLimit): this {
    if(DynamicObject.allowCache) {
      this.cached = numberToCache;
      this.cacheTimeout = cacheTimeout;
      this.cacheLimit = cacheLimit;
    }
    return this;
  }

  set(property: string, callback: (() => any)): this {
    this._cache(property, callback);
    return this;
  }

  translate(property: string, value: string, params?: any): this {
    this._cache(property, () => {
      return LocalizationService.service.translate(value, params);
    });
    return this;
  }

  date(property: string, value: any, pattern?: any): this {
    this._cache(property, () => {
      return LocalizationService.service.date(value, pattern);
    });
    return this;
  }

  currency(property: string, value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): this {
    this._cache(property, () => {
      return LocalizationService.service.currency(value, currencyCode, symbolDisplay, digits);
    });
    return this;
  }

  get(): T {
    return <T>this.object;
  }

  private _cache(property: string, callback: (() => string)) {
    if(this.cached > 0) {
      this.cached--;
      let cachedValue: string;
      let cachedTimestamp: number = 0;
      let cachedCalls: number = this.cacheLimit;

      Object.defineProperty(this.object, property, {
        get: () => {
          // console.log('get ' + property);
          if((cachedCalls > this.cacheLimit) || (performance.now() - cachedTimestamp > this.cacheTimeout)) {
            // console.warn('update ' + property);
            cachedValue = callback();
            cachedTimestamp = performance.now();
            cachedCalls = 0;
          }
          return cachedValue;
        },
      });
    } else {
      Object.defineProperty(this.object, property, {
        get: callback,
      });
    }
  }
}

