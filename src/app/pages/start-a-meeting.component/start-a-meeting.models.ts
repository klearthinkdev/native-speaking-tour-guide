import { FormControl, FormGroup } from '@angular/forms';
import { RLang } from '../../shared/enums/r-lang.enum';

export type StartAMeetingFCs = {
  meeting: FormGroup<{
    name: FormControl<string>;
  }>;
  rlangs: FormControl<Array<RLang>>;
};
