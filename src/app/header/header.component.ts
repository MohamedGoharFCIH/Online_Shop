import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  isAdmin = false;
  isUser = false;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;
  private userListenerSubs: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isAdmin = this.authService.getIsAdmin();
    this.adminListenerSubs = this.authService.getAdminStatusListener()
      .subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      });

    this.isUser = this.authService.getIsUser();
    this.userListenerSubs = this.authService.getUserStatusListener()
      .subscribe(isUser => {
        this.isUser = isUser;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
    this.userListenerSubs.unsubscribe();
  }
}
