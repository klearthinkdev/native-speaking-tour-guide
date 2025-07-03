import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth.service';
import { BreakpointsService } from './shared/services/breakpoints.service';
import { LangService } from './shared/services/lang.service';
import { SnackBarService } from './shared/services/snack-bar.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected version = environment.version;

  constructor(
    private _authService: AuthService,
    private _b: BreakpointsService,
    private _langService: LangService,
    private _snackBarService: SnackBarService,
    private _th: ThemeService,
  ) {
    this._b.init();
    this._langService.init();
    this._th.init();
  }

  ngOnInit(): void {
    this._authService.tokenExpire$.subscribe(() => {
      this._snackBarService.error({ key: 'api.expiration' });

      this._authService.logout('/login');
    });
  }
}
