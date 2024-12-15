import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    return this.router.createUrlTree(['/profile']);
  }
}