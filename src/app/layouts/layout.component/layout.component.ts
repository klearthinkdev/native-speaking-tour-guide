import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LangSwitch } from '../../shared/components/lang.switch/lang.switch';
import { ThemeSwitch } from '../../shared/components/theme.switch/theme.switch';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointsService } from '../../shared/services/breakpoints.service';

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
export class LayoutComponent {
  readonly loggedIn$;
  readonly isHost$;

  constructor(
    private _authService: AuthService,
    public b: BreakpointsService,
  ) {
    this.loggedIn$ = this._authService.loggedIn$;
    this.isHost$ = this._authService.isHost$;
  }

  onLogout(): void {
    this._authService.logout('/login');
  }
}
