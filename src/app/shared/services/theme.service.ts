import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Subject } from 'rxjs';
import { Theme } from '../enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _localStorageKey = 'theme';
  private _defaultTheme = Theme.System;
  private _initialized = false;

  themeChange$ = new Subject<Theme>();
  isDark$ = new BehaviorSubject<boolean>(false);

  currentTheme!: Theme;

  get isDark() {
    return this.isDark$.getValue();
  }
  set isDark(value) {
    this.isDark$.next(value);
  }

  constructor(
    @Inject(DOCUMENT)
    private _document: Document & { startViewTransition: Function },
  ) {}

  init(): void {
    if (this._initialized) {
      return;
    }

    this.themeChange$.pipe(distinctUntilChanged()).subscribe((theme) => {
      if (this.validateTheme(theme)) {
        this.onToggleClass(theme);

        this.saveTheme(theme);

        this.currentTheme = theme;
      }
    });

    const _theme = this.loadTheme();
    const defaultTheme = this.validateTheme(_theme) ? (_theme as Theme) : this._defaultTheme;

    this.use(defaultTheme);

    this._initialized = true;
  }

  use(theme: Theme): void {
    this.themeChange$.next(theme);
  }

  private loadTheme(): string | null {
    return localStorage.getItem(this._localStorageKey);
  }

  private saveTheme(theme: string): void {
    localStorage.setItem(this._localStorageKey, theme);
  }

  private onToggleClass(theme: Theme) {
    const isDark =
      theme === Theme.Dark ||
      (theme === Theme.System &&
        this._document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches);

    if (this._document.startViewTransition === undefined) {
      this.toggleClass(isDark);
    } else {
      this._document.startViewTransition(() => {
        this.toggleClass(isDark);
      });
    }

    this.isDark$.next(isDark === true);
  }

  private toggleClass(isDark?: boolean) {
    this._document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  }

  private validateTheme(theme: string | null): boolean {
    return Object.values(Theme).includes(theme as Theme);
  }
}
