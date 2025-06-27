import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaQuery } from '../enums/media-query.enum';

type Queries = {
  SM: boolean;
  MD: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class BreakpointsService {
  private _initialized = false;

  queries$ = new BehaviorSubject<Queries>({
    SM: false,
    MD: false,
  });

  get queries() {
    return this.queries$.getValue();
  }
  set queries(value: Queries) {
    this.queries$.next(value);
  }

  constructor(private breakpointObserver: BreakpointObserver) {}

  init(): void {
    if (this._initialized) {
      return;
    }

    this.breakpointObserver.observe([MediaQuery.SM, MediaQuery.MD]).subscribe((result) => {
      this.queries = {
        SM: result.breakpoints[MediaQuery.SM],
        MD: result.breakpoints[MediaQuery.MD],
      };
    });

    this._initialized = true;
  }
}
