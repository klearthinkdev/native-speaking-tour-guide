import { BaseAPIResModel } from '../base-api.models';

export type LoginReq = {
  /**
   * 帳號
   */
  account: string;
  /**
   * 密碼
   */
  password: string;
};

export type LoginRes = BaseAPIResModel<{
  ws_token: string;
  /**
   * 存取權杖
   */
  token: string;
}>;
