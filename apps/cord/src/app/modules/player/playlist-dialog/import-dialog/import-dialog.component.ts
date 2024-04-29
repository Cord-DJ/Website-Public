import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { CordService, SpotifyService } from '../../../../services';
import { ID, ImportType } from '../../../../api';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogRef } from '@angular/cdk/dialog';

@UntilDestroy()
@Component({
  selector: 'cord-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportDialogComponent {
  link = new UntypedFormControl(null, Validators.required);
  type = new UntypedFormControl('playlist');
  selectedPlaylists = new UntypedFormControl();

  status = Status.None;
  importedCount = 0;

  playlists$ = this.link.valueChanges.pipe(
    startWith(null),
    debounceTime(500),
    distinctUntilChanged(),
    untilDestroyed(this),
    switchMap(async () => {
      const value = this.link.value;
      if (!value) {
        return [];
      }

      try {
        const response = await this.spotifyService.getUserPlaylists(value);
        return response.map(x => [x.id, x.name] as [ID, string]);
      } catch {
        return [];
      }
    })
  );

  get Status() {
    return Status;
  }

  get isMultiple() {
    return this.type.value === 'user';
  }

  get totalPlaylists() {
    return this.isMultiple ? this.selectedPlaylists.value.length : 1;
  }

  constructor(
    private cordService: CordService,
    private dialogRef: DialogRef<ImportDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private spotifyService: SpotifyService
  ) {
    this.type.valueChanges.subscribe(x => console.log('type', x));
  }

  async importYoutube() {
    if (!this.link.valid) {
      this.link.markAsTouched();
    }

    await this.import([this.link.value], ImportType.Youtube);
  }

  async importSpotify() {
    if (!this.link.valid) {
      this.link.markAsTouched();
    }

    await this.import(this.isMultiple ? this.selectedPlaylists.value : [this.link.value], ImportType.Spotify);
  }

  delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }

  async import(ids: string[], type: ImportType) {
    this.status = Status.Importing;

    try {
      for (const id of ids) {
        this.importedCount++;
        this.changeDetectorRef.markForCheck();

        // do not await this
        this.cordService.me.importPlaylist(id, type);
        await this.delay(500);
      }

      this.status = Status.Success;
    } catch {
      this.status = Status.Error;
    }

    this.changeDetectorRef.markForCheck();
  }
}

export enum Status {
  None,
  Importing,
  Success,
  Error
}
