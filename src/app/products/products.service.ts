import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Product } from "./product.model";

const BACKEND_URL = environment.apiUrl + "/product/";


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: Product[] = [];
  private productsUpdated = new Subject<{ products: Product[]; productCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(productsPerPage: number, currentPage: number, option='') {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: any; maxProducts: number }>(
        BACKEND_URL+ option + queryParams
      )
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(product => {
              return {
                name: product.name,
                category: product.category,
                id: product._id,
                imagePath: product.imagePath,
                owner_id: product.owner_id,
                status: product.status,
                descripition: product.descripition,
                buyed: product.buyed,
                buyer: product.buyer,
                price:product.price
              };
            }),
            maxProducts: productData.maxProducts
          };
        })
      )
      .subscribe(transformedProductData => {
        this.products = transformedProductData.products;
        this.productsUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts
        });
      });
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      category: string;
      status: string;
      imagePath: string;
      owner_id: string;
      descripition: string
      buyed: number;
      buyer: string;
      price: number;
    }>(BACKEND_URL + id);
  }

  addProduct(name: string, category: string, image: File, status:string, descripition: string, price:number) {
    const productData = new FormData();
    productData.append("name", name);
    productData.append("category", category);
    productData.append("image", image, name);
    productData.append("status", status);
    productData.append("descripition", descripition);
    productData.append("price", price.toString());
    this.http
      .post<{ message: string; product: Product }>(
        BACKEND_URL + 'add',
        productData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  deleteProduct(productId: string) {
    return this.http.delete(BACKEND_URL + productId);
  }

  buyProduct(productId: string){
    let buyedPost;
    this.getProduct(productId).subscribe(product => {
      buyedPost = product;
    });
    return this.http.put(BACKEND_URL+'buy/'+ productId, buyedPost);
  }
}
  
