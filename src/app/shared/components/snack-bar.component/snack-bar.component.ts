import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SNACK_TYPE_ICON_MAP } from '../../enums/snack-type.enum';
import { Snack } from './snack-bar.models';

@Component({
  selector: 'app-snack-bar',
  imports: [MatIconModule, MatProgressBarModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css',
})
export class SnackBarComponent implements OnInit {
  private frameId: number | null = null;
  private startTime: number | null = null;

  fontIcon = '';
  progress = 0;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: Snack,
    private ngZone: NgZone,
  ) {
    this.fontIcon = (this.data.type && SNACK_TYPE_ICON_MAP[this.data.type]) ?? '';
  }

  ngOnInit(): void {
    this.startProgressBar();
  }

  startProgressBar(): void {
    this.progress = 0;
    this.startTime = null;

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }

    this.ngZone.runOutsideAngular(() => {
      const animate = (currentTime: DOMHighResTimeStamp) => {
        if (!this.startTime) {
          this.startTime = currentTime;
        }

        const elapsedTime = currentTime - this.startTime;
        let newProgress = (elapsedTime / this.data.duration) * 100;

        if (newProgress >= 100) {
          newProgress = 100;

          if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
          }
        }

        this.ngZone.run(() => {
          this.progress = newProgress;
        });

        if (this.progress < 100) {
          this.frameId = requestAnimationFrame(animate);
        }
      };

      this.frameId = requestAnimationFrame(animate);
    });
  }
}
