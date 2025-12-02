import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { CheckoutService } from './service/checkout.service';
import { AddressService } from '../../admin-panel/pages/Address/service/address.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule, CommonModule ,ReactiveFormsModule ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  productdetail:any = {
    productId: '',
    quantity: 1
  };

  // NEW: Variables for Address Change
  savedAddresses: any[] = [];
  showAddressModal: boolean = false;

  constructor(private fb: FormBuilder , private checkoutService: CheckoutService, private route:ActivatedRoute , private addressService: AddressService) {}

  ngOnInit(): void {
    this.initForm();
    // Optionally, you can fetch any initial data here
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      this.productdetail = params;
      console.log('Product Details:', this.productdetail);

      // You can pre-fill the form with query params if needed
    });

    this.getdefaultAddress()
    this.getAllAddresses(); // NEW: Fetch list on load
  }

  initForm(): void {
    this.checkoutForm = this.fb.group({
      // Billing
      country: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: [''],
      address: ['', Validators.required],
      apartment: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      createAccount: [false],

      // Payment
      nameOnCard: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(19)]],
      expiryDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      saveCard: [true]
    });
  }

  getdefaultAddress(){
    this.addressService.getDefaultAddress().subscribe({
      next: (res:any) => {
        console.log('Default Address:', res);
        if(res && res.data){
          const address = res.data;
          this.checkoutForm.patchValue({
            country: address.country || '',
            firstName: address.firstName || '',
            lastName: address.lastName || '',
            company: address.company || '',
            address: address.address || '',
            apartment: '',
            city: address.town || '',
            state: '',
            zip: '',
            email: address.email || '',
            phone: address.phone || ''
          });
        }
      },
      error: (err) => {
        console.error('Error fetching default address:', err);
      }
    });
  }

  getAllAddresses() {
    this.addressService.getAddressList().subscribe({ // Assuming method name is getAddress() or similar
      next: (res: any) => {
        // Adjust 'res.data' based on your actual API response structure
        this.savedAddresses = res.data || [];
      },
      error: (err) => console.error('Error fetching address list:', err)
    });
  }

  // ... getdefaultAddress() remains the same ...

  // NEW: Toggle Modal Visibility
  toggleAddressModal() {
    this.showAddressModal = !this.showAddressModal;
  }

  // NEW: Handle Address Selection
  selectAddress(address: any) {
    this.checkoutForm.patchValue({
      country: address.country || '',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address: address.address || '',
      apartment: '', // If your API has this, map it here
      city: address.town || '', // Mapping 'town' to 'city' based on your previous code
      state: address.state || '', // Assuming API returns state
      zip: address.pincode || '', // Assuming API returns pincode
      email: address.email || '',
      phone: address.phone || ''
    });

    this.showAddressModal = false; // Close modal

    Swal.fire({
      icon: 'success',
      title: 'Address Updated',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
  }

  // ... submitOrder, placeOrderFromCart, placeOrderDirectly, hasError remain the same ...


  submitOrder(): void {
    if (this.checkoutForm.valid) {
      console.log('Order Submitted', this.checkoutForm.value);
      let orderData: any
      if (this.productdetail.productId) {
        // If product details are provided, place a direct order
        orderData = {
          productId: this.productdetail.productId,
          quantity: this.productdetail.quantity,
          shippingAddress: {
            fullName: `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}`,
            country: this.checkoutForm.value.country,
            company: this.checkoutForm.value.company,
            email: this.checkoutForm.value.email,
            addressLine1: this.checkoutForm.value.address,
            addressLine2: this.checkoutForm.value.apartment,
            city: this.checkoutForm.value.city,
            state: this.checkoutForm.value.state,
            pincode: this.checkoutForm.value.zip,
            phone: this.checkoutForm.value.phone
          },
          paymentMethod: "CashOnDelivery"
        }
        this.placeOrderDirectly(orderData);
      } else {
        orderData = {
          shippingAddress: {
            fullName: `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}`,
            country: this.checkoutForm.value.country,
            company: this.checkoutForm.value.company,
            email: this.checkoutForm.value.email,
            addressLine1: this.checkoutForm.value.address,
            addressLine2: this.checkoutForm.value.apartment,
            city: this.checkoutForm.value.city,
            state: this.checkoutForm.value.state,
            pincode: this.checkoutForm.value.zip,
            phone: this.checkoutForm.value.phone
          },
          paymentMethod: "CashOnDelivery"
        }
        this.placeOrderFromCart(orderData);
      }
    } else {
      this.checkoutForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Form Invalid',
        text: 'Please fill all required fields correctly.',
        confirmButtonText: 'OK'
      });
    }
  }

  placeOrderFromCart(data:any){
      // Call the service to place the order
      this.checkoutService.placeOrderFromCart(data).subscribe({
        next: (res:any) => {
          console.log('Order placed successfully:', res);
          Swal.fire({
            icon: 'success',
            title: 'Order Placed!',
            text: res.message ,
            confirmButtonText: 'OK'
          });
        },
        error: (err) => {
          console.error('Error placing order:', err);
          Swal.fire({
            icon: 'error',
            title: 'Order Failed',
            text: err.error?.message,
            confirmButtonText: 'OK'
          });
        }
      });
  }

  placeOrderDirectly(data:any) {
     this.checkoutService.directOrder(data).subscribe({
          next: (res:any) => {
            console.log('Direct order placed successfully:', res);
            Swal.fire({
              icon: 'success',
              title: 'Order Placed!',
              text: res.message ,
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            console.error('Error placing direct order:', err);
            Swal.fire({
              icon: 'error',
              title: 'Order Failed',
              text: err.error?.message,
              confirmButtonText: 'OK'
            });
          }
        });
  }


  // helpers for template
  hasError(controlName: string, error: string) {
    return this.checkoutForm.get(controlName)?.hasError(error) && this.checkoutForm.get(controlName)?.touched;
  }
}
