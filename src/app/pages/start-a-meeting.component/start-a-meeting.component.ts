import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { I18nSelectPipe } from '@angular/common';
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import {
  RLangPickerData,
  RLangPickerResult,
} from '../../shared/components/rlang.picker/rlang.models';
import { RLangPicker } from '../../shared/components/rlang.picker/rlang.picker';
import { ALL_RLANG_NAME_MAP, RLang } from '../../shared/enums/r-lang.enum';
import { StartAMeetingFCs } from './start-a-meeting.models';

@Component({
  selector: 'app-start-a-meeting.component',
  imports: [
    DragDropModule,
    I18nSelectPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    RouterLink,
  ],
  templateUrl: './start-a-meeting.component.html',
  styleUrl: './start-a-meeting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartAMeetingComponent implements OnDestroy {
  // TODO: default name  ?
  _name = '我的會議';
  _langs = [RLang.ZH];

  readonly allRLangNameMap = ALL_RLANG_NAME_MAP;

  private _destroy$ = new Subject<void>();

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  fg = new FormGroup<StartAMeetingFCs>({
    meeting: new FormGroup({
      name: new FormControl(this._name, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(64)],
      }),
      endDatetime: new FormControl(this.now, {
        validators: [Validators.required],
      }),
    }),
    rlangs: new FormControl(this._langs, { nonNullable: true }),
  });
  fcs: StartAMeetingFCs = {
    meeting: this.fg.controls['meeting'],
    rlangs: this.fg.controls['rlangs'],
  };
  get fv() {
    return this.fg.getRawValue();
  }
  meetingFG = this.fcs.meeting;
  meetingFCs = {
    name: this.meetingFG.controls['name'],
    endDatetime: this.meetingFG.controls['endDatetime'],
  };
  get meetingFV() {
    return this.meetingFG.getRawValue();
  }
  get now(): Date {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();

    return new Date(year, month, date);
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

    this.nameInput.nativeElement.select();
    this.nameInput.nativeElement.focus();
  }

  cancelEditing1(): void {
    this.meetingFCs['name'].setValue(this.cache.meeting.name);

    this.editing1 = false;
  }

  onUpdate1(): void {
    this.meetingFG.markAllAsTouched();
    this.meetingFG.updateValueAndValidity();

    if (this.meetingFG.invalid) {
      return;
    }

    this.cache.meeting = { ...this.meetingFV };

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
