import { Injectable } from '@angular/core';
import { LocalStorage } from './local-storage';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  @LocalStorage lastRoom: string | null = null;
  private isSearchOpened = new BehaviorSubject(false);

  get isSearchOpened$() {
    return this.isSearchOpened.asObservable().pipe(distinctUntilChanged());
  }

  constructor(private router: Router) {}

  setRoom(id: string) {
    this.lastRoom = id;
  }

  goToLastOrDefault() {
    return this.router.navigateByUrl(this.lastRoom ? `/r/${this.lastRoom}` : '/r/home');
  }

  openSearch() {
    this.isSearchOpened.next(true);
  }

  closeSearch() {
    this.isSearchOpened.next(false);
  }
}
