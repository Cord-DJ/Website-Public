import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter, map } from 'rxjs';
import { ID, IUser, Message, Permission } from '../../../api';
import { CordService, DialogService, NotificationService } from '../../../services';
import { SettingsService } from '../../../services/settings.service';

@UntilDestroy()
@Component({
  selector: 'cord-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewChecked {
  notificationSound = new FormControl<boolean>(this.settings.settings.notifications, { nonNullable: true });
  videoVisible = new FormControl<boolean>(this.settings.settings.videoVisible, { nonNullable: true });

  audio = new Audio('/assets/new-message.mp3');
  lockedScroll = true;
  text = new FormControl<string>('');
  isEmojiOpen = false;
  oldMessages?: ID[];

  messages$ = this.cordService.messages$.pipe(
    map(messages =>
      messages?.map((x, i, arr) => {
        const msg = x as Message;
        if (i == 0) {
          return msg;
        }

        const prev = arr[i - 1];
        const prevId = prev.member?.user.id ?? prev.author.id;
        const currId = x.member?.user.id ?? x.author.id;
        const minutes = x.createdAt.diff(prev.createdAt, ['minutes']).minutes;

        msg.isCozy = prevId == currId && prev.createdAt.hasSame(x.createdAt, 'day') && minutes < 10;
        return msg;
      })
    )
  );

  hasJoined$ = this.cordService.hasJoined$;
  isDisabled$ = combineLatest([
    this.cordService.hasJoined$,
    this.cordService.hasPermissions(Permission.SendMessages)
  ]).pipe(
    map(([hasJoined, canSend]) => {
      return !hasJoined || !canSend;
    })
  );

  inputPlaceholder$ = combineLatest([this.hasJoined$, this.isDisabled$]).pipe(
    map(([joined, disabled]) => (joined ? 'chat.say_something' : disabled ? 'chat.no_permissions' : 'chat.join_room'))
  );

  @ViewChild('messages') private messagesRef!: ElementRef;

  constructor(
    private cordService: CordService,
    private dialogService: DialogService,
    private settings: SettingsService,
    private notifications: NotificationService
  ) {
    this.audio.load();

    this.settings.settings$.pipe(untilDestroyed(this)).subscribe(settings => {
      this.notificationSound.setValue(settings.notifications);
      this.videoVisible.setValue(settings.videoVisible);
    });

    this.notificationSound.valueChanges.subscribe(notifications => this.settings.update({ notifications }));
    this.videoVisible.valueChanges.subscribe(videoVisible => this.settings.update({ videoVisible }));

    this.text.valueChanges.pipe(untilDestroyed(this)).subscribe(x => {
      // if (x?.includes('@')) {
      //   this.dataList = this.cordService.room?.members?.map(x => x.user.name);
      //   console.log('autofill', this.dataList);
      // }

      const changed = this.replaceEmoji(x ?? '');
      if (changed !== x) {
        this.text.patchValue(changed);
      }
    });

    this.messages$
      .pipe(
        untilDestroyed(this),
        filter(x => !!x)
      )
      .subscribe(async messages => {
        if (!this.oldMessages) {
          this.oldMessages = messages?.map(x => x.id);
          return;
        }

        const newMessages = messages?.filter(x => !this.oldMessages?.includes(x.id)) ?? [];
        for (const m of newMessages) {
          if (m.user.id !== this.cordService.me.id) {
            await this.notifications.showPopup(m.text!, this.cordService.room?.name);
          }
        }

        if (this.notificationSound.value && newMessages.some(x => x.user.id !== this.cordService.me.id)) {
          await this.playSound();
        }

        this.oldMessages = messages?.map(x => x.id);
      });
  }
  async ngOnInit() {
    await Notification.requestPermission();
  }

  ngAfterViewChecked() {
    if (this.lockedScroll) {
      this.scrollToBottom();
    }
  }

  playSound() {
    return this.audio.play();
  }

  async joinRoom() {
    this.dialogService.ensureAuthenticated();
    await this.cordService.room?.addMember();
  }

  toggleEmojiPicker() {
    this.isEmojiOpen = !this.isEmojiOpen;
  }

  userScrolled() {
    this.lockedScroll = this.isAtBottom;
  }

  send() {
    if (!this.text.value) {
      return;
    }

    // Replace mentions
    let text = this.text.value;
    const mentions = text.match(/@\S*/g) ?? [];
    const names = new Set(mentions.map(x => x.substring(1)));

    const members = this.cordService.room?.members!;
    for (const name of names) {
      let user: IUser | undefined;
      const member = members?.find(x => x.nick === name);

      if (member) {
        user = member.user;
      } else {
        user = members.find(x => x.user.name === name)?.user;
      }

      if (user) {
        text = text.replaceAll(`@${name}`, `<@${user?.id}>`);
      }
    }

    this.cordService.room?.sendMessage(text);
    this.text.reset();
  }

  scrollToBottom() {
    this.messagesRef.nativeElement.scrollTop = this.messagesRef.nativeElement.scrollHeight;
  }

  get isAtBottom() {
    const { scrollTop, clientHeight, scrollHeight } = this.messagesRef.nativeElement;
    return Math.round(scrollTop + clientHeight) === scrollHeight;
  }

  mentionUser(user: IUser) {
    const start = this.text.value ? this.text.value + ' ' : '';
    this.text.patchValue(`${start}@${user.name} `);
  }

  addEmoji(event: any) {
    const { custom, native, colons } = event.emoji;
    this.text.setValue((this.text.value ?? '') + (custom ? colons : native));
  }

  replaceEmoji(text: string) {
    return text.replace(/:[dD]/g, '😁').replace(/:[pP]/g, '😛');
  }

  readonly customEmojis = [
    {
      name: 'Octocat',
      shortNames: ['octocat'],
      text: '',
      emoticons: [],
      keywords: ['github'],
      imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png'
    }
  ];
}
