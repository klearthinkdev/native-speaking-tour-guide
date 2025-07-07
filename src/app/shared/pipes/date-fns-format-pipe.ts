import { Pipe, PipeTransform } from '@angular/core';
import { format, Locale } from 'date-fns';

@Pipe({
  name: 'dateFnsFormat',
})
export class DateFnsFormatPipe implements PipeTransform {
  transform(
    value: string | number | Date | null | undefined,
    formatStr: string,
    locale?: Locale,
  ): string {
    if (value === null || value === undefined) {
      return '';
    }

    const d = value instanceof Date ? value : new Date(value);

    return format(d, formatStr, { locale });
  }
}
