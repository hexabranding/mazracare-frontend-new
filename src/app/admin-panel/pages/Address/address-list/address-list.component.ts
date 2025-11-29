import { LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressModalComponent } from '../add-address-modal/add-address-modal.component';
import { get } from 'jquery';
import { AddressService } from '../service/address.service';
import Swal from 'sweetalert2';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address: string
  company: string;
  town: string;
  email: string;
  phone: string;
  country: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [ UpperCasePipe  ],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss'
})
export class AddressListComponent implements OnInit {

  addresses = signal<Address[]>([]);

  constructor( private fb: FormBuilder , private dialog: MatDialog , private addressService: AddressService) { }

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses() {
    this.addressService.getAddressList().subscribe({
      next: (addresses:any) => {
        // enum is id buut response is _id
        addresses.data = addresses.data.map(({_id, ...data}: any):
        Address => ({
            id: _id,
            ...data
          } as Address));
        this.addresses.set(addresses.data);

        console.log(this.addresses);

      },
      error: (err) => {
        console.error('Error fetching addresses', err);
      }
    });
  }




    removeAddress(id: string) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.addressService.deleteAddress(id).subscribe({
            next: (res:any) => {
              console.log('Address deleted successfully', res);
              if(res.success){
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'Your address has been deleted.',
                  timer: 2000,
                  showConfirmButton: false
                });
              }

              this.getAddresses();
            },
            error: (err) => {
              console.error('Error deleting address', err);
            }
          });
        }
      });
    // if (confirm('Are you sure you want to delete this address?')) {
    //   this.addresses.update(list => list.filter(a => a.id !== id));
    // }
  }

  // id become string
  setAsDefault(id: string) {
    this.addressService.setDefaultAddress(id).subscribe({
      next: (res:any) => {
        console.log(res);
        this.getAddresses();
      },
      error: (err:any) => {
        console.error('Error setting default address', err);
      }
    });
  }

  openAddAddressModal() {
    // Logic to open modal goes here
    const dialogRef = this.dialog.open(AddAddressModalComponent, {
      width: '500px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New Address:', result);
        // Add the new address to the list
        // this.addresses.update(list => [...list, result]);
        this.getAddresses();
      }
    });

  }


}
