import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-waiting-area',
  imports: [MatButtonModule],
  templateUrl: './waiting-area.component.html',
  styleUrl: './waiting-area.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingAreaComponent {
  @Input() disabled: boolean = false;
  @Output() ready = new EventEmitter<void>();

  onReady(): void {
    this.ready.next();
  }
}
