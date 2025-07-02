import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { Theme } from './shared/enums/theme.enum';
import { BreakpointsService } from './shared/services/breakpoints.service';
import { LangService } from './shared/services/lang.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected version = environment.version;

  constructor(
    private _b: BreakpointsService,
    private _langService: LangService,
    private _th: ThemeService,
  ) {
    this._b.init();
    this._langService.init();
    this._th.init();
  }

  useNextTheme(): void {
    const all = [Theme.Light, Theme.Dark, Theme.System];
    const currentIndex = all.indexOf(this._th.currentTheme);
    const next = all[(currentIndex + 1) % all.length];

    this._th.use(next);
  }
}
