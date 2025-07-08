import { MessageO } from '../../shared/components/message.component/message.models';
import { RLang } from '../../shared/enums/r-lang.enum';

export const SOURCE = (username: string): Array<MessageO> => [
  {
    message_index: 1,
    language: RLang.ZH,
    transcriptions: {
      [RLang.ZH]: '你好',
    },
    translations: {
      [RLang.EN]: '',
    },
    label: username,
  },
  {
    message_index: 1,
    language: RLang.ZH,
    transcriptions: {
      [RLang.ZH]: '你好嗎？',
    },
    translations: {
      [RLang.EN]: 'How are you?',
    },
    label: username,
  },
  {
    message_index: 1,
    language: RLang.ZH,
    transcriptions: {
      [RLang.ZH]: '你好嗎...？',
    },
    translations: {
      [RLang.EN]: 'How are you...?',
    },
    label: username,
  },
  {
    message_index: 2,
    language: RLang.EN,
    transcriptions: {
      [RLang.EN]: "I'm fine, thank you.",
    },
    translations: {
      [RLang.ZH]: '我很好，謝謝。',
    },
    label: '臺灣黑熊',
  },
  {
    message_index: 3,
    language: RLang.ZH,
    transcriptions: {
      [RLang.ZH]: '今天天氣真好。',
    },
    translations: {
      [RLang.EN]: 'The weather is great today.',
    },
    label: username,
  },
];
