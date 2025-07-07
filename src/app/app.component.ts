import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs';
import { environment } from '../environments/environment';
import { MeetingRoomService } from './pages/meeting/meeting-room.component/meeting-room.service';
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
    private _meetingRoomService: MeetingRoomService,
    private _snackBarService: SnackBarService,
    private _th: ThemeService,
  ) {
    this._b.init();
    this._langService.init();
    this._th.init();

    this._authService.loggedIn$
      .pipe(
        distinctUntilChanged(),
        filter((loggedIn) => loggedIn === false),
      )
      .subscribe(() => {
        this._meetingRoomService.clear();
      });
  }

  ngOnInit(): void {
    this._authService.tokenExpire$.subscribe(() => {
      this._snackBarService.error({ key: 'api.expiration' });

      this._authService.logout('/login');
    });
  }
}
