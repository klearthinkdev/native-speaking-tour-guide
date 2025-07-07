import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AsyncPipe, I18nSelectPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { addHours } from 'date-fns';
import { EMPTY, finalize, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ChatroomService } from '../../api/chatroom.service';
import { BaseAPIResModel } from '../../api/models/base-api.models';
import {
  CreateChatroomReq,
  CreateChatroomRes,
} from '../../api/models/chatroom/create-chatroom.models';
import {
  RLangPickerData,
  RLangPickerResult,
} from '../../shared/components/rlang.picker/rlang.models';
import { RLangPicker } from '../../shared/components/rlang.picker/rlang.picker';
import { ALL_RLANG_NAME_MAP, RLang } from '../../shared/enums/r-lang.enum';
import { BreakpointsService } from '../../shared/services/breakpoints.service';
import { getNextHalfHour } from '../../shared/services/date-utils.service';
import { RecorderService } from '../../shared/services/recorder.service';
import { ValidatorsExtra } from '../../shared/validators/validators-extra';
import { StartAMeetingFCs } from './start-a-meeting.models';

@Component({
  selector: 'app-start-a-meeting',
  imports: [
    AsyncPipe,
    DragDropModule,
    I18nSelectPipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTimepickerModule,
    MatToolbarModule,
  ],
  templateUrl: './start-a-meeting.component.html',
  styleUrl: './start-a-meeting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartAMeetingComponent implements OnDestroy {
  // TODO: CanDeactivate 離開前提醒未儲存的變更
  _name = '我的會議'; // TODO: default name?
  _langs = [RLang.ZH, RLang.EN, RLang.JA]; // TODO: 預選 3-4 種最常用語言？

  readonly allRLangNameMap = ALL_RLANG_NAME_MAP;

  private _destroy$ = new Subject<void>();

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  fg = new FormGroup<StartAMeetingFCs>({
    meeting: new FormGroup({
      name: new FormControl(this._name, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(64)],
      }),
      endDatetime: new FormControl(addHours(getNextHalfHour(), 1), {
        validators: [Validators.required, ValidatorsExtra.futureDate],
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
  starting = false;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _chatroomService: ChatroomService,
    private _matBottomSheet: MatBottomSheet,
    private _rec: RecorderService,
    private _router: Router,
    public b: BreakpointsService,
  ) {}

  startEditing1(): void {
    this.editing1 = true;

    this.nameInput.nativeElement.select();
    this.nameInput.nativeElement.focus();
  }

  cancelEditing1(): void {
    this.meetingFG.setValue(this.cache.meeting);

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

  onStartAMeeting(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid || this.starting) {
      return;
    }
    this.starting = true;

    const req = this.buildCreateChatroomReq();

    this._chatroomService
      .CreateChatroom(req)
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.starting = false;

          this._cdr.markForCheck();
        }),
      )
      .subscribe({
        next: this.handleCreateChatroom.bind(this),
        error: this.onError.bind(this),
      });
  }

  buildCreateChatroomReq(): CreateChatroomReq {
    const { name, endDatetime } = this.meetingFV;

    return {
      room_name: name,
      end_time: (endDatetime as Date).valueOf(),
    };
  }

  handleCreateChatroom(res: CreateChatroomRes): void {
    const { rlangs } = this.fv;

    this._rec.params.candidates = rlangs;
    this._rec.save();

    this._router.navigate(['/meeting', 'room', res.data]);
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    return EMPTY;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
