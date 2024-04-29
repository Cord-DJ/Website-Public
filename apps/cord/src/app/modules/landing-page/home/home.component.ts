import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LandingPageService } from '../landing-page.service';

@Component({
  selector: 'cord-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  stats$ = new Subject<any>();

  constructor(private lpService: LandingPageService) {}

  async ngOnInit() {
    this.stats$.next(await this.lpService.stats());
  }
}
