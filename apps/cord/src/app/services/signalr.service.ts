import { ApplicationRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, first, interval } from 'rxjs';
import { environment } from '../../environments/environment';
import { DialogService } from './dialog.service';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  static readonly Connected = 'Connected';
  static readonly Connecting = 'Connecting';
  static readonly Ready = 'Ready';
  static readonly Disconnected = 'Disconnected';

  private _hub!: HubConnection;
  private _state = new BehaviorSubject<string>('Connecting');

  get state() {
    return this._state.value;
  }

  state$ = this._state.asObservable();

  get hub() {
    return this._hub;
  }

  constructor(
    oauthService: OAuthService,
    private router: Router,
    private dialogService: DialogService,
    private appRef: ApplicationRef
  ) {
    this._hub = new HubConnectionBuilder()
      .withUrl(environment.gatewayEndpoint, {
        accessTokenFactory: () => oauthService.getAccessToken()
      })
      // .withHubProtocol(new MessagePackHubProtocol())
      .build();

    appRef.isStable.pipe(first(x => x)).subscribe(() => {
      interval(200).subscribe(() => this.checkStatus());
    });
  }

  listen() {
    this._hub.on('Status', status => {
      console.log('received status', status);
      if (status === 'room_not_found') {
        this.router.navigateByUrl('/rooms');
        // setTimeout(() => {});
      }
    });
  }

  async connect() {
    this._state.next(SignalrService.Connecting);
    await this._hub.start();
    this.checkStatus();
  }

  disconnect() {
    if (this._hub.state !== SignalrService.Disconnected) {
      return this._hub.stop();
    }

    return Promise.resolve();
  }

  receivedReady() {
    this._state.next(SignalrService.Ready);
    // setTimeout(() => {});
  }

  async invoke(name: string, ...args: any[]) {
    try {
      return await this.hub.invoke(name, ...args);
    } catch (e) {
      if ((e as Error).message.includes('because user is unauthorized')) {
        this.dialogService.ensureAuthenticated(true);
      } else {
        throw e;
      }
    }
  }

  private checkStatus() {
    if (
      this._hub.state !== this._state.value &&
      ((this._hub.state !== SignalrService.Connected && this.state !== SignalrService.Ready) ||
        this._hub.state === SignalrService.Disconnected)
    ) {
      this._state.next(this._hub.state);
    }
  }
}
