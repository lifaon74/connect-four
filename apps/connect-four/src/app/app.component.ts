import { Component } from '@angular/core';
import { LocalizationService, Translations, TranslationsLoaderCallback } from '@app/ngx-localization';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    protected localizationService: LocalizationService
  ) {
    const loader: TranslationsLoaderCallback = (locale: string): Promise<Translations> => {
      return this.loadTranslations(locale)
        .catch(() => {
          const parts = locale.split(/_|-/g);
          return this.loadTranslations(parts[0]);
        })
        .catch(() => this.loadTranslations('en'));
    };

    this.localizationService.setTranslationsLoader(loader);
    this.localizationService.setLocale(this.localizationService.getNavigatorLanguage());
  }

  protected loadTranslations(locale: string): Promise<Translations> {
    return fetch(`/assets/translations/json/${ locale }.json`)
      .then<Translations>(_ => _.json());
  }
}
