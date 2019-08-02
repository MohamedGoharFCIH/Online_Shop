import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductsService } from "../products.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit {

  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  isAdmin = false;
  isUser = false;
  userId: string;
  private productsSub: Subscription;
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
    
    this.productsService.getProducts(this.productsPerPage, this.currentPage, '/productsmonitor');
    this.productsSub = this.productsService.getProductUpdateListener()
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
    this.productsService.getProducts(this.productsPerPage, this.currentPage, '/productsmonitor');
  }
  
  onBuy(productId: string) {
    this.isLoading = true;
    this.productsService.buyProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerPage, this.currentPage, '/productsmonitor');
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
   
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
    this.userStatusSub.unsubscribe();
    this.productsSub.unsubscribe();
  }


}
