export type OptionList<T> = Array<Option<T>>;

type Option<T> = {
  label: string;
  value: T;
};
