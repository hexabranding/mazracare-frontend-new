import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from './service/cart.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ CommonModule , RouterModule ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit  {

  cartItems: any[] = [];
  productId: string | null = null;
  quantity: number = 1;
  alldetails: any;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.getCartList();
  }

  getCartList() {
    // This method would typically call a service to fetch cart items
    // For now, we are just logging the cart items
    this.cartService.cartList().subscribe((res: any) => {
      console.log('Cart Items:', res);
      this.cartItems = res?.data?.items || [];
      this.alldetails = res.data;
       this.calculateTotal();
      // Handle the cart items response
    }, error => {
      Swal.fire({
        title: 'Error',
        text: error?.error?.message || 'Failed to fetch cart items',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      // Handle error, e.g., show a notification
      console.error('Error fetching cart items:', error);
    });
  }


increase(id:string , index: number) {
    if (this.cartItems[index].quantity < 99) {
      this.cartItems[index].quantity++;
      // this.calculateTotal();
      this.updateCartItemQuantity(id, index, 'increase')
    }
  }

  decrease(id:string , index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // this.calculateTotal();
      this.updateCartItemQuantity(id, index, 'increase')
    }
  }

  onInputChange(event: Event, index: number , id: string) {
    let qty = this.cartItems[index].quantity
    const value = Number((event.target as HTMLInputElement).value);
    this.cartItems[index].quantity = value >= 1 && value <= 99 ? value : 1;

    // this.calculateTotal();
    this.updateCartItemQuantity(id, index, qty)
  }

  calculateTotal() {
    let total = 0;
    this.cartItems.forEach(item => {
      total += item.quantity * item?.product?.discountedPrice;
    });
    this.alldetails.total = total;
  }

  updateCartItemQuantity(id: string, index: number, action: string) {
    const data = { quantity: this.cartItems[index].quantity };
   this.cartService.updateCartItemQuanity(id, data).subscribe({
      next: ((res:any) => {
      Swal.fire({
        title: 'Success',
        text: res?.message || 'Quantity updated successfully',
        icon: 'success',
        showCancelButton: false,
        timer: 2000,
      });
        this.calculateTotal();
      }),
      error: err => {

        if (action === 'increase') {
          this.cartItems[index].quantity--;
        } else if (action === 'decrease') {
          this.cartItems[index].quantity++;
        } else {
          this.cartItems[index].quantity = Number(action);
        }

        Swal.fire({
          title: 'Error',
          text: err?.error?.message || 'Failed to update quantity',
          icon: 'error',
          showCancelButton: false,
          timer: 2000,
        });
        console.error('Update failed:', err);
      }
    });
  }

  removeItem(id:string , index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to remove this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      console.log('Remove item confirmation:', result);

      if (result.isConfirmed) {
        this.removeItemFromCart(id , index);
      }
    });
  }

  removeItemFromCart(id:string , index: number) {
    // Call API to remove from backend (optional)
    this.cartService.removeItem(id).subscribe({
      next: () => {
        // Remove from UI
        Swal.fire(
          'Removed!',
          'Your item has been removed from the cart.',
          'success'
        );
        this.cartItems.splice(index, 1);
        this.calculateTotal();
      },
      error: err => {
        Swal.fire({
          title: 'Error',
          text: err?.error?.message ,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Remove failed:', err);
      }
    });
  }
}
