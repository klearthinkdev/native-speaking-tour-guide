import { FormControl } from '@angular/forms';
import { RLang } from '../../shared/enums/r-lang.enum';

export type UserFCs = {
  nickname: FormControl<string>;
  code: FormControl<string>;
  rlangs: FormControl<Array<RLang>>;
};
