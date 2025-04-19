import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password-reset-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './password-reset-confirm.component.html',
  styleUrls: ['./password-reset-confirm.component.scss'],
})
export class PasswordResetConfirmComponent {
  password = '';
  password2 = '';
  message = '';
  uidb64 = '';
  token = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.uidb64 = this.route.snapshot.params['uidb64'];
    this.token = this.route.snapshot.params['token'];
  }

  onSubmit() {
    if (this.password !== this.password2) {
      this.message = '❌ Passwords must match.';
      return;
    }

    this.http
      .post(`http://localhost:8000/api/users/reset-password-confirm/${this.uidb64}/${this.token}/`, {
        password: this.password,
        password2: this.password2,
      })
      .subscribe({
        next: () => {
          this.message = '✅ Password reset successfully.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => (this.message = '❌ The link is invalid or has expired.'),
      });
  }

  showPassword = false;
  showPassword2 = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePassword2Visibility() {
    this.showPassword2 = !this.showPassword2;
  }

}

