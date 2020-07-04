import { EventEmitter, Injectable } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export enum LocaleTypes {
  DATE = 'date',
  CURRENCY = 'currency',
  TRANSLATE = 'translate',
}

export type TLocaleTypes = 'date' | 'currency' | 'translate' | LocaleTypes;

export interface Translations {
  [key: string]: string;
}

export type TranslationsLoaderCallback = (locale: string) => Promise<Translations>;

export interface TranslateParams {
  [key: string]: string;
}

export interface TranslateMap {
  [key: string]: TranslateParams;
}

export class LocaleChange {
  constructor(
    public previousValue: string,
    public currentValue: string,
    public type: string,
  ) {
  }
}


@Injectable()
export class LocalizationService {

  static service: LocalizationService = null;
  static localeTypes: TLocaleTypes[] = ['date', 'currency', 'translate'];

  public onLocaleChange: EventEmitter<LocaleChange> = new EventEmitter<LocaleChange>();


  protected _locales: { [name: string]: string };
  protected _translations: { [locale: string]: Translations };
  protected _translationsLoaderCallback: TranslationsLoaderCallback;
  protected _getTranslationsPromise: Promise<Translations>;

  protected _cachedPipes: any;
  protected _cachedPipeResults: any;
  protected _cachedTranslateVrariableRegExp: RegExp;
  protected _polyfilledLocales: string[];

  constructor(private http: HttpClient) {
    this._locales = {};
    this._translations = {};
    this._getTranslationsPromise = null;


    this._cachedPipes = {};
    this._cachedPipeResults = {};
    this._cachedTranslateVrariableRegExp = new RegExp('\\{\\{ *(\\w+) *\\}\\}', 'g');

    this._polyfilledLocales = [];

    this.createTranslationsLoader('/i18n/{{locale}}.json');

    this.setLocale(this.getNavigatorLanguage());

    LocalizationService.service = this;
  }


  polyfillIntl(locales: string[] = []): Promise<void> {
    return new Promise<void>((resolve: any, reject: any) => {
      const localesToPolyfill: string[] = locales.filter((locale: string) => this._polyfilledLocales.includes(locale));

      if (localesToPolyfill.length > 0) {
        Array.prototype.push.apply(this._polyfilledLocales, localesToPolyfill);

        const scriptElement: HTMLScriptElement = document.createElement('script');
        const features: string = localesToPolyfill.map((locale: string) => ('Intl.~locale.' + encodeURIComponent(locale))).join(',');
        const callback: string = new Array(16).fill(null).map(() => String.fromCodePoint(0x61 + Math.floor(Math.random() * 26))).join('');
        let timer: any;


        let onError: any, clear: any, _resolve: any, _reject: any;

        onError = () => {
          _reject('bad request');
        };

        clear = () => {
          delete (window as any)[callback];
          scriptElement.removeEventListener('error', onError);
          document.head.removeChild(scriptElement);
          clearTimeout(timer);
        };

        _resolve = () => {
          clear();
          resolve();
        };

        _reject = (message: string) => {
          clear();
          reject(new Error('Failed to load polyfill : ' + message));
        };


        timer = setTimeout(() => {
          _reject('request timeout');
        }, 30000);

        (window as any)[callback] = _resolve;

        scriptElement.addEventListener('error', onError);
        scriptElement.src = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=' + features + '&callback=' + encodeURIComponent(callback);

        document.head.appendChild(scriptElement);
      } else {
        resolve();
      }
    });
  }


  /** SET/GET **/

  // locale
  getLocale(type: TLocaleTypes, reduced: boolean = false): string {
    return reduced
      ? this.reduceLocale(this.getLocale(type, false))
      : this._locales[type];
  }

  setLocale(locale: string, type?: TLocaleTypes): void {
    if (type === void 0) {
      for (const type of LocalizationService.localeTypes) {
        this.setLocale(locale, type);
      }
    } else {
      switch (type) {
        case 'date':
        case 'currency':
        case 'translate':
          break;
        default:
          throw new Error('Unknown localeType');
      }

      const previousValue: string = this._locales[type];
      this._locales[type] = locale;
      this.onLocaleChange.emit(new LocaleChange(previousValue, locale, type));
    }
  }

