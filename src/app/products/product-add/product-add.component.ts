import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ProductsService } from "../products.service";
import { Product } from "../product.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit, OnDestroy {

  enteredName = "";
  enteredCategory = "";
  enteredStatus = "";
  enteredDescripition = "";
  enteredPrice= "";
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview;
  private productId: string;
  userIsAuthenticated = false;
  isAdmin = false;
  isUser = false;
  private authStatusSub: Subscription;
  private adminStatusSub: Subscription;
  private userStatusSub: Subscription;

  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
        
      });

      this.isAdmin = this.authService.getIsAdmin();
      this.adminStatusSub = this.authService.getAdminStatusListener()
      .subscribe(isAdmin => {
        this.isLoading = false;
        this.isAdmin = isAdmin;
      });

      this.isUser = this.authService.getIsUser();
      this.userStatusSub = this.authService.getUserStatusListener()
      .subscribe(isUser => {
        this.isLoading = false;
        this.isUser = isUser;
      });
      .3366
      
      this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      category: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      status: new FormControl(null, {validators: [Validators.required] }),
      descripition: new FormControl(),
      price: new FormControl(null, {validators: [Validators.required, Validators.min(1)] })

    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.productsService.addProduct(
      this.form.value.name,
      this.form.value.category,
      this.form.value.image,
      this.form.value.status,
      this.form.value.descripition,
      this.form.value.price
      );
      this.form.reset();
    }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.userStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
  }

}
