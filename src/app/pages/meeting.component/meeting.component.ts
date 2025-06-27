import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-meeting',
  imports: [],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingComponent {}
