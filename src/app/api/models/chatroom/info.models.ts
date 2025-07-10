import { BaseAPIResModel } from '../base-api.models';

export type InfoReq = {
  roomId: string;
};

export type InfoRes = BaseAPIResModel<MeetingRoom>;

export type MeetingRoom = {
  create_time: number;
  end_time: number;
  has_pwd: 0 | 1;
  id: string;
  owner: string;
  reserve_id: string | null;
  room_code: string;
  room_id: string;
  room_name: string;
  room_pwd: string;
  status: 0 | 1;
  users: Array<User>;
};

export type User = {
  account: string;
  join_time: number;
};
