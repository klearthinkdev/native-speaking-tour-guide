import { AbstractControl, ValidatorFn } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

export class ValidatorsExtra {
  static passwordMatch(paths: [string, string]): ValidatorFn {
    return passwordMatchValidator(paths);
  }
}

export const isEmpty = (value: unknown): boolean => {
  return value === '' || value === null || value === undefined;
};

export const asValid = (control: AbstractControl): boolean => {
  return control.disabled || (control.untouched && control.pristine);
};
