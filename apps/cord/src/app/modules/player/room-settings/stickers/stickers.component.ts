import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cord-stickers',
  templateUrl: './stickers.component.html',
  styleUrls: ['./stickers.component.scss']
})
export class StickersComponent implements OnInit {
  canExit = true;

  constructor() {}

  ngOnInit() {}

  async save() {
    // this.snackBar.open('Setting has been save successfuly');
  }

  async reset() {
    // TODO
  }
}
