import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';

const FORM_FIELD_DEFAULT_OPTIONS: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

export const MAT_PROVIDERS = [
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: FORM_FIELD_DEFAULT_OPTIONS,
  },
];
