import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AvatarBuilder } from '../../../services';
import { Character } from '../../../api/equipment/character';

@Component({
  selector: 'cord-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AvatarComponent implements OnChanges {
  html?: SafeHtml;

  @Input() character?: Character;

  constructor(private domSanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) {}

  async ngOnChanges() {
    if (this.character) {
      this.html = this.domSanitizer.bypassSecurityTrustHtml(await new AvatarBuilder(this.character).build());
      this.changeDetectorRef.markForCheck();
    }
  }
}
