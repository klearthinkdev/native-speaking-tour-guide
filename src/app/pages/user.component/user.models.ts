import { FormControl, FormGroup } from '@angular/forms';
import { RLang } from '../../shared/enums/r-lang.enum';

export type UserFCs = {
  aboutMe: FormGroup<{
    nickname: FormControl<string>;
    userCode: FormControl<string>;
  }>;
  rlangs: FormControl<Array<RLang>>;
};
