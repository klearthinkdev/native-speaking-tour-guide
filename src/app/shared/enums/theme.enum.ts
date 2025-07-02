import { MenuItemList } from '../models/shared.models';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export const THEME_MENU_ITEM_LIST: MenuItemList<Theme> = [
  {
    label: 'ENUM.SHARED.THEME.LIGHT',
    value: Theme.Light,
    icon: 'light_mode',
  },
  {
    label: 'ENUM.SHARED.THEME.DARK',
    value: Theme.Dark,
    icon: 'dark_mode',
  },
  {
    label: 'ENUM.SHARED.THEME.SYSTEM',
    value: Theme.System,
    icon: 'settings',
  },
];
