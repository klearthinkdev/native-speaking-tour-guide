import { Injectable } from '@angular/core';
import { map, Observable, switchMap, timer } from 'rxjs';
import { AbstractChatroomService } from '../api/abstract/abstract-chatroom.service';
import { BaseAPICode } from '../api/enums/base-api-code.enum';
import {
  CreateChatroomReq,
  CreateChatroomRes,
} from '../api/models/chatroom/create-chatroom.models';
import { EntryChatroomReq, EntryChatroomRes } from '../api/models/chatroom/entry-chatroom.models';
import { BaseApiMockService } from './base-api-mock.service';

@Injectable({
  providedIn: 'root',
})
export class ChatroomMockService extends BaseApiMockService implements AbstractChatroomService {
  /* MOCK API */
  CreateChatroom(req: CreateChatroomReq): Observable<CreateChatroomRes> {
    const data = 'chatroom-code';

    console.log('---');
    console.log('CreateChatroom');
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

  /* MOCK API */
  EntryChatroom(req: EntryChatroomReq): Observable<EntryChatroomRes> {
    const data = 'chatroom-token';

    console.log('---');
    console.log('EntryChatroom');
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
