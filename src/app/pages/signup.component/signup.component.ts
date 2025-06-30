import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../layouts/footer.component/footer.component';
import { PasswordMatchErrorStateMatcher } from '../../shared/validators/password-match.validator';
import { ValidatorsExtra } from '../../shared/validators/validators-extra';
import { SignupFCs } from './signup.models';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    RouterLink,
    FooterComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  fg = new FormGroup<SignupFCs>(
    {
      account: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.email,
        ],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^[0-9]*$/)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+$/),
        ],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      validators: [ValidatorsExtra.passwordMatch(['password', 'confirmPassword'])],
    },
  );
  fcs: SignupFCs = {
    account: this.fg.controls['account'],
    phone: this.fg.controls['phone'],
    password: this.fg.controls['password'],
    confirmPassword: this.fg.controls['confirmPassword'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  passwordMatchErrorStateMatcher = new PasswordMatchErrorStateMatcher();

  showPassword = false;

  constructor(private _router: Router) {}

  onSignup(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid) {
      return;
    }

    // TODO

    this._router.navigate(['/login']);
  }
}
