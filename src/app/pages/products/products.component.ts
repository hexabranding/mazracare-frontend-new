import { WishlistService } from './../wishlist/service/wishlist.service';
import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from './service/product.service';
import { CartService } from '../cart/service/cart.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ProductCategoryService } from '../../admin-panel/pages/service-category/product-category/service/product-category.service';
import { ProductsNewFormComponent } from './products-new-form/products-new-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  limit: number = 8; // how many products per page

  products: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: Router,
    private wishlistService: WishlistService,
    private _activatedRoute: ActivatedRoute,
    private categoryService: ProductCategoryService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // this._activatedRoute.params.subscribe((data: any) => {
    //   if (data?.id)
    //     this.getCategoryById(data?.id);
    // })


    this.getProductlist(this.currentPage);
  }

  getCategoryById(id: string) {
    this.categoryService.getProductsByCategoryId(id).subscribe((res: any) => {
      console.log(res);
      this.products = res.data;
    }, error => {
      console.error('Error fetching category by ID:', error);
    });
  }


  getProductlist(page: number):void {
    const defparams = {
        page : page,
        limit : this.limit,
        search : ''
    };
    this.productService.productlist(defparams).subscribe((res: any) => {
      console.log(res);
      this.products = res.data;
      this.currentPage = res.page;
      this.totalPages = res.pages;
      this.totalItems = res.total;
    }, error => {
      console.error('Error fetching product list:', error);
    });

    console.log('Product list fetched:', this.products);
  }

    onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.getProductlist(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  addToCart(id: string) {
    // Logic to add a product to the cart
    console.log('Add to cart clicked');
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to add this product to the cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.addToCart({
          productId: id,
          quantity: 1
        }).subscribe((res: any) => {
          console.log('Product added to cart:', res);
          Swal.fire({
            title: 'Added!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          // this.route.navigate(['/cart']);
        }, error => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }


  addToWishlist(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to add this product to the wishlist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.wishlistService.addToWishlist({
          productId: id
        }).subscribe((res: any) => {
          console.log('Product added to wishlist:', res);
          Swal.fire({
            title: 'Added!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }, error => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }


  addProductForm(){
     const dialogRef = this.dialog.open(ProductsNewFormComponent, {
          width: '600px',
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('User clicked Save');
          }
        });
  }
}
