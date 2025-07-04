import { environment } from '../../environments/environment';
import { ChatroomMockService } from '../api-mock/chatroom-mock.service';
import { UserMockService } from '../api-mock/user-mock.service';
import { AbstractChatroomService } from './abstract/abstract-chatroom.service';
import { AbstractUserService } from './abstract/abstract-user.service';
import { ChatroomService } from './chatroom.service';
import { UserService } from './user.service';

export const API_PROVIDERS = [
  {
    provide: AbstractChatroomService,
    useClass: environment.mock ? ChatroomMockService : ChatroomService,
  },
  {
    provide: AbstractUserService,
    useClass: environment.mock ? UserMockService : UserService,
  },
];
