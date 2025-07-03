import { OptionList } from '../models/shared.models';
import { i18nSelectMapGenerator } from '../services/utils.service';

export enum RLang {
  /*  1 */ ZH = 'zh', // 華語
  /*  2 */ EN = 'en', // 英語
  /*  3 */ JA = 'ja', // 日語
  /*  4 */ KO = 'ko', // 韓語
  /*  5 */ TH = 'th', // 泰語
  /*  6 */ VI = 'vi', // 越南語
  /*  7 */ MS = 'ms', // 馬來語
  /*  8 */ ID = 'id', // 印度尼西亞語
  /*  9 */ FR = 'fr', // 法語
  /* 10 */ ES = 'es', // 西班牙語
  /* 11 */ PT = 'pt', // 葡萄牙語
  /* 12 */ DE = 'de', // 德語
  /* 13 */ RU = 'ru', // 俄語
  /* 14 */ IT = 'it', // 義大利語
  /* 15 */ AR = 'ar', // 阿拉伯語
  /* 16 */ HI = 'hi', // 印地語
  /* 17 */ NL = 'nl', // 荷蘭語
  /* 18 */ CS = 'cs', // 捷克語
  /* 19 */ TA = 'ta', // 泰米爾語
  /* 20 */ TR = 'tr', // 土耳其語
  /* 21 */ SV = 'sv', // 瑞典語
  /* 22 */ UR = 'ur', // 烏爾都語
  // /* 23 */ MN = 'mn', // 蒙古語
  // /* 24 */ TL = 'tl', // 他加祿語
  // /* 25 */ FA = 'fa', // 波斯語
  /* 26 */ LB = 'lb', // 盧森堡語
  /* 27 */ PL = 'pl', // 波蘭語
  /* 28 */ SK = 'sk', // 斯洛伐克語
  /* 29 */ UK = 'uk', // 烏克蘭語
  // /* 30 */ MY = 'my', // 緬甸語
  // /* 31 */ KM = 'km', // 高棉語
  // /* 32 */ BN = 'bn', // 孟加拉語
  // /* 33 */ TE = 'te', // 泰盧固語
}

const RLANG_INFO_LIST = [
  /*  1 */
  { value: RLang.ZH, clabel: '華語', olabel: '中文' },
  /*  2 */
  { value: RLang.EN, clabel: '英語', olabel: 'English' },
  /*  3 */
  { value: RLang.JA, clabel: '日語', olabel: '日本語' },
  /*  4 */
  { value: RLang.KO, clabel: '韓語', olabel: '한국어' },
  /*  5 */
  { value: RLang.TH, clabel: '泰語', olabel: 'ไทย' },
  /*  6 */
  { value: RLang.VI, clabel: '越南語', olabel: 'Tiếng Việt' },
  /*  7 */
  { value: RLang.MS, clabel: '馬來語', olabel: 'بهاس ملايو' },
  /*  8 */
  { value: RLang.ID, clabel: '印度尼西亞語', olabel: 'Bahasa Indonesia' },
  /*  9 */
  { value: RLang.FR, clabel: '法語', olabel: 'français' },
  /* 10 */
  { value: RLang.ES, clabel: '西班牙語', olabel: 'Español' },
  /* 11 */
  { value: RLang.PT, clabel: '葡萄牙語', olabel: 'Português' },
  /* 12 */
  { value: RLang.DE, clabel: '德語', olabel: 'Deutsch' },
  /* 13 */
  { value: RLang.RU, clabel: '俄語', olabel: 'русский' },
  /* 14 */
  { value: RLang.IT, clabel: '義大利語', olabel: 'Italiano' },
  /* 15 */
  { value: RLang.AR, clabel: '阿拉伯語', olabel: 'العربية' },
  /* 16 */
  { value: RLang.HI, clabel: '印地語', olabel: 'हिन्दी' },
  /* 17 */
  { value: RLang.NL, clabel: '荷蘭語', olabel: 'Nederlands' },
  /* 18 */
  { value: RLang.CS, clabel: '捷克語', olabel: 'čeština' },
  /* 19 */
  { value: RLang.TA, clabel: '泰米爾語', olabel: 'தமிழ்' },
  /* 20 */
  { value: RLang.TR, clabel: '土耳其語', olabel: 'Türkçe' },
  /* 21 */
  { value: RLang.SV, clabel: '瑞典語', olabel: 'Svenska' },
  /* 22 */
  { value: RLang.UR, clabel: '烏爾都語', olabel: 'اردو' },
  /* 23 */
  // { value: RLang.MN, clabel: '蒙古語', olabel: 'Монгол хэл' },
  /* 24 */
  // { value: RLang.TL, clabel: '他加祿語', olabel: 'Wikang Tagalog' },
  /* 25 */
  // { value: RLang.FA, clabel: '波斯語', olabel: 'فارسی' },
  /* 26 */
  { value: RLang.LB, clabel: '盧森堡語', olabel: 'Lëtzebuergesch' },
  /* 27 */
  { value: RLang.PL, clabel: '波蘭語', olabel: 'Język polski' },
  /* 28 */
  { value: RLang.SK, clabel: '斯洛伐克語', olabel: 'Slovenčina' },
  /* 29 */
  { value: RLang.UK, clabel: '烏克蘭語', olabel: 'Українська' },
  /* 30 */
  // { value: RLang.MY, clabel: '緬甸語', olabel: 'ဗမာစာ' },
  /* 31 */
  // { value: RLang.KM, clabel: '高棉語', olabel: 'ភាសាខ្មែរ' },
  /* 32 */
  // { value: RLang.BN, clabel: '孟加拉語', olabel: 'বাংলা' },
  /* 33 */
  // { value: RLang.TE, clabel: '泰盧固語', olabel: 'తెలుగు' },
];

export const ALL_RLANG_OPTION_LIST: OptionList<RLang> = RLANG_INFO_LIST.map(
  ({ value, olabel }) => ({ value, label: olabel }),
);

export const ALL_RLANG_NAME_MAP = i18nSelectMapGenerator(ALL_RLANG_OPTION_LIST, 'value', 'label');

// https://r12a.github.io/app-subtags/
export const NAVIGATOR_LANGUAGE_RLANG_MAP: { [key: string]: RLang } = {
  zh: RLang.ZH,
  'zh-CN': RLang.ZH,
  'zh-TW': RLang.ZH,
  'zh-HK': RLang.ZH,
  'zh-SG': RLang.ZH,
  ja: RLang.JA,
  'ja-JP': RLang.JA,
  // TODO: navigator.language -> rlang mapping
};
