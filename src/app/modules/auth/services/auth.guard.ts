import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // User is authenticated, allow access
      return true;
    }

    // User is not authenticated, redirect to the login page
    this.authService.signOut();
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
