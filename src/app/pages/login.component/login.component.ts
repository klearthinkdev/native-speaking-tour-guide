import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, finalize, Observable, Subject, takeUntil } from 'rxjs';
import { AbstractUserService } from '../../api/abstract/abstract-user.service';
import { BaseAPIResModel } from '../../api/models/base-api.models';
import { LoginReq, LoginRes } from '../../api/models/user/login.models';
import { FooterComponent } from '../../layouts/footer.component/footer.component';
import { AuthService } from '../../shared/services/auth.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { LoginFCs } from './login.models';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    RouterLink,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  private _destroy$ = new Subject<void>();

  fg = new FormGroup<LoginFCs>({
    account: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(64)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  fcs: LoginFCs = {
    account: this.fg.controls['account'],
    password: this.fg.controls['password'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  showPassword = false;
  loggingIn = false;

  constructor(
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _snackBarService: SnackBarService,
    private _userService: AbstractUserService,
  ) {}

  onLogin(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid || this.loggingIn) {
      return;
    }

    const { account, password } = this.fv;
    const req: LoginReq = {
      account,
      password,
    };

    this._userService
      .Login(req)
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.loggingIn = false;

          this._cdr.markForCheck();
        }),
      )
      .subscribe({
        next: this.handleLogin.bind(this),
        error: this.onError.bind(this),
      });
  }

  handleLogin(res: LoginRes): void {
    const { token } = res.data;

    this._authService.token = token;

    if (this._authService.validateToken()) {
      this._authService.loggedIn = true;

      this._snackBarService.success(res.msg);

      this._router.navigate(['/']);
    }
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    this._snackBarService.error(err.msg);

    this.fcs['password'].reset();

    return EMPTY;
  }

  onSkipLogin(): void {
    // TODO

    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
