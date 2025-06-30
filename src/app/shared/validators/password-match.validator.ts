import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { asValid, isEmpty } from './validators-extra';

export const passwordMatchValidator = (paths: [string, string]): ValidatorFn => {
  return (control): ValidationErrors | null => {
    const fcA = control.get(paths[0]) as AbstractControl<string>;
    const fcB = control.get(paths[1]) as AbstractControl<string>;

    const a = fcA.value;
    const b = fcB.value;

    if (asValid(fcA) || asValid(fcB) || isEmpty(a) || isEmpty(b)) {
      return null;
    }

    if (!isEmpty(a) && !isEmpty(b) && a === b) {
      return null;
    }

    return { passwordMatch: true };
  };
};

export class PasswordMatchErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return !asValid(control) && (control.invalid || form.hasError('passwordMatch'));
  }
}
