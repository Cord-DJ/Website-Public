import { ChangeDetectionStrategy, Component, Inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthRequiredComponent } from '../modules/shared/components/ui-auth-required/ui-auth-required.component';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private oauthService: OAuthService, private dialog: Dialog) {}

  ensureAuthenticated(force = false) {
    if (!force && this.oauthService.hasValidAccessToken()) {
      return;
    }

    this.dialog.open(AuthRequiredComponent, {
      width: '300px',
      height: '250px'
    });

    throw new Error('unauthenticated');
  }

  show(title: string, content: string) {
    this.dialog.open(DialogServiceComponent, {
      width: '500px',
      height: '250px',
      data: {
        title,
        content
      }
    });
  }
}

@Component({
  selector: 'dialog-service-component',
  template: `
    <ui-dialog>
      <div class="content">
        <h1>{{ title | translate }}</h1>
        {{ content | translate }}
      </div>

      <ng-container ui-actions>
        <xui-button class="primary-button" (click)="close()">Okay</xui-button>
      </ng-container>
    </ui-dialog>
  `,
  styles: [
    `
      .content {
        padding: 10px;
      }
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogServiceComponent {
  get title() {
    return this.data?.title;
  }

  get content() {
    return this.data?.content;
  }

  close() {
    this.dialogRef.close();
  }

  constructor(@Inject(DIALOG_DATA) private data: any, private dialogRef: DialogRef<DialogServiceComponent>) {}
}
