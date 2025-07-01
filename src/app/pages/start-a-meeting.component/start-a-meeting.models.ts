import { FormControl, FormGroup } from '@angular/forms';
import { RLang } from '../../shared/enums/r-lang.enum';

export type StartAMeetingFCs = {
  meeting: FormGroup<{
    name: FormControl<string>;
    endDatetime: FormControl<Date | null>;
  }>;
  rlangs: FormControl<Array<RLang>>;
};
