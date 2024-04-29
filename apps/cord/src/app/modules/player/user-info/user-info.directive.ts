import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { IUser } from '../../../api';
import { UserInfoComponent } from './user-info.component';

@Directive({
  selector: '[userInfo]'
})
export class UserInfoDirective implements OnDestroy {
  private overlayRef?: OverlayRef;

  @Input() userInfo?: IUser;

  @HostListener('click')
  click() {
    if (this.overlayRef || !this.userInfo) {
      return;
    }

    const positionStrategy = this.posBuilder.flexibleConnectedTo(this.elementRef).withPositions([
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom'
      }
    ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
    const portal = new ComponentPortal(UserInfoComponent);
    const obj = this.overlayRef.attach(portal);
    obj.instance.info = this.userInfo;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.overlayRef?.hostElement.contains(event.target) && !this.elementRef.nativeElement.contains(event.target)) {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    }
  }

  constructor(private elementRef: ElementRef, private posBuilder: OverlayPositionBuilder, private overlay: Overlay) {}

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
