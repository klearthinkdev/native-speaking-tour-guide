import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { Lang, LANG_LOCALE_MAP, NAVIGATOR_LANGUAGE_LANG_MAP } from '../enums/lang.enum';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private _localStorageKey = 'lang';
  private _defaultLang = NAVIGATOR_LANGUAGE_LANG_MAP[navigator.language] ?? Lang.EN_US;
  private _initialized = false;

  constructor(
    private _localeService: LocaleService,
    private _tr: TranslateService,
  ) {}

  init(): void {
    if (this._initialized) {
      return;
    }

    this._tr.onLangChange.pipe(distinctUntilChanged()).subscribe((e) => {
      if (this.validateLang(e.lang)) {
        this.saveLang(e.lang);

        this._localeService.locale = LANG_LOCALE_MAP[e.lang] ?? this._localeService.defaultLocale;
      }
    });

    let _lang = this.loadLang();

    if (!this.validateLang(_lang)) {
      _lang = this._defaultLang;
    }

    this._tr.setDefaultLang(_lang as string);
    this._tr.use(_lang as string);

    this._initialized = true;
  }

  private loadLang(): string | null {
    return localStorage.getItem(this._localStorageKey);
  }

  private saveLang(lang: string): void {
    localStorage.setItem(this._localStorageKey, lang);
  }

  private validateLang(lang: string | null): boolean {
    return Object.values(Lang).includes(lang as Lang);
  }
}
