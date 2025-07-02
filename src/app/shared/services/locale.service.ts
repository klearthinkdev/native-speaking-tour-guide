import { Injectable } from '@angular/core';
import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  readonly defaultLocale = enUS;

  locale$ = new BehaviorSubject<Locale>(this.defaultLocale);

  get locale(): Locale {
    return this.locale$.getValue();
  }
  set locale(value: Locale) {
    this.locale$.next(value);
  }
}
