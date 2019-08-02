import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAddComponent } from './product-add/product-add.component';
import { AngularMaterialModule } from "../angular-material.module"
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ProductShowComponent } from './product-show/product-show.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { MyPurchasesComponent } from './my-purchases/my-purchases.component';
import { ProductAdminComponent } from './product-admin/product-admin.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ],
  declarations: [ProductAddComponent, ProductShowComponent, MyProductsComponent, MyPurchasesComponent, ProductAdminComponent]
})
export class ProductsModule { }
