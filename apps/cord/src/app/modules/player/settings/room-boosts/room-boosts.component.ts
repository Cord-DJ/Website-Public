import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cord-room-boosts',
  templateUrl: './room-boosts.component.html',
  styleUrls: ['./room-boosts.component.scss']
})
export class RoomBoostsComponent implements OnInit {
  public canExit: boolean = true;

  constructor() {}

  ngOnInit() {}

  async save() {}

  async reset() {}
}
