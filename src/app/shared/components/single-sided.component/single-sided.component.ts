import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { MessageDisplay } from '../../enums/message-display.enum';
import { MessageOrder } from '../../enums/message-order.enum';
import { LocaleService } from '../../services/locale.service';
import { ThemeService } from '../../services/theme.service';
import { ChatSettings } from '../chat-settings.dialog/chat-settings.models';
import { ChatSettingsService } from '../chat-settings.dialog/chat-settings.service';
import { MessageComponent } from '../message.component/message.component';
import { MessageSettings, MessageX } from '../message.component/message.models';

@Component({
  selector: 'app-single-sided',
  imports: [AsyncPipe, NgClass, MessageComponent],
  templateUrl: './single-sided.component.html',
  styleUrl: './single-sided.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSidedComponent implements AfterViewInit, OnDestroy {
  private _viewInit$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  @Input() chatLogs: Array<MessageX> = [];
  @Input() owner?: string;

  @ViewChild('box') box!: ElementRef<HTMLElement>;
  boxEl!: HTMLElement;

  locale$;
  messageSettings$: Observable<MessageSettings>;

  reverseOrder = false;

  constructor(
    private _chatSettingsService: ChatSettingsService,
    private _localeService: LocaleService,
    private _th: ThemeService,
  ) {
    this.locale$ = this._localeService.locale$;

    this.messageSettings$ = merge(
      of(this.buildMessageSettings(this._chatSettingsService.defaultSettings, this._th.isDark)),
      combineLatest([
        this._chatSettingsService.settings$,
        this._th.isDark$.pipe(distinctUntilChanged()),
      ]).pipe(map((factors) => this.buildMessageSettings(...factors))),
    ).pipe(takeUntil(this._destroy$));
  }

  ngAfterViewInit(): void {
    this._viewInit$.next();
    this._viewInit$.complete();

    this.boxEl = this.box.nativeElement;

    this.setupAutoScroll(this.boxEl);
  }

  buildMessageSettings(settings: ChatSettings, isDark: boolean): MessageSettings {
    const { display, fontSize, order, timestamp, autoScroll, tranHexColors, trxnHexColors } =
      settings;

    this.reverseOrder = order !== MessageOrder.ASC;

    return {
      align: true,
      autoScroll,
      fontSize,
      order,
      trxnHexColor: trxnHexColors[isDark ? 1 : 0],
      tranHexColor: tranHexColors[isDark ? 1 : 0],
      timestamp,
      transcription: display !== MessageDisplay.Translation,
      translation: display !== MessageDisplay.Transcription,
    };
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setupAutoScroll(...els: Array<HTMLElement>): void {
    this._chatSettingsService.order$.pipe(takeUntil(this._destroy$)).subscribe((order) => {
      setTimeout(() => {
        els.forEach((el) => (el.scrollTop = order * el.scrollHeight));
      });
    });
  }
}
