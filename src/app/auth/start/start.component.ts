import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  email: string = '';

  constructor(private router: Router) {}

  onEmailSubmit() {
    this.router.navigate(['register'], {
      queryParams: { email: this.email },
    });
  }
}


