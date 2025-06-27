import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, Observable } from 'rxjs';
import { BreakpointsService } from '../../shared/services/breakpoints.service';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  pageHeight$: Observable<string> | undefined;

  constructor(public b: BreakpointsService) {
    this.pageHeight$ = this.b.queries$.pipe(
      map((queries) => `calc(100dvh - ${queries.SM ? 64 : 56}px)`),
    );
  }
}
