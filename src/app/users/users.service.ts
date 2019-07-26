import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { User } from "./user.model";

const BACKEND_URL = environment.apiUrl + "/user/";


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; userCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; users: any; maxUsers: number }>(
        BACKEND_URL +'users/'+ queryParams
      )
      .pipe(
        map(userData => {
          return {
            users: userData.users.map(user => {
              return {
                name: user.name,
                email: user.email,
                id: user._id,
                role: user.role,
                
              };
            }),
            maxUsers: userData.maxUsers
          };
        })
      )
      .subscribe(transformedUserData => {
        this.users = transformedUserData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedUserData.maxUsers
        });
      });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

 
  deleteUser(userId: string) {
    return this.http.delete(BACKEND_URL + userId);
  }
}
