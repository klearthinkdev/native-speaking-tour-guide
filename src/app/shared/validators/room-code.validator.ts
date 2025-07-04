import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isEmpty } from './validators-extra';

export const ROOM_CODE_REGEXP = /^\d{4}$/;

export const roomCodeValidator = (control: AbstractControl): ValidationErrors | null => {
  if (isEmpty(control.value) || ROOM_CODE_REGEXP.test(control.value)) {
    return null;
  }

  return { roomCode: true };
};
