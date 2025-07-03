import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AbstractStreamServerService } from './abstract/abstract-stream-server.service';
import { BaseApiService } from './base-api.service';
import { BaseAPICode } from './enums/base-api-code.enum';
import { DispatchReq, DispatchRes } from './models/stream-server/dispatch.models';

@Injectable({
  providedIn: 'root',
})
export class StreamServerService extends BaseApiService implements AbstractStreamServerService {
  private _baseRoute = '/stream_server';

  Dispatch(req: DispatchReq): Observable<DispatchRes> {
    const apiUri = this._baseRoute + '/dispatch';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    const params = new HttpParams().set('type', req.type).set('server', req.server ?? '');

    return super
      .get<DispatchRes>(apiUri, params)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
