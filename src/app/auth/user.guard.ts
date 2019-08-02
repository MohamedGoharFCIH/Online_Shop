import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    const isUser = this.authService.getIsUser();
    const isAdmin = this.authService.getIsAdmin();
    if (!isUser) {
      if(!isAuth){
        this.router.navigate(['/auth/login']);
      }
      else if(isAdmin){
        this.router.navigate(['/users']);
      }
      
    }
    return isAuth;
  }
}
