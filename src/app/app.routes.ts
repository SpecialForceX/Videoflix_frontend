import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './videos/dashboard/dashboard.component';
import { StartComponent } from './auth/start/start.component';
import { authGuard } from './core/auth.guard';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { PasswordResetConfirmComponent } from './auth/password-reset-confirm/password-reset-confirm.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';
import { ImprintComponent } from './legal/imprint/imprint.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'reset-password/:uidb64/:token', component: PasswordResetConfirmComponent },
  { path: 'datenschutz', component: PrivacyPolicyComponent },
  { path: 'impressum', component: ImprintComponent },
];
