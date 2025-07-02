import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { I18nSelectPipe, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import {
  RLangPickerData,
  RLangPickerResult,
} from '../../shared/components/rlang.picker/rlang.models';
import { RLangPicker } from '../../shared/components/rlang.picker/rlang.picker';
import { ALL_RLANG_NAME_MAP, RLang } from '../../shared/enums/r-lang.enum';
import { UserFCs } from './user.models';

@Component({
  selector: 'app-user',
  imports: [
    DragDropModule,
    I18nSelectPipe,
    SlicePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnDestroy {
  // TODO: CanDeactivate 離開前提醒未儲存的變更
  // TODO: default nickname from AuthService ?
  _code = 'ABCDE';
  _user = 'ubestream999@ubestream.com';
  _langs = [RLang.ZH, RLang.EN, RLang.JA];

  readonly allRLangNameMap = ALL_RLANG_NAME_MAP;

  private _destroy$ = new Subject<void>();

  @ViewChild('nicknameInput') nicknameInput!: ElementRef<HTMLInputElement>;

  fg = new FormGroup<UserFCs>({
    aboutMe: new FormGroup({
      // TODO: 以台灣特有種的英文名稱作為預設暱稱
      nickname: new FormControl(this._user, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(64)],
      }),
      code: new FormControl(this._code, { nonNullable: true }),
    }),
    rlangs: new FormControl(this._langs, { nonNullable: true }),
  });
  fcs: UserFCs = {
    aboutMe: this.fg.controls['aboutMe'],
    rlangs: this.fg.controls['rlangs'],
  };
  get fv() {
    return this.fg.getRawValue();
  }
  aboutMeFG = this.fg.controls['aboutMe'];
  aboutMeFCs = {
    nickname: this.aboutMeFG.controls['nickname'],
    code: this.aboutMeFG.controls['code'],
  };
  get aboutMeFV() {
    return this.aboutMeFG.getRawValue();
  }

  cache = structuredClone(this.fv);
  editing1 = false;
  editing2 = false;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _matBottomSheet: MatBottomSheet,
  ) {}

  startEditing1(): void {
    this.editing1 = true;

    this.nicknameInput.nativeElement.select();
    this.nicknameInput.nativeElement.focus();
  }

  cancelEditing1(): void {
    this.aboutMeFCs['nickname'].setValue(this.cache.aboutMe.nickname);

    this.editing1 = false;
  }

  onUpdate1(): void {
    this.aboutMeFG.markAllAsTouched();
    this.aboutMeFG.updateValueAndValidity();

    if (this.aboutMeFG.invalid) {
      return;
    }

    this.cache.aboutMe = { ...this.aboutMeFV };

    this.editing1 = false;
  }

  startEditing2(): void {
    this.editing2 = true;
  }

  cancelEditing2(): void {
    this.fcs['rlangs'].setValue(this.cache.rlangs);

    this.editing2 = false;
  }

  onUpdate2(): void {
    this.fcs['rlangs'].markAllAsTouched();
    this.fcs['rlangs'].updateValueAndValidity();

    if (this.fcs['rlangs'].invalid) {
      return;
    }

    this.cache.rlangs = [...this.fv.rlangs];

    this.editing2 = false;
  }

  openRLangPicker(): void {
    const { rlangs } = this.fv;

    const data: RLangPickerData = {
      defaultList: rlangs,
      minLength: 1,
      multiple: true,
    };

    this._matBottomSheet
      .open<RLangPicker, RLangPickerData, RLangPickerResult>(RLangPicker, {
        autoFocus: false,
        data,
      })
      .afterDismissed()
      .pipe(
        takeUntil(this._destroy$),
        tap((result) => {
          if (result?.length) {
            this.fcs['rlangs'].setValue(result);

            this._cdr.markForCheck();
          }
        }),
      )
      .subscribe();
  }

  remove(index: number): void {
    const rlangs = [...this.fv.rlangs].filter((rlang, i) => i !== index);

    this.fcs['rlangs'].setValue(rlangs);
  }

  drop(event: CdkDragDrop<Array<RLang>>): void {
    const rlangs = [...this.fv.rlangs];

    moveItemInArray(rlangs, event.previousIndex, event.currentIndex);

    this.fcs['rlangs'].setValue(rlangs);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
