import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductsService } from "../products.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit , OnDestroy {

  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 3, 6, 9];
  userIsAuthenticated = false;
  isAdmin = false;
  isUser = false;
  userId: string;
  private userProductsSub: Subscription;
  private authStatusSub: Subscription;
  private adminStatusSub: Subscription;
  private userStatusSub: Subscription;


  constructor(
    public productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

      this.isAdmin = this.authService.getIsAdmin();
      this.adminStatusSub = this.authService.getAdminStatusListener()
      .subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        this.userId = this.authService.getUserId();
      });

      this.isUser = this.authService.getIsUser();
      this.userStatusSub = this.authService.getUserStatusListener()
      .subscribe(isUser => {
        this.isUser = isUser;
        this.userId = this.authService.getUserId();
     
      });
    
    this.productsService.getProducts(this.productsPerPage, this.currentPage, 'products/');
    this.userProductsSub = this.productsService.getProductUpdateListener()
    .subscribe((productData: { products: Product[]; productCount: number }) => {
      this.isLoading = false;
      this.totalProducts = productData.productCount;
      this.products = productData.products;
    });  
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage, 'products/');
  }


  ngOnDestroy() {
   
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
    this.userStatusSub.unsubscribe();
    this.userProductsSub.unsubscribe();
  }


}
