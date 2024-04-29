import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { VarDirective } from './ng-var.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { AuthRequiredComponent } from './components/ui-auth-required/ui-auth-required.component';
import { PortalModule } from '@angular/cdk/portal';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UiSelectListComponent } from './components/ui-select-list/ui-select-list.component';
import { UiDialogComponent } from './components/ui-dialog/ui-dialog.component';
import { DialogServiceComponent } from '../../services';
import { XuiButtonModule, XuiIconModule } from 'xui';
import { DialogModule } from '@angular/cdk/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    RouterModule,

    MatIconModule,

    XuiButtonModule,
    XuiIconModule,

    PortalModule,
    OverlayModule,
    DragDropModule,
    DialogModule
  ],
  declarations: [VarDirective, AuthRequiredComponent, UiSelectListComponent, UiDialogComponent, DialogServiceComponent],
  exports: [
    CommonModule,
    ReactiveFormsModule,

    MatIconModule,

    UiSelectListComponent,
    UiDialogComponent,

    PortalModule,
    OverlayModule,
    AuthRequiredComponent,
    VarDirective,
    DragDropModule,
    DialogModule
  ]
})
export class SharedModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    };
  }
}
