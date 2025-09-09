import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductDetailsService } from '../service/product-details.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customize-popup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './customize-popup.component.html',
  styleUrl: './customize-popup.component.scss'
})
export class CustomizePopupComponent implements OnInit {
  enquiryForm!: FormGroup;
  constructor(private fb: FormBuilder,private dialogRef: MatDialogRef<CustomizePopupComponent> , private _productDetails: ProductDetailsService) { }

  ngOnInit() {
    this.enquiryForm = this.fb.group({
      crops: [[]],
      customCrop: [''],
      width: [null, [Validators.required, Validators.min(1)]],
      height: [null, [Validators.required, Validators.min(1)]],
    });
  }


  crops = {
    leafyGreens: ['Lettuce', 'Butterhead', 'Romaine', 'Iceberg', 'Kale', 'Spinach', 'Arugula', 'Swiss Chard', 'Mustard Greens', 'Pak Choi / Bok Choy', 'Collard Greens', 'Watercress'],
    herbs: ['Basil (Italian, Thai)', 'Mint', 'Coriander / Cilantro', 'Parsley', 'Dill', 'Thyme', 'Rosemary', 'Oregano', 'Chives', 'Sage', 'Lemongrass'],
    fruitingVegetables: ['Tomato (Cherry, Heirloom)', 'Bell Pepper / Capsicum', 'Chilli / Hot Pepper', 'Cucumber', 'Zucchini', 'Eggplant / Brinjal', 'Okra', 'Beans (Bush, Pole)'],
    flowers: ['Marigold', 'Rose', 'Gerbera', 'Orchids', 'Carnation', 'Chrysanthemum', 'Lavender', 'Jasmine', 'Tulip', 'Hibiscus'],
    fruits: ['Strawberry', 'Melon', 'Papaya', 'Blueberry / Raspberry', 'Banana', 'Fig'],
    microgreens: ['Sunflower', 'Radish', 'Broccoli Microgreens', 'Mustard', 'Beet', 'Wheatgrass', 'Amaranth', 'Pea Shoots', 'Kale Microgreens', 'Exotic Salad Mixes'],
    aquaponics: ['Tilapia', 'Catfish', 'Koi', 'Goldfish (ornamental)', 'Carp', 'Barramundi', 'Shrimp']
  };

  toggleCrop(event: any) {
    const selected = this.enquiryForm.get('crops')?.value || [];
    if (event.target.checked) {
      this.enquiryForm.get('crops')?.setValue([...selected, event.target.value]);
    } else {
      this.enquiryForm.get('crops')?.setValue(selected.filter((x: string) => x !== event.target.value));
    }
  }

  onSubmit() {
    if (this.enquiryForm.invalid) return;
    // send to API or emit
    console.log(this.enquiryForm.value);
    this.dialogRef.close(); // Close the dialog after submission
    this._productDetails.addProductDetailCustomize(this.enquiryForm.value).subscribe((res:any)=>{
      console.log(res);
      if(res && res.success){
        Swal.fire({
          title: 'Success',
          text: res.message || 'Your customization request has been submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    }, error => {
      console.error('Error submitting customization request:', error);
      Swal.fire({
        title: 'Error',
        text: error?.error?.message || 'Failed to submit your customization request. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }


onCloseDialog(): void {
    // 👉 Add any custom logic before closing
    console.log("Dialog close button clicked!");

    this.dialogRef.close(); // ✅ This will actually close the dialog
  }

}
