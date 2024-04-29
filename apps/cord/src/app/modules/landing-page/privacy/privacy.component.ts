import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'cord-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyComponent {
  constructor(private scroller: ViewportScroller) {}

  scroll(id: string) {
    this.scroller.scrollToAnchor(id);
  }
}
