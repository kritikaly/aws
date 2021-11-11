import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserServiceService } from '../services/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class GaurdGuard implements CanActivate {

  constructor(private loginService: UserServiceService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.loginService.tokenExpirationCheck()) {
      console.log('access denied by expired token, or no token at all');
      this.router.navigateByUrl('/login');
      this.loginService.deleteToken();
      return false;
    } else {
      return true;
    }
  }
  
}
