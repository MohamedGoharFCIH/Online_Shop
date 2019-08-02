import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { ProductAddComponent } from './products/product-add/product-add.component';
import { ProductShowComponent } from './products/product-show/product-show.component';
import { MyProductsComponent } from './products/my-products/my-products.component';
import { MyPurchasesComponent } from './products/my-purchases/my-purchases.component';
import { ProductAdminComponent } from './products/product-admin/product-admin.component';
import { AdminGuard } from './auth/admin.guard';
import { UserGuard } from './auth/user.guard';



const routes: Routes = [
  { path: "users", component: UserListComponent, canActivate:[AdminGuard] },
  { path: "create", component: ProductAddComponent, canActivate:[UserGuard]},
  { path: "myproducts", component: MyProductsComponent, canActivate:[UserGuard]},
  { path: "", component: ProductShowComponent },
  { path: "mypurchases", component: MyPurchasesComponent, canActivate:[UserGuard]},
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
  { path: "products", component: ProductAdminComponent, canActivate:[AdminGuard]},
  { path: "**", component: ProductShowComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AdminGuard, UserGuard]
})
export class AppRoutingModule { }
