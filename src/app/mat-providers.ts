import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_CARD_CONFIG, MatCardConfig } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';

import { zhTW } from 'date-fns/locale';

const CARD_CONFIG: MatCardConfig = {
  appearance: 'outlined',
};

const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'yyyy-MM-dd',
    timeInput: 'HH:mm:ss',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'yyyy MMM',
    dateA11yLabel: 'yyyy-MM-dd',
    monthYearA11yLabel: 'yyyy MMM',
    timeInput: 'HH:mm a',
    timeOptionLabel: 'HH:mm a',
  },
};

const DIALOG_DEFAULT_OPTIONS: MatDialogConfig = {
  autoFocus: false,
  disableClose: true,
  hasBackdrop: true,
  width: '600px',
};

const FORM_FIELD_DEFAULT_OPTIONS: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

export const MAT_PROVIDERS = [
  {
    provide: MAT_CARD_CONFIG,
    useValue: CARD_CONFIG,
  },
  provideDateFnsAdapter(DATE_FORMATS),
  { provide: MAT_DATE_LOCALE, useValue: zhTW },
  {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: DIALOG_DEFAULT_OPTIONS,
  },
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: FORM_FIELD_DEFAULT_OPTIONS,
  },
];
