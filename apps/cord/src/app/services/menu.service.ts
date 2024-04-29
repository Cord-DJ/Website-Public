import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private _activePage = new BehaviorSubject<string>('chat');

  activePage$ = this._activePage.asObservable();

  openPage(page: string) {
    this._activePage.next(page);
  }
}
