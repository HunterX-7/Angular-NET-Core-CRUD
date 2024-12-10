import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        this.error = err.message || 'Login failed';
      }
    });
  }
}