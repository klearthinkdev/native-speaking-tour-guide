import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';
import { AbstractStreamServerService } from '../api/abstract/abstract-stream-server.service';
import { BaseAPICode } from '../api/enums/base-api-code.enum';
import { DispatchReq, DispatchRes } from '../api/models/stream-server/dispatch.models';
import { BaseApiMockService } from './base-api-mock.service';
import { DEV_SERVER_LIST } from './data/stream-server.data';

@Injectable({
  providedIn: 'root',
})
export class StreamServerMockService
  extends BaseApiMockService
  implements AbstractStreamServerService
{
  // serverList = PROD_SERVER_LIST; /* FOR PROD API */
  serverList = DEV_SERVER_LIST; /* FOR DEV API */

  /* MOCK API */
  Dispatch(req: DispatchReq): Observable<DispatchRes> {
    const matchedIndex = this.serverList.findIndex((server) => server.server === req.server);
    const index =
      matchedIndex === -1 ? Math.floor(Math.random() * this.serverList.length) : matchedIndex;

    let data = this.serverList[index];

    console.log('---');
    console.log('Dispatch');
    console.log(req);
    console.log(data);

    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return timer(this.latencyMS).pipe(
      map(() => ({
        code: BaseAPICode.OK,
        msg: '',
        msg_key: 'api.success',
        data,
      })),
      switchMap((res) => super.throwNotIn(acceptedCodes, res)),
    );
  }
}
