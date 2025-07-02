export enum SnackType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export const SNACK_TYPE_ICON_MAP: { [key: string]: string } = {
  [SnackType.Success]: 'check_circle',
  [SnackType.Error]: 'cancel',
  [SnackType.Info]: 'error',
};
