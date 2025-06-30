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
