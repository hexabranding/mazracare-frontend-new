import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-products-new-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './products-new-form.component.html',
  styleUrl: './products-new-form.component.scss'
})
export class ProductsNewFormComponent implements OnInit {
  enquiryForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.enquiryForm = this.fb.group({
      crops: [[]],
      customCrop: [''],
      // existing controls...
      typeOfSpace: [''],  // Indoor / Outdoor etc.
      siteArea: [''],     // Site Area selection
      customSiteArea: [''], // Only if user picks "Custom"
      sitePhotos: [null], // File upload,
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
  onSiteAreaChange(area: string) {
    if (area !== 'Custom') {
      this.enquiryForm.get('customSiteArea')?.reset();
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.enquiryForm.patchValue({ sitePhotos: files });
    }
  }


  onSubmit() {
    if (this.enquiryForm.invalid) return;
    // send to API or emit
    console.log(this.enquiryForm.value);
  }
  onClose() { }

}
