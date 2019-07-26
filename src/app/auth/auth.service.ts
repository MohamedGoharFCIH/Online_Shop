import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { environment } from "../../environments/environment";
import { RegisterData } from './auth-data.model';
import { LoginData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private role:number;
  private tokenTimer: any;
  private userId: string;
  private isUser = false;
  private isAdmin = false;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private userStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsUser(){
    return this.isUser;
  }
  getIsAdmin(){
    return this.isAdmin;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }
  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  CreateUser(name: string, email: string, password: string){
    const authData :RegisterData = {name: name, email: email, password: password};
    this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe(
      () => {
        this.router.navigate(["/"]);
      },
      error => {
        this.authStatusListener.next(false);
        this.adminStatusListener.next(false);
        this.userStatusListener.next(false);
      }
    );
  }

  Login(email: string, password:string){
    const authData: LoginData = {email:email, password: password};
    this.http
    .post<{ token: string; expiresIn: number; userId: string, userRole:number}>(
      BACKEND_URL + "/login",
      authData
    )
    .subscribe(
      response => {
        const token = response.token;
        this.token = token;
        const role = response.userRole;
        this.role = role;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
        
            if(role == 0){ 
              this.isUser = true;
              this.userStatusListener.next(true);
              
            }
            else{          
                this.isAdmin = true;
                this.adminStatusListener.next(true);
                
              }
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, role);
          if(this.isUser){
            this.router.navigate(["/"]);
          }
          else{ 
            if(this.isAdmin){
            this.router.navigate(["/users"]);
            }
          }
        }
      },
      error => {
        this.authStatusListener.next(false);
        this.adminStatusListener.next(false);
        this.userStatusListener.next(false);
      }
    );
}

autoAuthUser() {
  const authInformation = this.getAuthData();
  if (!authInformation) {
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn > 0) {
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.role = +authInformation.role;
    if(this.role == 0){
      this.isUser = true;
      this.userStatusListener.next(true);
    } 
    else{
      this.isAdmin = true;
      this.adminStatusListener.next(true);
    }
    this.userId = authInformation.userId;
    this.setAuthTimer(expiresIn / 1000);
    this.authStatusListener.next(true);
  }
}

logout() {
  this.token = null;
  this.role = null;
  this.isAuthenticated = false;
  this.isAdmin = false;
  this.isUser = false;
  this.authStatusListener.next(false);
  this.userStatusListener.next(false);
  this.adminStatusListener.next(false);
  this.userId = null;
  clearTimeout(this.tokenTimer);
  this.clearAuthData();
  this.router.navigate(["/"]);
}

private setAuthTimer(duration: number) {
  console.log("Setting timer: " + duration);
  this.tokenTimer = setTimeout(() => {
    this.logout();
  }, duration * 1000);
}

private saveAuthData(token: string, expirationDate: Date, userId: string, role:number) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirationDate.toISOString());
  localStorage.setItem("userId", userId);
  localStorage.setItem("role", role.toString());
}

private clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
}

private getAuthData() {
  const token = localStorage.getItem("token");
  const expirationDate = localStorage.getItem("expiration");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  if (!token || !expirationDate) {
    return;
  }
  return {
    token: token,
    expirationDate: new Date(expirationDate),
    userId: userId,
    role:role
  };
}
}
