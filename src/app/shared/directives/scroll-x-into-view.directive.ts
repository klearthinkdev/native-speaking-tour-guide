import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { MessageOrder } from '../enums/message-order.enum';
import { scrollIntoView } from '../services/utils.service';

@Directive({
  selector: '[appScrollXIntoView]',
})
export class ScrollXIntoViewDirective implements AfterViewInit {
  @Input('inputs') inputs!: {
    last?: boolean;
    autoScroll: boolean;
    order: MessageOrder;
  };

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    const { last, autoScroll, order } = this.inputs;

    if (last && autoScroll) {
      scrollIntoView(this.elRef.nativeElement, {
        behavior: 'instant',
        block: order === MessageOrder.ASC ? 'end' : 'start',
      });
    }
  }
}
