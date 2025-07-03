import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, EMPTY, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseAPICode } from '../../api/enums/base-api-code.enum';
import { BaseAPIResModel } from '../../api/models/base-api.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _tr: TranslateService,
  ) {}

  intercept(
    req: HttpRequest<BaseAPIResModel<unknown>>,
    next: HttpHandler,
  ): Observable<HttpEvent<BaseAPIResModel<unknown>>> {
    return next.handle(req).pipe(
      switchMap((res) => {
        if (res instanceof HttpResponse) {
          if (req.url.startsWith(environment.baseApiUrl)) {
            if ((res.body as BaseAPIResModel<unknown>).code === BaseAPICode.Forbidden) {
              this._authService.tokenExpire$.next();

              // TODO: refresh token on BaseAPIResModel code 403
            }

            console.log('---');
            console.log(req.url);
            console.log(res.status, res.body);

            return typeof res.body?.msg_key === 'string' && res.body.msg_key.length
              ? this._tr
                  .get(res.body.msg_key)
                  .pipe(map((msg) => res.clone({ body: { ...res.body, msg } })))
              : of(res);
          }
        }

        return of(res);
      }),
      catchError((err) => {
        console.error(err);

        let code = BaseAPICode.InternalServerError;
        let msg_key = 'api.error';

        if (err instanceof HttpErrorResponse && err.status === 403) {
          code = BaseAPICode.Forbidden;
          msg_key = 'api.expiration';

          this._authService.tokenExpire$.next();

          return EMPTY;
        }

        return this._tr
          .get(msg_key)
          .pipe(switchMap((msg) => throwError(() => ({ code, msg, msg_key, data: null }))));
      }),
      // TODO: handel code 403 in BaseAPIResModel
      // switchMap((res) => {
      //   if (req.url.startsWith('/admin')) {
      //     if (res instanceof HttpErrorResponse) {
      //       let code = BaseAPICode.InternalServerError;
      //       let msg_key = 'api.error';

      //       // TODO: 403
      //       if (res.status === 400) {
      //         code = BaseAPICode.Forbidden;
      //         msg_key = 'api.expiration';
      //       }
      //     }

      //     if (res instanceof HttpResponse) {
      //       return this.tr
      //         .get(res.body.msg_key as string)
      //         .pipe(map((msg) => res.clone({ body: { ...res.body, msg } })));
      //     }
      //   }

      //   return of(res);
      // })
    );
  }
}
