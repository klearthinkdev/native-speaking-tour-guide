import { AsyncPipe, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, finalize, Observable, Subject, takeUntil } from 'rxjs';
import { AbstractChatroomService } from '../../../api/abstract/abstract-chatroom.service';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import { InfoRes } from '../../../api/models/chatroom/info.models';
import { MeetingRoomService } from '../../../pages/meeting/meeting-room.component/meeting-room.service';
import { MeetingRoomInfoDialogData } from './meeting-room-info.models';

@Component({
  selector: 'app-meeting-room-info',
  imports: [
    AsyncPipe,
    SlicePipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './meeting-room-info.dialog.html',
  styleUrl: './meeting-room-info.dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingRoomInfoDialog implements OnDestroy {
  readonly speaker$;
  readonly owner$;
  readonly users$;

  private _destroy$ = new Subject<void>();

  querying = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MeetingRoomInfoDialogData,
    private _cdr: ChangeDetectorRef,
    private _chatroomService: AbstractChatroomService,
    private _meetingRoomService: MeetingRoomService,
  ) {
    this.speaker$ = this._meetingRoomService.speaker$;
    this.owner$ = this._meetingRoomService.owner$;
    this.users$ = this._meetingRoomService.users$;

    this.onQueryMeetingInfo(this.data.roomId);
  }

  onQueryMeetingInfo(roomId: string): void {
    this.querying = true;

    this._chatroomService
      .Info({ roomId })
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.querying = false;

          this._cdr.markForCheck();
        }),
      )
      .subscribe({
        next: this.handleInfo.bind(this),
        error: this.onError.bind(this),
      });
  }

  handleInfo(res: InfoRes): void {
    this._meetingRoomService.meetingRoom = res.data;

    this._cdr.markForCheck();
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
