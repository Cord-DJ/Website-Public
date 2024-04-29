import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TenorService, CordService } from '../../../../services';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChatComponent } from '../chat.component';

@UntilDestroy()
@Component({
  selector: 'cord-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiPickerComponent implements OnInit {
  search = new UntypedFormControl();
  categories$ = new BehaviorSubject<any[]>([]);
  searchResults$ = new BehaviorSubject<any[]>([]);

  constructor(
    private tenorService: TenorService,
    private chatComponent: ChatComponent,
    private cordService: CordService
  ) {
    this.search.valueChanges.pipe(untilDestroyed(this)).subscribe(async query => {
      this.searchResults$.next(await tenorService.search(query));
    });
  }

  get hasSearch() {
    return !!this.search.value;
  }

  async ngOnInit() {
    this.categories$.next(await this.tenorService.getCategories());
  }

  searchClick(query: string) {
    this.search.setValue(query);
  }

  clearSearch() {
    this.search.reset();
  }

  sendGif(url: string) {
    this.cordService.room?.sendMessage(url);
    this.chatComponent.toggleEmojiPicker();
  }
}
