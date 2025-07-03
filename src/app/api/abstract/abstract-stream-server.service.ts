import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DispatchReq, DispatchRes } from '../models/stream-server/dispatch.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractStreamServerService {
  abstract Dispatch(req: DispatchReq): Observable<DispatchRes>;
}
