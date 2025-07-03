import { environment } from '../../environments/environment';
import { UserMockService } from '../api-mock/user-mock.service';
import { AbstractUserService } from './abstract/abstract-user.service';
import { UserService } from './user.service';

export const API_PROVIDERS = [
  {
    provide: AbstractUserService,
    useClass: environment.mock ? UserMockService : UserService,
  },
];
