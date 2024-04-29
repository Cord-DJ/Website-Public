import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  _notif = new Subject<{ type: string; value: string }>();

  valueNotif$ = this._notif.asObservable();
  registration: ServiceWorkerRegistration | undefined;

  constructor(private sigService: SignalrService) {}

  listen() {
    this.sigService.hub.on('ValueNotification', (type, value) => {
      // console.log('messages', messages);
      this._notif.next({ type, value });
    });
  }

  async showPopup(text: string, title?: string) {
    if (!this.registration) {
      this.registration = await navigator.serviceWorker.getRegistration();
    }

    if (Notification.permission === 'granted') {
      await this.registration?.showNotification(title ?? 'Cord.DJ', <NotificationOptions>{
        body: text,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png'
      });
    }
  }
}
