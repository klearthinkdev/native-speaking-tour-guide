import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../../../layouts/footer.component/footer.component';

@Component({
  selector: 'app-meeting',
  imports: [FooterComponent],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingComponent {}
