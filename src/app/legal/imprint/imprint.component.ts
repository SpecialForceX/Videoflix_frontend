import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss'],
  standalone: true,
  imports: [],
})
export class ImprintComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}

