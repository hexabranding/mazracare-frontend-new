import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddressService } from '../service/address.service';
import Swal from 'sweetalert2';
import e from 'express';
import { CommonModule } from '@angular/common';

interface Address {
  id: number;
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
  selector: 'app-add-address-modal',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './add-address-modal.component.html',
  styleUrl: './add-address-modal.component.scss'
})
export class AddAddressModalComponent {

  constructor( private fb: FormBuilder , private dialogRef: MatDialogRef<AddAddressModalComponent> , private addressService: AddressService) { }

    addressForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]+$') , Validators.minLength(10), Validators.maxLength(15)]],
    email: ['', [Validators.required, Validators.email]],
    street: ['', Validators.required],
    town: ['', Validators.required],
    company : ['', Validators.required],
    // zip: ['', Validators.required],
    country: ['UAE', Validators.required],
    isDefault: [false]
  });

    isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

    saveAddress() {
      console.log(this.addressForm.value);

    if (this.addressForm.valid) {
      const formVal = this.addressForm.value;
      const newAddress: Address = {
        id: Date.now(),
        firstName: formVal.name,
        lastName: formVal.lastName,
        address: formVal.street,
        town: formVal.town,
        // state: formVal.state,
        // zip: formVal.zip,
        country: formVal.country,
        company: formVal.company,
        email: formVal.email,
        phone: formVal.phone,
        isDefault: formVal.isDefault
      };


      this.addressService.addAddress(newAddress).subscribe({
        next: (res:any) => {
          console.log('Address added successfully', res);
          if(res.success){
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Address added successfully',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(res); // Close modal and return new address
          }
        },
        error: (err) => {
          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.message ,
          });
          console.error('Error adding address', err);
        }
      });

      // this.addresses.update(current => {
      //   let updated = [...current];

      //   // If new address is default, unset others
      //   if (newAddress.isDefault) {
      //     updated = updated.map(a => ({ ...a, isDefault: false }));
      //     // Add to beginning if default
      //     return [newAddress, ...updated];
      //   }

      //   return [...updated, newAddress];
      // });


    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  closeModal() {
    // Logic to close modal goes here
    this.dialogRef.close();
  }

}
