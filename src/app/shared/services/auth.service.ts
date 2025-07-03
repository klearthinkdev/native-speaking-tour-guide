import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, distinctUntilChanged, map, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payload } from '../../api/models/user/jwt.models';
import { ChatSettingsService } from '../components/chat-settings.dialog/chat-settings.service';
import { tokenGetter, tokenSetter } from './token-accessors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenExpire$ = new Subject<void>();

  payload$ = new BehaviorSubject<Payload | undefined>(undefined);
  loggedIn$;

  account$ = this.payload$.pipe(
    map((payload) => payload?.sub),
    distinctUntilChanged(),
  );
  isHost$ = this.payload$.pipe(map((payload) => payload?.companyId === environment.hostCompanyId));

  loggingIn = false;

  get token() {
    return tokenGetter();
  }
  set token(value) {
    tokenSetter(value);
  }

  get payload() {
    return this.payload$.getValue();
  }
  set payload(value) {
    this.payload$.next(value);
  }
  get loggedIn() {
    return this.loggedIn$.getValue();
  }
  set loggedIn(value) {
    this.loggedIn$.next(value);
  }

  constructor(
    private _chatSettingsService: ChatSettingsService,
    private _jwtHelperService: JwtHelperService,
    private _router: Router,
  ) {
    this.loggedIn$ = new BehaviorSubject<boolean>(this.validateToken());
  }

  validateToken(): boolean {
    const token = this.token;

    if (typeof token !== 'string') {
      return false;
    }

    try {
      const payload = this._jwtHelperService.decodeToken<Payload>(token);

      if (this._jwtHelperService.isTokenExpired(token)) {
        this.tokenExpire$.next();

        return false;
      }

      this.payload = payload !== null ? payload : undefined;
    } catch (err) {
      console.error(err);

      this.token = null;

      return false;
    }

    return true;
  }

  logout(command: '/login' | '/'): void {
    this.token = null;

    this.payload = undefined;
    this.loggedIn = false;

    this._chatSettingsService.resetUser();

    this._router.navigate([command]);
  }
}
