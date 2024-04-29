import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  interval,
  lastValueFrom,
  map,
  Observable,
  Subject,
  takeWhile
} from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ICurrentSong,
  ID,
  IMember,
  IMessage,
  IRole,
  IRoom,
  IUser,
  Member,
  Message,
  OnlineUser,
  Permission,
  Playlist,
  Room,
  UpdateRoom,
  User,
  Vote,
  ISongPlayed,
  SongPlayed
} from '../api';
import { SignalrService } from './signalr.service';
import { Router } from '@angular/router';
import { DeviceService } from './device.service';
import { CurrentSong } from '../api/playlists/current-song';

declare global {
  interface Window {
    http: HttpClient;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CordService {
  private _activeRoomId = new BehaviorSubject<ID | null>(null);
  private _rooms = new BehaviorSubject<Room[]>([]);
  private _users = new BehaviorSubject<User[]>([]);

  get room() {
    if (this._activeRoomId.value) {
      return this._rooms.value.find(x => x.id === this._activeRoomId.value);
    }

    return null;
  }

  users$ = this._users.asObservable();
  me$ = this.users$.pipe(map(users => users[0]));
  rooms$ = this._rooms.asObservable();

  room$ = combineLatest([this._rooms, this._activeRoomId]).pipe(
    map(([rooms, activeId]) => (activeId ? rooms.find(x => x.id === activeId) : null))
  );

  roles$ = this.roomObservable(x => x?.roles);
  onlineUsers$ = this.roomObservable(x => x?.onlineUsers);
  currentSong$ = this.roomObservable(x => x?.currentSong);
  members$ = this.roomObservable(x => x?.members);
  messages$ = this.roomObservable(x => x?.messages);
  queue$ = this.roomObservable(x => x?.queue);
  banned$ = this.roomObservable(x => x?.banned);
  muted$ = this.roomObservable(x => x?.muted);
  songHistory$ = this.roomObservable(x => x?.songHistory);

  hasJoined$ = combineLatest([this.members$, this.me$]).pipe(
    map(([members, me]) => members?.some(x => x.user.id === me?.id)),
    distinctUntilChanged()
  );

  playlists$ = this.me$.pipe(
    map(x => x?.playlists),
    distinctUntilChanged()
  );

  activePlaylist$ = this.me$.pipe(
    map(x => x?.playlists?.find(y => y.id === x.activePlaylistId)),
    distinctUntilChanged()
  );

  // userAdded$ = new Subject<IUser>();
  onlineUserCreated$ = new Subject<OnlineUser>();
  onlineUserUpdated$ = new Subject<OnlineUser>();
  onlineUserDeleted$ = new Subject<ID>();

  hasPermissions(...permissions: Permission[]) {
    return combineLatest([this.room$, this.me$]).pipe(
      map(([room, me]) => me?.isStaff || room?.hasPermissions(me!.id, ...permissions))
    );
  }

  get rooms() {
    return this._rooms.value;
  }

  get users() {
    return this._users.value;
  }

  get me() {
    return this.users[0];
  }

  get id() {
    return this.me?.id;
  }

  constructor(
    private http: HttpClient,
    private signal: SignalrService,
    private router: Router,
    private zone: NgZone,
    private deviceService: DeviceService
  ) {
    window.http = http;

    this.mapGlobalHandlers();
    this.mapPlaylistHandlers();
    this.mapRoomHandlers();
  }

  createRoom(room: UpdateRoom) {
    return lastValueFrom(this.http.post<{ link: string }>(`${environment.apiEndpoint}/rooms`, room));
  }

  createUser(email: string, password: string, name: string, captcha: string) {
    return lastValueFrom(
      this.http.post<string>(`${environment.apiEndpoint}/users`, {
        email,
        password,
        name,
        captcha
      })
    );
  }

  resetPassword(code: string, newPassword: string) {
    return lastValueFrom(
      this.http.post(`${environment.apiEndpoint}/users/reset-password`, {
        code,
        newPassword
      })
    );
  }

  resetPasswordRequest(email: string, captcha: string) {
    return lastValueFrom(this.http.post(`${environment.apiEndpoint}/users/reset-password-request`, { email, captcha }));
  }

  reset() {
    this._activeRoomId.next(null);
    this._users.next([]);
    this._rooms.next([]);
  }

  async reconnect(roomLink: string) {
    await this.signal.disconnect();
    this.reset();
    await this.signal.connect();
    await this.identify();
    await this.enterRoom(roomLink);
  }

  async ping() {
    try {
      if (!(await this.signal.invoke('Ping'))) {
        await this.reconnect(this.room!.link);
      }
    } catch (e) {
      console.error(e, 'ping failed');
    }
  }

  async identify() {
    return this.signal.invoke('Identify', this.deviceService.device);
  }

  async enterRoom(link: string) {
    const id = await this.signal.invoke('EnterRoom', link);
    if (!id) {
      await this.router.navigateByUrl('/r/home');
      throw new Error('Invalid room');
    }

    this._activeRoomId.next(id);
    return id;
  }

  async getPopularRooms() {
    const response = await lastValueFrom(this.http.get<any[]>(`${environment.apiEndpoint}/rooms`));
    return plainToInstance(Room, response);
  }

  // TODO: use room methods instead
  getUserRoles(userId: ID): Observable<IRole[] | undefined> {
    return this.room$.pipe(
      map(room => {
        const member = room?.members?.find(x => x.user.id === userId);
        return member?.roles.map(id => room?.roles?.find(x => x.id === id)) as IRole[];
      })
    );
  }

  getUserPrimaryRole(userId: ID) {
    return this.getUserRoles(userId).pipe(
      map(roles => (roles?.length ? roles.reduce((prev, cur) => (prev.position > cur.position ? prev : cur)) : null))
    );
  }

  private addUsers(users: User[]) {
    const existing = this._users.value;

    for (const user of users) {
      if (!user) {
        continue;
      }

      if (!existing.find(x => x.id === user.id)) {
        existing.push(user);
      }
    }

    this._users.next(existing);
  }

  private getRoom(roomId: ID) {
    const room = this.rooms.find(x => x.id === roomId);

    if (!room) {
      throw new Error(`room ${roomId} not found`);
    }

    return room;
  }

  private update() {
    this._rooms.next(this.rooms);
  }

  private updateUsers() {
    this._users.next(this.users);
  }

  private roomObservable<T>(delegate: (room: Room | null | undefined) => T) {
    return this.room$.pipe(map(delegate), distinctUntilChanged());
  }

  private mapPlaylistHandlers() {
    this.on('CreatePlaylist', (playlist: object) => {
      const pl = plainToInstance(Playlist, playlist);

      if (this.me.playlists?.some(x => x.id === pl.id)) {
        throw new Error('playlist already exist');
      }

      this.me.playlists = [...(this.me.playlists ?? []), pl];
      this.updateUsers();
    });

    this.on('UpdatePlaylist', (playlist: object) => {
      if (!this.me.playlists) {
        throw new Error('playlists does not exist');
      }

      const pl = plainToInstance(Playlist, playlist);
      const idx = this.me.playlists.findIndex(x => x.id === pl.id);

      if (idx !== -1) {
        this.me.playlists[idx] = pl;
        this.me.playlists = [...this.me.playlists];

        this.updateUsers();
      }
    });

    this.on('DeletePlaylist', (playlistId: ID) => {
      this.me.playlists = this.me.playlists?.filter(x => x.id !== playlistId);
      this.updateUsers();
    });
  }

  private mapGlobalHandlers() {
    this.on('Hello', (hello: { helloInterval: number }) => {
      if (hello.helloInterval < 5) {
        console.error('received wrong interval', hello);
        return;
      }

      combineLatest([this._activeRoomId, interval(hello.helloInterval)])
        .pipe(takeWhile(([activeRoomId]) => activeRoomId !== null))
        .subscribe(() => this.ping());
    });

    this.on('Ready', (roomsModel: object[], me: object) => {
      const rooms = [];
      for (const room of roomsModel) {
        const instance = plainToInstance(Room, room);

        instance.members?.forEach(x => CordService.assignRoom(x, instance));
        rooms.push(instance);
      }

      this._rooms.next(rooms);
      this.addUsers([plainToInstance(User, me)]);
      this.addUsers(rooms.map(x => x.members?.map(y => y.user)).flat() as User[]);
      this.addUsers(
        rooms
          .map(x => x.onlineUsers?.map(y => y?.user))
          .flat()
          .filter(x => x) as User[]
      );

      this.signal.receivedReady();
    });

    this.on('UpdateUser', (user: IUser) => {
      const obj = plainToInstance(User, user);

      const idx = this.users.findIndex(x => x.id === obj.id);
      if (idx !== -1) {
        const usr = this.users[idx];
        usr.name = obj.name;
        usr.discriminator = obj.discriminator;
        usr.avatar = obj.avatar;
        usr.banner = obj.banner;
        usr.character = obj.character;
        usr.boost = obj.boost;
        usr.exp = obj.exp;
        usr.level = obj.level;
        usr.maxExp = obj.maxExp;
        usr.name = obj.name;
        usr.properties = obj.properties;

        if (obj.activePlaylistId) {
          usr.activePlaylistId = obj.activePlaylistId;
        }

        this.updateUsers();
      }
    });

    this.on('CreateRoom', (room: object) => {
      const obj = plainToInstance(Room, room);

      if (!this.rooms.some(x => x.id === obj.id)) {
        this._rooms.next([...this.rooms, obj]);
        this.addUsers(obj.members?.map(y => y.user).flat() as User[]);
        this.addUsers(obj.onlineUsers?.map(y => y.user).flat() as User[]);
      }
    });

    this.on('UpdateRoom', (room: IRoom) => {
      const obj = this._rooms.value.find(x => x.id === room.id);
      if (obj != null) {
        obj.name = room.name;
        obj.description = room.description;
        obj.features = room.features;
        obj.link = room.link;

        obj.ownerId = room.ownerId;
        obj.icon = room.icon;
        obj.banner = room.banner;
        obj.wallpaper = room.wallpaper;

        this._rooms.next(this.rooms);
      }
    });

    this.on('DeleteRoom', (roomId: ID) => {
      this._rooms.next(this.rooms.filter(x => x.id !== roomId));
    });
  }

  private mapRoomHandlers() {
    this.on('CreateOnlineUser', (roomId: ID, ou: object) => {
      const room = this.getRoom(roomId);
      const onlineUser = plainToInstance(OnlineUser, ou);

      if (room.onlineUsers?.some(x => x.id === onlineUser.id)) {
        throw new Error('online user already exist');
      }

      room.onlineUsers = [...(room.onlineUsers ?? []), onlineUser];
      this.update();

      if (this.room?.id === roomId) {
        this.onlineUserCreated$.next(onlineUser);
      }
    });

    this.on('UpdateOnlineUser', (roomId: ID, ou: object) => {
      const room = this.getRoom(roomId);

      if (!room.onlineUsers) {
        throw new Error('onlineUsers does not exist');
      }

      const onlineUser = plainToInstance(OnlineUser, ou);
      const idx = room.onlineUsers?.findIndex(x => x.id === onlineUser.id);

      if (idx !== -1) {
        room.onlineUsers[idx] = onlineUser;
        room.onlineUsers = [...room.onlineUsers];

        this.update();
      }

      if (this.room?.id === roomId) {
        this.onlineUserUpdated$.next(onlineUser);
      }
    });

    this.on('DeleteOnlineUser', (roomId: ID, onlineUserId: ID) => {
      if (onlineUserId === this.me.id) {
        console.log('ignoring self delete');
        return;
      }

      const room = this.getRoom(roomId);

      room.onlineUsers = room.onlineUsers?.filter(x => x.id !== onlineUserId);
      this.update();

      if (this.room?.id === roomId) {
        this.onlineUserDeleted$.next(onlineUserId);
      }
    });

    this.on('UpdateCurrentSong', (roomId: ID, currentSong: ICurrentSong) => {
      const room = this.getRoom(roomId);

      room.currentSong = plainToInstance(CurrentSong, currentSong);
      this.update();
    });

    this.on('UpdateVote', (roomId: ID, userId: ID, vote: Vote) => {
      const room = this.getRoom(roomId);

      if (room.currentSong) {
        switch (vote) {
          case Vote.Upvote:
            room.currentSong.upvotes = [...room.currentSong.upvotes, userId];
            room.currentSong.downvotes = room.currentSong.downvotes.filter(x => x !== userId);
            break;

          case Vote.Steal:
            room.currentSong.steals = [...room.currentSong.steals, userId];
            break;

          case Vote.Downvote:
            room.currentSong.downvotes = [...room.currentSong.downvotes, userId];
            room.currentSong.upvotes = room.currentSong.upvotes.filter(x => x !== userId);
            break;
        }

        this.update();
      }
    });

    this.on('UpdateQueue', (roomId: ID, users: IUser[]) => {
      const room = this.getRoom(roomId);
      room.queue = plainToInstance(User, users);

      this.update();
    });

    this.on('CreateRole', (roomId: ID, role: IRole) => {
      const room = this.getRoom(roomId);

      if (room.roles?.some(x => x.id === role.id)) {
        throw new Error('role already exist');
      }

      room.roles = [...(room.roles ?? []), role];
      this.update();
    });

    this.on('UpdateRole', (roomId: ID, role: IRole) => {
      const room = this.getRoom(roomId);

      if (!room.roles) {
        throw new Error('roles does not exists');
      }

      const idx = room.roles.findIndex(x => x.id === role.id);
      if (idx !== -1) {
        room.roles[idx] = role;
        room.roles = [...room.roles];

        this.update();
      }
    });

    this.on('DeleteRole', (roomId: ID, id: ID) => {
      const room = this.getRoom(roomId);

      room.roles = room.roles?.filter(x => x.id !== id);
      this.update();
    });

    this.on('CreateBan', (roomId: ID, user: IUser) => {
      const room = this.getRoom(roomId);

      if (room.banned?.some(x => x.id === user.id)) {
        throw new Error('banned user already exist');
      }

      room.banned = [...(room.banned ?? []), plainToInstance(User, user)];
      this.update();
    });

    this.on('DeleteBan', (roomId: ID, user: IUser) => {
      const room = this.getRoom(roomId);

      room.banned = room.banned?.filter(x => x.id !== user.id);
      this.update();
    });

    this.on('CreateMute', (roomId: ID, user: IUser) => {
      const room = this.getRoom(roomId);

      if (room.muted?.some(x => x.id === user.id)) {
        throw new Error('muted user already exist');
      }

      room.muted = [...(room.muted ?? []), plainToInstance(User, user)];
      this.update();
    });

    this.on('DeleteMute', (roomId: ID, user: IUser) => {
      const room = this.getRoom(roomId);

      room.muted = room.muted?.filter(x => x.id !== user.id);
      this.update();
    });

    this.on('CreateMember', (roomId: ID, member: IMember) => {
      const room = this.getRoom(roomId);
      const user = plainToInstance(Member, member);

      if (room.members?.some(x => x.user.id === member.user.id)) {
        throw new Error('member already exist');
      }

      CordService.assignRoom(user, room);
      room.members = [...(room?.members ?? []), user];

      this.addUsers([user.user as User]);
      this.update();
    });

    this.on('UpdateMember', (roomId: ID, member: IMember) => {
      const room = this.getRoom(roomId);

      if (!room.members) {
        throw new Error('members does not exists');
      }

      const mem = plainToInstance(Member, member);
      CordService.assignRoom(mem, room);

      const idx = room.members.findIndex(x => x.user.id === mem.user.id);
      if (idx !== -1) {
        room.members[idx] = mem;
        room.members = [...room.members];

        this.update();
      }
    });

    this.on('DeleteMember', (roomId: ID, userId: ID) => {
      const room = this.getRoom(roomId);

      room.members = room.members?.filter(x => x.user.id !== userId);
      this.update();
    });

    this.on('CreateMessage', (message: IMessage) => {
      const room = this.getRoom(message.roomId);
      const msg = plainToInstance(Message, message);

      if (!room.messages?.some(x => x.id === msg.id)) {
        room.messages = [...(room.messages ?? []), msg];
        this.update();
      }
    });

    this.on('UpdateMessage', (message: IMessage) => {
      const room = this.getRoom(message.roomId);

      if (!room.messages) {
        throw new Error('messages does not exists');
      }

      const msg = plainToInstance(Message, message);
      const idx = room.messages.findIndex(x => x.id === msg.id);
      if (idx !== -1) {
        room.messages[idx] = msg;
        room.messages = [...room.messages];

        this.update();
      }
    });

    this.on('DeleteMessage', (roomId: ID, messageId: ID) => {
      const room = this.getRoom(roomId);

      room.messages = room.messages?.filter(x => x.id !== messageId);
      this.update();
    });

    this.on('CreateSongPlayed', (roomId: ID, songPlayed: ISongPlayed) => {
      const room = this.getRoom(roomId);
      const obj = plainToInstance(SongPlayed, songPlayed);

      if (!room.songHistory?.some(x => x.id === obj.id)) {
        room.songHistory = [...(room.songHistory ?? []), obj];
        this.update();
      }
    });
  }

  private static assignRoom(member: IMember, room: IRoom) {
    (member as Member).room = room;
  }

  private on(methodName: string, newMethod: (...args: any[]) => void) {
    this.signal.hub.on(methodName, (...args: any[]) => {
      environment.production || console.log(methodName, ...args);

      this.zone.run(() => {
        try {
          newMethod(...args);
          // not sure why ApplicationREf.tick() diesn't work; but this does
          setTimeout(() => {});
        } catch (e) {
          console.error(e);
        }
      });
    });
  }
}

// Task Kick(ulong roomId, IUser user);
