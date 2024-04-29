import { ChangeDetectionStrategy, Component, Host, Input } from '@angular/core';
import { getTimeFromId, ID, IUser, Message, Permission } from '../../../../api';
import { map } from 'rxjs';
import { CordService } from '../../../../services';
import { environment } from '../../../../../environments/environment';
import { ChatComponent } from '../chat.component';

@Component({
  selector: 'cord-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {
  @Input() message?: Message;

  canDelete$ = this.cordService.hasPermissions(Permission.ManageMessages);

  getUserColor(userId: ID) {
    return this.cordService.getUserPrimaryRole(userId).pipe(map(x => x?.color ?? 'white'));
  }

  constructor(private cordService: CordService, @Host() private chatComponent: ChatComponent) {}

  mentionUser(user: IUser) {
    this.chatComponent.mentionUser(user);
  }

  getType(message: Message) {
    if (message.isCozy) {
      return 'cozy';
    }

    return message.user.id === '1' ? 'info' : 'default';
  }

  getTime(id: ID) {
    return getTimeFromId(id).toRelative();
  }

  getCozyTime(id: ID) {
    return getTimeFromId(id).toFormat('HH:mm');
  }

  getFullTime(id: ID) {
    return getTimeFromId(id).toFormat('DD HH:mm');
  }

  getUser(author: IUser) {
    const user = this.cordService.users.find(x => x.id == author.id);
    if (user) {
      return user;
    }

    return author as any; // TODO: fixme
  }

  getAvatar(message: Message) {
    return this.getUser(message.user).avatarUrl + '?size=40';
  }

  async deleteMessage(message: Message) {
    if (confirm('Do you want to delete message?')) {
      await message.delete();
    }
  }

  parseText(text: string | undefined) {
    if (!text) {
      return null;
    }

    text =
      text
        ?.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;') ?? '';

    // possibly injeting js into path?
    const gif = this.parseGifs(text);
    if (gif) {
      return gif;
    }

    text = this.parseUrl(text);
    text = this.parseMentions(text);

    // Parse Emoji
    try {
      twemoji.className = 'emoji';
      const replaced = twemoji.parse(text, {
        base: environment.twemojiAssets,
        folder: 'svg',
        ext: '.svg'
      });

      // Return jumbo emoji if there's no text
      const hasText = replaced.replace(/<[^>]*>/g, '').replace(/ */g, '');
      if (!hasText) {
        twemoji.className = 'emoji jumbo';
        return twemoji.parse(text, {
          base: environment.twemojiAssets,
          folder: 'svg',
          ext: '.svg'
        });
      }

      return replaced;
    } catch (e) {}

    return text;
  }

  private parseGifs(text: string) {
    const match = text.match(/https:\/\/media.tenor.com\/(.*)/i);
    if (match?.length === 2) {
      return `<img class="gif" alt="meme" src="${text}" />`;
    }

    return null;
  }

  private parseUrl(text: string) {
    //URLs starting with http://, https://, or ftp://
    const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
    let replacedText = text.replace(replacePattern1, '<a href="$1" rel="nofollow" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    const replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" rel="nofollow" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    const replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
    return replacedText.replace(replacePattern3, '<a href="mailto:$1" rel="nofollow">$1</a>');
  }

  private parseMentions(text: string) {
    const ids = text.match(/(&lt;)@[0-9]*(&gt;)/g)?.map(x => x.substring(5, x.length - 4)) ?? [];
    const members = this.cordService.room?.members;

    for (const id of ids) {
      const member = members!.find(x => x.user.id === id);
      let user: IUser | undefined;

      if (member) {
        user = member.user;
      } else {
        // TODO: mentioned user that left the community but was mentioned before
        // We need to send MinimalUser in Message.mentions
        // user = message.me
      }

      if (user) {
        text = text.replaceAll(`&lt;@${id}&gt;`, `<span class="mention">${user.name}</span>`);
      }
    }

    return text;
  }
}

declare const twemoji: {
  className: string;
  parse(str: string, options?: { folder: string; ext: string; base: string }): string;
};
