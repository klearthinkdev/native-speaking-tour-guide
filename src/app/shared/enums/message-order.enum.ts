import { OptionList } from '../models/shared.models';

export enum MessageOrder {
  ASC = 10,
  DESC = -10,
}

export const MESSAGE_ORDER_OPTION_LIST: OptionList<MessageOrder> = [
  {
    label: 'ENUM.SHARED.MESSAGE_ORDER.ASC',
    value: MessageOrder.ASC,
  },
  {
    label: 'ENUM.SHARED.MESSAGE_ORDER.DESC',
    value: MessageOrder.DESC,
  },
];
