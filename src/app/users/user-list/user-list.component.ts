import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { User } from "../user.model";
import { UsersService } from "../users.service";
import { AuthService } from "../../auth/auth.service";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  isLoading = false;
  totalUsers = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  isAdmin = false;
  isUser = false;
  userId: string;
  private usersSub: Subscription;
  private authStatusSub: Subscription;
  private adminStatusSub: Subscription;
  private userStatusSub: Subscription;



  constructor(
    public usersService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers(this.usersPerPage, this.currentPage);
    this.usersSub = this.usersService.getUserUpdateListener()
      .subscribe((userData: { users: User[]; userCount: number }) => {
        this.isLoading = false;
        this.totalUsers = userData.userCount;
        this.users = userData.users;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

      this.isAdmin = this.authService.getIsAdmin();
      this.adminStatusSub = this.authService.getAdminStatusListener()
      .subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      });

      this.isUser = this.authService.getIsUser();
      this.userStatusSub = this.authService.getUserStatusListener()
      .subscribe(isUser => {
        this.isUser = isUser;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.usersService.getUsers(this.usersPerPage, this.currentPage);
  }

  onDelete(userId: string) {
    this.isLoading = true;
    this.usersService.deleteUser(userId).subscribe(() => {
    this.usersService.getUsers(this.usersPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
    this.userStatusSub.unsubscribe();
  }

}
