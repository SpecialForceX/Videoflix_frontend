import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  email = '';
  message = '';
  isValidEmail = false;

  constructor(private http: HttpClient) {}

  validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = regex.test(email);
  }

  onSubmit() {
    this.http.post(`${environment.apiUrl}api/users/reset-password/`, { email: this.email }).subscribe(() => {
      this.message = '✅ Reset-Mail wurde versendet.';
    });
  }
}


