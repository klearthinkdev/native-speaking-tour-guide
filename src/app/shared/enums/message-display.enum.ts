import { OptionList } from '../models/shared.models';

export enum MessageDisplay {
  Transcription = 1,
  Translation = 2,
  Both = 3,
}

export const MESSAGE_DISPLAY_OBJ = {
  Transcription: MessageDisplay.Transcription,
  Translation: MessageDisplay.Translation,
  Both: MessageDisplay.Both,
};

export const MESSAGE_DISPLAY_OPTION_LIST: OptionList<MessageDisplay> = [
  {
    label: 'ENUM.SHARED.MESSAGE_DISPLAY.TRANSCRIPTION',
    value: MessageDisplay.Transcription,
  },
  {
    label: 'ENUM.SHARED.MESSAGE_DISPLAY.TRANSLATION',
    value: MessageDisplay.Translation,
  },
  {
    label: 'ENUM.SHARED.MESSAGE_DISPLAY.BOTH',
    value: MessageDisplay.Both,
  },
];
