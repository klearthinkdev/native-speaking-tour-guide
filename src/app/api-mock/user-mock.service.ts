import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';
import { AbstractUserService } from '../api/abstract/abstract-user.service';
import { BaseAPICode } from '../api/enums/base-api-code.enum';
import { LoginReq, LoginRes } from '../api/models/user/login.models';
import { BaseApiMockService } from './base-api-mock.service';
import { TOKENS } from './data/token.data';

@Injectable({
  providedIn: 'root',
})
export class UserMockService extends BaseApiMockService implements AbstractUserService {
  /* MOCK API */
  Login(req: LoginReq): Observable<LoginRes> {
    const { ws_token, token, expiredToken } = TOKENS;

    const data = { ws_token, token };

    console.log('---');
    console.log('Login');
    console.log(req);
    console.log(data);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return timer(this.latencyMS).pipe(
      map(() => ({
        code: BaseAPICode.OK,
        msg: '',
        msg_key: 'api.login.success',
        data,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res)),
    );
  }
}
