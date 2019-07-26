import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';


const routes: Routes = [
  { path: "users", component: UserListComponent },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
