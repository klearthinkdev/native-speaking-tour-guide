import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginReq, LoginRes } from '../models/user/login.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractUserService {
  abstract Login(req: LoginReq): Observable<LoginRes>;
}
