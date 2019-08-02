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
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    const isAdmin = this.authService.getIsAdmin();
    const isUser = this.authService.getIsUser();
    if (!isAdmin) {
      if(!isAuth){
      this.router.navigate(['/auth/login']);
      }
      else if(isUser){
        this.router.navigate(['/myproducts']);
      } 

    }
    return isAdmin;
  }
}
