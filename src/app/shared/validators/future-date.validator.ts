import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isAfter, isDate, isValid } from 'date-fns';
import { isEmpty } from './validators-extra';

export const futureDateValidator = (control: AbstractControl): ValidationErrors | null => {
  if (isEmpty(control.value)) {
    return null;
  }

  if (!isDate(control.value) || !isValid(control.value)) {
    return { invalidDate: true };
  }

  if (!isAfter(control.value, new Date())) {
    return { futureDate: true };
  }

  return null;
};
