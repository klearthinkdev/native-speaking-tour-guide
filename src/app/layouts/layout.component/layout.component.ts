import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { ConfirmDialogData } from '../../shared/components/confirm.dialog/confirm.models';
import { LangSwitch } from '../../shared/components/lang.switch/lang.switch';
import { ThemeSwitch } from '../../shared/components/theme.switch/theme.switch';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointsService } from '../../shared/services/breakpoints.service';
import { ConfirmService } from '../../shared/services/confirm.service';

@Component({
  selector: 'app-layout',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslateModule,
    LangSwitch,
    ThemeSwitch,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnDestroy {
  readonly loggedIn$;
  readonly isHost$;

  private _destroy$ = new Subject<void>();

  constructor(
    private _authService: AuthService,
    private _confirmService: ConfirmService,
    public b: BreakpointsService,
  ) {
    this.loggedIn$ = this._authService.loggedIn$;
    this.isHost$ = this._authService.isHost$;
  }

  onLogout(): void {
    this._confirmService
      .confirm(
        new ConfirmDialogData({
          title: '確認登出？',
          confirmButtonText: '登出',
          confirmButtonClass: 'bg-red-500 text-white',
        }),
      )
      .pipe(
        takeUntil(this._destroy$),
        filter((res) => res === true),
      )
      .subscribe(() => this._authService.logout('/login'));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
