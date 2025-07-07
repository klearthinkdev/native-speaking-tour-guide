import { MessageOrder } from '../../enums/message-order.enum';
import { MessagePosition } from '../../enums/message-position.enum';

export type MessageO = {
  message_index: number;
  language: string;
  transcriptions: { [key: string]: string };
  translations: { [key: string]: string };
  label?: string;
};

export type MessageX = {
  mid: string;
  language: string;
  position: MessagePosition;
  trxnList: Array<Trxn>;
  tranList: Array<Tran>;
  unixTime: number;
  user?: string;
};

type Trxn = { lang: string; text: string };
type Tran = { lang: string; text: string };

export interface MessageXExtension extends MessageX {
  trxnList: Array<TrxnExtension>;
  tranList: Array<TranExtension>;
}

type TrxnExtension = Trxn & { hexColor: string; hidden?: boolean };
type TranExtension = Tran & { hexColor: string; hidden?: boolean };

export type MessageTTS = {
  duration: number;
  file_path: string;
  language: string;
  message_index: number;
  type: 'tts';
};

export const isMessageTTS = (
  message: MessageO | Array<MessageO> | MessageTTS,
): message is MessageTTS => {
  return 'type' in message && message.type === 'tts';
};

export type MessageSettings = {
  align: boolean;
  autoScroll: boolean;
  fontSize: number;
  order: MessageOrder;
  trxnHexColor: string;
  tranHexColor: string;
  timestamp: boolean;
  transcription: boolean;
  translation: boolean;
};