  getNavigatorLanguage(): string {
    return window.navigator.language || 'en';
  }


  clearCache(): void {
    this._cachedPipes = {};
    this._cachedPipeResults = {};
  }

  reduceLocale(locale: string): string {
    const parts = locale.split(/_|-/g);
    return parts[0];
  }


  /** DATE **/

  /**
   * Return a formatted date according to the 'date' locale.
   * See [DatePipe](https://angular.io/docs/ts/latest/api/common/index/DatePipe-pipe.html) for more details.
   *
   * @param value
   * @param pattern
   * @returns {string}
   */
  date(value: any, pattern?: string): string {
    const key: string = 'date-' + this._locales['date'];
    if (this._cachedPipes[key] === void 0) {
      this._cachedPipes[key] = new DatePipe(this._locales['date']);
    }

    const _key: string = `${ key }-${ value }${ (pattern ? ('-' + pattern) : '') }`;
    if (this._cachedPipeResults[_key] === void 0) {
      this._cachedPipeResults[_key] = this._cachedPipes[key].transform(value, pattern);
    }
    return this._cachedPipeResults[_key];
  }


  /** CURRENCY **/

  /**
   * Return a formatted currency according to the 'currency' locale.
   * See [CurrencyPipe](https://angular.io/docs/ts/latest/api/common/index/CurrencyPipe-pipe.html) for more details.
   *
   * @param value
   * @param currencyCode
   * @param symbolDisplay
   * @param digits
   * @returns {string}
   */
  currency(value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): string {
    const key: string = 'currency-' + this._locales['currency'];
    if (this._cachedPipes[key] === void 0) {
      this._cachedPipes[key] = new CurrencyPipe(this._locales['currency']);
    }

    const _key: string = `${ key }-${ value }${ (currencyCode ? ('-' + currencyCode) : '') }`
      + `${ (symbolDisplay ? ('-' + symbolDisplay) : '') }${ (digits ? ('-' + digits) : '') }`;
    if (this._cachedPipeResults[_key] === void 0) {
      this._cachedPipeResults[_key] = this._cachedPipes[key].transform(value, currencyCode, symbolDisplay, digits);
    }
    return this._cachedPipeResults[_key];
  }


  /** TRANSLATIONS **/

  /**
   * Provide a callback which must return a promise with a list of translations.
   * This callback will be called as soon as a list of translations will be required for a specific locale.
   * By default, the LocalizationService will fetch `'/i18n/' + locale + '.json'`.
   *
   * @param translationsLoaderCallback
   * @returns {}
   */
  setTranslationsLoader(translationsLoaderCallback: TranslationsLoaderCallback): void {
    this._translationsLoaderCallback = translationsLoaderCallback;
  }


  /**
   * Create and set a simple translations loader by providing an url template :
   * ex: '/i18n/{{locale}}.json'
   *
   * @param url
   * @param set
   * @returns {TranslationsLoaderCallback}
   */
  createTranslationsLoader(url: string, set: boolean = true): TranslationsLoaderCallback {
    const loader: TranslationsLoaderCallback = (locale: string) => {
      return new Promise((resolve: any, reject: any) => {
        this.http.get(url.replace(/\{\{ *locale *\}\}/g, locale))
          .subscribe(resolve, reject);
      });
    };
    if (set) {
      this.setTranslationsLoader(loader);
    }
    return loader;
  }

  /**
   * Manually provide a list of translations for a specific locale.
   *
   * @param locale
   * @param translations
   * @returns {LocalizationService}
   */
  setTranslations(locale: string, translations: Translations): void {
    this._translations[locale] = translations;
  }

  /**
   * Get the list of translations for a specific locale. Return a Promise with this list.
   * If the list is not cached it will call the `TranslationsLoaderCallback`.
   *
   * @param locale
   * @returns {any}
   */
  getTranslations(locale: string): Promise<Translations> {
    if (this._translations[locale]) {
      return Promise.resolve(this._translations[locale]);
    } else if (typeof this._translationsLoaderCallback === 'function') {
      if (this._getTranslationsPromise === null) {
        this._getTranslationsPromise = this._translationsLoaderCallback(locale);
        this._getTranslationsPromise
          .then((translation: Translations) => {
            this._getTranslationsPromise = null;
            this.setTranslations(locale, translation);
          }, () => {
            this._getTranslationsPromise = null;
          });
      }
      return this._getTranslationsPromise;
    } else {
      return Promise.reject(new Error('Translations missing'));
    }
  }


