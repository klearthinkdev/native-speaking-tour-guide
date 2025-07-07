import { NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Locale } from 'date-fns';
import { ScrollXIntoViewDirective } from '../../directives/scroll-x-into-view.directive';
import { MESSAGE_POSITION_OBJ } from '../../enums/message-position.enum';
import { DateFnsFormatPipe } from '../../pipes/date-fns-format-pipe';
import { MessageSettings, MessageX, MessageXExtension } from './message.models';

@Component({
  selector: 'app-message',
  imports: [NgClass, NgStyle, ScrollXIntoViewDirective, DateFnsFormatPipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit, OnChanges {
  @Input() locale!: Locale;
  @Input() x!: MessageX;
  @Input() settings!: MessageSettings;
  @Input() opposite = false;
  @Input() hasTwoSides = false;
  @Input() last?: boolean;

  xExtension!: MessageXExtension;

  positionRight = true;
  flexRowReverse = false;

  // animate = true;
  showTranslating = false;

  constructor(private _cdr: ChangeDetectorRef) {}

  transcriptZHFlag = false;
  translationZHFlag = false;

  transcriptChtText = '';
  transcriptChsText = '';
  translationChtText = '';
  translationChsText = '';

  ngOnInit(): void {
    this.positionRight = this.x.position === MESSAGE_POSITION_OBJ.Right;

    this.flexRowReverse = this.opposite ? !this.positionRight : this.positionRight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const [xChanges, settingsChanges] = [changes['x'], changes['settings']];

    if (xChanges || settingsChanges) {
      const currentX = (xChanges?.currentValue as MessageX | undefined) ?? this.x;
      const { trxnHexColor, tranHexColor, transcription } =
        (settingsChanges?.currentValue as MessageSettings | undefined) ??
        (this.settings as MessageSettings);

      this.xExtension = {
        ...currentX,
        trxnList: currentX.trxnList.map((trxn) => ({
          ...trxn,
          hexColor: trxnHexColor,
        })),
        tranList: currentX.tranList.map((tran) => ({
          ...tran,
          hexColor: tranHexColor,
        })),
      };

      this.showTranslating =
        !transcription &&
        (this.xExtension.tranList.length === 0 ||
          this.xExtension.tranList.every((tran) => tran.hidden || tran.text.length === 0));
    }

    // TODO: animate
    // if (xChanges) {
    //   this.animate = false;

    //   requestAnimationFrame(() => {
    //     this.animate = true;

    //     this._cdr.markForCheck();
    //   });
    // }
  }
}
