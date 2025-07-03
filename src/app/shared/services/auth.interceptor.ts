import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseAPICode } from '../../api/enums/base-api-code.enum';
import { BaseAPIResModel } from '../../api/models/base-api.models';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tr: TranslateService) {}

  intercept(
    req: HttpRequest<BaseAPIResModel<unknown>>,
    next: HttpHandler,
  ): Observable<HttpEvent<BaseAPIResModel<unknown>>> {
    return next.handle(req).pipe(
      switchMap((res) => {
        if (res instanceof HttpResponse) {
          if (req.url.startsWith(environment.baseApiUrl)) {
            if ((res.body as BaseAPIResModel<unknown>).code === BaseAPICode.Forbidden) {
              // TODO: refresh token on BaseAPIResModel code 403
            }

            console.log('---');
            console.log(req.url);
            console.log(res.status, res.body);

            return typeof res.body?.msg_key === 'string' && res.body.msg_key.length
              ? this.tr
                  .get(res.body.msg_key)
                  .pipe(map((msg) => res.clone({ body: { ...res.body, msg } })))
              : of(res);
          }
        }

        return of(res);
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
