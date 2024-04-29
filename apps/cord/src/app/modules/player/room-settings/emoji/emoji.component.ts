import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cord-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {
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