  /**
   * Manually delete a list of translations for a specific locale.
   * If `locale`is not specified, remove all translations.
   *
   * @param locale
   * @returns {LocalizationService}
   */
  deleteTranslations(locale?: string): this {
    if (locale === void 0) {
      this._translations = {};
    } else {
      delete this._translations[locale];
    }
    return this;
  }


  /**
   * Translate a string asynchronously.
   * Take same params than <translate> but return a promise.
   *
   * @param value
   * @param params
   * @param locale
   * @returns {Promise<string>}
   */
  translateAsync(value: string, params?: TranslateParams, locale: string = this._locales['translate']): Promise<string> {
    return this.getTranslations(locale)
      .then((translations: Translations) => {
        return (typeof translations[value] === 'string')
          ? this.parseTranslation(translations[value], params)
          : value;
      });
  }

  /**
   * Get many translations at once.
   *
   * @param values
   * @param locale
   * @returns {Promise<Translations>}
   */
  translateAsyncMany(values: TranslateMap, locale: string = this._locales['translate']): Promise<Translations> {
    return this.getTranslations(locale)
      .then((translations: Translations) => {
        const result: Translations = {};
        for (const value in values) {
          result[value] = (typeof translations[value] === 'string')
            ? this.parseTranslation(translations[value], values[value])
            : value;
        }
        return result;
      });
  }


  /**
   * Try to instant translate a string.
   * If it fails, returns the string.
   * You can provide params which will replace the variables into the translated string.
   *
   * @param value
   * @param params
   * @returns {string}
   */
  translate(value: string, params?: TranslateParams): string {
    const translations: Translations = this._translations[this._locales['translate']];
    return ((translations !== void 0) && (typeof translations[value] === 'string'))
      ? this.parseTranslation(translations[value], params)
      : value;
  }


  protected parseTranslation(value: string, params: TranslateParams = {}): string {
    if ((params === null) || (typeof params !== 'object')) {
      throw new Error('Invalid params type : expected { [key: string]: string }');
    }
    return value.replace(this._cachedTranslateVrariableRegExp, (match: string, variable: string) => {
      return params.hasOwnProperty(variable)
        ? String(params[variable])
        : match;
    });
  }

  // protected normalizeTranslateArguments(...args: any[]): TranslateMap {
  //   let translateMap: TranslateMap = {};
  //   switch(args.length) {
  //     case 1:
  //       const input: any = args[0];
  //       if(typeof input === 'string') {
  //         translateMap[args[0]] = {};
  //       } else if(this.isPlainObject(input)) {
  //         translateMap = input;
  //       } else if(Array.isArray(input)) {
  //         for(let i = 0; i < input.length; i++) {
  //           translateMap[String(input[i])] = {};
  //         }
  //       } else {
  //         throw new Error('Invalid translate arguments: first argument must be a string, an object, or an array');
  //       }
  //       break;
  //     case 2:
  //       if(typeof args[0] !== 'string') throw new Error('Invalid translate arguments: first argument must be a string');
  //       if(!this.isPlainObject(args[1])) throw new Error('Invalid translate arguments: second argument must be an object');
  //       translateMap[args[0]] = args[1];
  //       break;
  //     default:
  //       throw new Error('Invalid translate arguments: expect 1 or 2 arguments');
  //   }
  //   return translateMap;
  // }
  //
  // private isPlainObject(value: any): boolean {
  //   if((value === null) || (typeof value !== 'object')) return false;
  //   const proto: any = Object.getPrototypeOf(value);
  //   if(proto === null) return true;
  //   const constructor: any = proto.hasOwnProperty('constructor') && proto.constructor;
  //   return (typeof constructor === 'function') &&
  //     (constructor instanceof constructor) &&
  //     (String(proto.constructor) === String(Object));
  // }

}




