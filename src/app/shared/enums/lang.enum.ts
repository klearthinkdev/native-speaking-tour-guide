import { enUS, ja, Locale, zhTW } from 'date-fns/locale';
import { OptionList } from '../models/shared.models';

export enum Lang {
  EN_US = 'en-US',
  ZH_TW = 'zh-TW',
  JA = 'ja',
}

export const LANG_OBJ = {
  EN_US: Lang.EN_US,
  ZH_TW: Lang.ZH_TW,
  JA: Lang.JA,
};

export const LANG_LOCALE_MAP: { [key: string]: Locale } = {
  [Lang.EN_US]: enUS,
  [Lang.ZH_TW]: zhTW,
  [Lang.JA]: ja,
};

// https://r12a.github.io/app-subtags/
export const NAVIGATOR_LANGUAGE_LANG_MAP: { [key: string]: Lang } = {
  zh: Lang.ZH_TW,
  'zh-CN': Lang.ZH_TW,
  'zh-TW': Lang.ZH_TW,
  'zh-HK': Lang.ZH_TW,
  'zh-SG': Lang.ZH_TW,
  ja: Lang.JA,
  'ja-JP': Lang.JA,
};

export const LANG_OPTION_LIST: OptionList<Lang> = [
  { value: Lang.EN_US, label: 'English' },
  { value: Lang.ZH_TW, label: '繁體中文' },
  { value: Lang.JA, label: '日本語' },
];
