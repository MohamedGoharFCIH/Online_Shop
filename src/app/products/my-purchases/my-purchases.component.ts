import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductsService } from "../products.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css']
})
export class MyPurchasesComponent implements OnInit, OnDestroy {

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
  private purchasesSub: Subscription;
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
    
    this.productsService.getProducts(this.productsPerPage, this.currentPage, 'purchases/');
    this.purchasesSub = this.productsService.getProductUpdateListener()
    .subscribe((purchaseData: { products: Product[]; productCount: number }) => {
      this.isLoading = false;
      this.totalProducts = purchaseData.productCount;
      this.products = purchaseData.products;
    });  
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage, 'purchases/');
  }


  ngOnDestroy() {
   
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
    this.userStatusSub.unsubscribe();
    this.purchasesSub.unsubscribe();
  }


}
