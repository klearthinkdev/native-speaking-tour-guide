import { ServerType } from '../../enums/stream-server/server-type.enum';
import { BaseAPIResModel } from '../base-api.models';

export type DispatchReq = {
  type: ServerType;
  server: string | null;
};

export type DispatchRes = BaseAPIResModel<{ url: string; server: string }>;
