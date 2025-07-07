export const i18nSelectMapGenerator = <T>(
  list: Array<T>,
  valueKey: keyof T,
  labelKey: keyof T,
): {
  [key: string]: string;
} => {
  return list.reduce<{ [key: string]: string }>((map, item) => {
    const value = item[valueKey] as unknown as boolean | number | string;
    const label = item[labelKey] as unknown as string;

    map[`${value}`] = label;

    return map;
  }, {});
};

export const genCode = (n: number = 5, source: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'): string => {
  const maxRepeats = Math.ceil(n / source.length);
  const charCount: { [key: string]: number } = {};

  let code = '';

  while (code.length < n) {
    const randomChar = source[Math.floor(Math.random() * source.length)];

    if (!charCount[randomChar]) {
      charCount[randomChar] = 0;
    }

    if (charCount[randomChar] < maxRepeats) {
      code += randomChar;

      charCount[randomChar]++;
    }
  }

  return code;
};

export const genNickname = (): string => {
  // TODO: 臺灣特有種英文名列表
  // https://www.wikiwand.com/zh-tw/articles/%E8%87%BA%E7%81%A3%E7%89%B9%E6%9C%89%E5%8B%95%E7%89%A9%E5%88%97%E8%A1%A8#%E8%84%8A%E7%B4%A2%E5%8B%95%E7%89%A9
  const source = [
    '臺灣長鬃山羊',
    '臺灣梅花鹿',
    '臺灣水鹿',
    '山羌',
    '臺灣野豬',
    '白面鼯鼠',
    '臺灣穿山甲',
    '臺灣獼猴',
    '臺灣雲豹',
    '白鼻心',
    '麝香貓',
    '臺灣黑熊',
  ];
  const randomNickname = source[Math.floor(Math.random() * source.length)];
  // const source = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // const randomNickname = `endemic species of Taiwan ${source[Math.floor(Math.random() * source.length)]}`;

  return randomNickname;
};

export const scrollIntoView = (el: HTMLElement, options?: ScrollIntoViewOptions): void => {
  el.scrollIntoView(options);
};
