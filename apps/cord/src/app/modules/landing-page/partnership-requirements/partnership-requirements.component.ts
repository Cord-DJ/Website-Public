import { Component } from '@angular/core';

@Component({
  selector: 'cord-partnership-requirements',
  templateUrl: './partnership-requirements.component.html',
  styleUrls: ['./partnership-requirements.component.scss']
})
export class PartnershipRequirementsComponent {
  openForm() {
    window.open('https://forms.office.com/r/9yXYL3D9gU', '_blank');
  }
}
