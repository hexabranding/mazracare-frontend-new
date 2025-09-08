import { CartService } from './../cart/service/cart.service';
import { CommonModule } from '@angular/common';
import { WishlistService } from './service/wishlist.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterModule , CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  wishlistItems: any[] = [];
  productId: string | null = null;

  constructor(private WishlistService: WishlistService , private cartService: CartService , private route: Router ) { }

  ngOnInit() {
    this.getWishList();
  }

  getWishList() {
    this.WishlistService.getWishlist().subscribe((res: any) => {
      console.log('Wishlist Items:', res);
      this.wishlistItems = res.data?.products ? res.data?.products : res.data;
      // Handle the wishlist items response
    }, error => {
      console.error('Error fetching wishlist items:', error);
    });
  }

  removeItem(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.WishlistService.removeItem(id).subscribe(() => {
          Swal.fire(
            'Removed!',
            'Your item has been removed from the wishlist.',
            'success'
          );
          this.getWishList(); // Refresh the wishlist
        }, error => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.message || 'Failed to remove item',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }

  clearWishlist() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.WishlistService.clearWishlist().subscribe(() => {
          Swal.fire(
            'Cleared!',
            'Your wishlist has been cleared.',
            'success'
          );
          this.getWishList(); // Refresh the wishlist
        }, error => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.message || 'Failed to clear wishlist',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }


  addToCart(id: string) {
    if(!localStorage.getItem('token')) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add items to your wishlist.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.route.navigate(['/login']);
        }
      })
    }else {
      this.cartService.addToCart({
        productId: id,
        quantity: 1
      }).subscribe((res: any) => {
        Swal.fire({
          title: 'Added to wishlist',
          text: res.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Optionally navigate to cart or refresh the cart items
        this.WishlistService.removeItem(id).subscribe(() => {
          this.getWishList(); // Refresh the wishlist
        })
        this.route.navigate(['/cart']);
      }, error => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.message || 'Failed to add product to wishlist',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    }
  }

}
