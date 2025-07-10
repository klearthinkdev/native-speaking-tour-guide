import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AbstractChatroomService } from './abstract/abstract-chatroom.service';
import { BaseApiService } from './base-api.service';
import { BaseAPICode } from './enums/base-api-code.enum';
import { CreateChatroomReq, CreateChatroomRes } from './models/chatroom/create-chatroom.models';
import { EntryChatroomReq, EntryChatroomRes } from './models/chatroom/entry-chatroom.models';
import { InfoReq, InfoRes } from './models/chatroom/info.models';

@Injectable({
  providedIn: 'root',
})
export class ChatroomService extends BaseApiService implements AbstractChatroomService {
  private _baseRoute = '/chatroom';

  CreateChatroom(req: CreateChatroomReq): Observable<CreateChatroomRes> {
    const apiUri = this._baseRoute + '/createChatroom';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .post<CreateChatroomReq, CreateChatroomRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }

  EntryChatroom(req: EntryChatroomReq): Observable<EntryChatroomRes> {
    const apiUri = this._baseRoute + '/entryChatroom';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    return super
      .post<EntryChatroomReq, EntryChatroomRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }

  Info(req: InfoReq): Observable<InfoRes> {
    const apiUri = this._baseRoute + '/info';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.OK];

    const params = new HttpParams().set('roomId', req.roomId);

    return super
      .get<InfoRes>(apiUri, params)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
