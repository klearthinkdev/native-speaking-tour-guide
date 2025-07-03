import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateChatroomReq, CreateChatroomRes } from '../models/chatroom/create-chatroom.models';
import { EntryChatroomReq, EntryChatroomRes } from '../models/chatroom/entry-chatroom.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractChatroomService {
  abstract CreateChatroom(req: CreateChatroomReq): Observable<CreateChatroomRes>;

  abstract EntryChatroom(req: EntryChatroomReq): Observable<EntryChatroomRes>;
}
