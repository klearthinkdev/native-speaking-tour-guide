export type MenuItemList<T> = Array<MenuItem<T>>;
export type OptionList<T> = Array<Option<T>>;

type MenuItem<T> = {
  label: string;
  value: T;
  icon: string;
  isSvgIcon?: boolean;
};

type Option<T> = {
  label: string;
  value: T;
};
