import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AbstractUserService } from './abstract/abstract-user.service';
import { BaseApiService } from './base-api.service';
import { BaseAPICode } from './enums/base-api-code.enum';
import { LoginReq, LoginRes } from './models/user/login.models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService implements AbstractUserService {
  private _baseRoute = '/user';

  Login(req: LoginReq): Observable<LoginRes> {
    const apiUri = this._baseRoute + '/login';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .post<LoginReq, LoginRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
