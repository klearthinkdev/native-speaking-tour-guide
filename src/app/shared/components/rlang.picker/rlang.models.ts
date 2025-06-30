import { RLang } from '../../enums/r-lang.enum';

export type RLangPickerData = {
  defaultList: Array<RLang>;
  minLength?: number;
  maxLength?: number;
  multiple: boolean;
};

export type RLangPickerResult = Array<RLang> | undefined;
