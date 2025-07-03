import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseAPICode } from '../api/enums/base-api-code.enum';
import { BaseAPIResModel } from '../api/models/base-api.models';

@Injectable({
  providedIn: 'root',
})
export class BaseApiMockService {
  protected baseApiUrl = environment.baseApiUrl;

  protected latencyMS = 300;

  constructor(protected http: HttpClient) {}

  protected get<TRes>(uri: string, params?: HttpParams): Observable<TRes> {
    const url = this.baseApiUrl + uri;
    const options = {
      params,
    };

    return this.http.request<TRes>('get', url, options);
  }

  protected post<TReq, TRes>(apiUri: string, body: TReq, params?: HttpParams): Observable<TRes> {
    const url = this.baseApiUrl + apiUri;
    const options = {
      body,
      params,
    };

    return this.http.request<TRes>('post', url, options);
  }

  protected throwNotIn<T>(codes: Array<BaseAPICode>, res: BaseAPIResModel<T>) {
    const { code } = res;

    if (!codes.includes(code)) {
      return throwError(() => res);
    }

    return of(res);
  }
}
