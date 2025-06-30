import { MAT_CARD_CONFIG, MatCardConfig } from '@angular/material/card';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';

const CARD_CONFIG: MatCardConfig = {
  appearance: 'outlined',
};

const FORM_FIELD_DEFAULT_OPTIONS: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

export const MAT_PROVIDERS = [
  {
    provide: MAT_CARD_CONFIG,
    useValue: CARD_CONFIG,
  },
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: FORM_FIELD_DEFAULT_OPTIONS,
  },
];
