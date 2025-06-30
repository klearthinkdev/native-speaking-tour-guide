import { AsyncPipe, I18nSelectPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ALL_RLANG_NAME_MAP, RLang } from '../../enums/r-lang.enum';
import { BreakpointsService } from '../../services/breakpoints.service';
import { RLangPickerData } from './rlang.models';

@Component({
  selector: 'app-rlang.picker',
  imports: [
    AsyncPipe,
    I18nSelectPipe,
    ReactiveFormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
  ],
  templateUrl: './rlang.picker.html',
  styleUrl: './rlang.picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RLangPicker {
  readonly allRLangNameMap = ALL_RLANG_NAME_MAP;

  @ViewChild('selectionList') selectionList!: MatSelectionList;

  listHeight$: Observable<string> | undefined;
  itemList$ = new BehaviorSubject<Array<RLang>>([]);

  get itemList(): Array<RLang> {
    return this.itemList$.getValue();
  }
  set itemList(value: Array<RLang>) {
    this.itemList$.next(value);
  }

  pickedFC = new FormControl<Array<RLang>>([], {
    nonNullable: true,
  });

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: RLangPickerData,
    private _bottomSheetRef: MatBottomSheetRef<RLangPicker>,
    private _b: BreakpointsService,
  ) {
    this.listHeight$ = this._b.queries$.pipe(
      map((queries) => `calc(100% - ${queries.SM ? 64 : 56}px)`),
    );

    const { minLength, maxLength } = this.data;

    if (minLength !== undefined && minLength > 0) {
      this.pickedFC.addValidators([Validators.required, Validators.minLength(minLength)]);
    }
    if (maxLength !== undefined && maxLength > 0) {
      this.pickedFC.addValidators([Validators.maxLength(maxLength)]);
    }

    this.onFetchItemList();
  }

  onFetchItemList(): void {
    this.itemList = Object.values(RLang);

    const defaultPicked = this.data.defaultList.filter((item) => this.itemList.includes(item));

    this.pickedFC.setValue(this.data.multiple ? defaultPicked : defaultPicked.slice(0, 1));
  }

  compareWith(item: RLang, selected: RLang): boolean {
    return item === selected;
  }

  onPick(): void {
    if (this.pickedFC.invalid) {
      return;
    }

    this._bottomSheetRef.dismiss(
      this.selectionList.selectedOptions.selected.map((option) => option.value),
    );
  }

  onClose(): void {
    this._bottomSheetRef.dismiss();
  }
}
