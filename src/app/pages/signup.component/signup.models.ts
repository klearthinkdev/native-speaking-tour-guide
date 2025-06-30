import { FormControl } from '@angular/forms';

export type SignupFCs = {
  account: FormControl<string>;
  phone: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};
