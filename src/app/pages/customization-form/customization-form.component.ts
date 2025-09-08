import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-customization-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './customization-form.component.html',
  styleUrl: './customization-form.component.scss'
})
export class CustomizationFormComponent implements OnInit {
  enquiryForm!: FormGroup;
  emirates = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

  spaceTypes = [
    { key: 'indoor', label: 'Indoor' }, { key: 'outdoor', label: 'Outdoor' }, { key: 'terrace', label: 'Terrace' }, { key: 'balcony', label: 'Balcony' }, { key: 'backyard', label: 'Backyard' }, { key: 'frontyard', label: 'Frontyard' }, { key: 'rooftop', label: 'Rooftop' }, { key: 'empty', label: 'Empty Plot / Land' }
  ];
  purposeOptions = [
    { key: 'home', label: 'Home Use (Family Consumption)' }, { key: 'commercial', label: 'Commercial Selling' }, { key: 'edu', label: 'Educational / Training' }, { key: 'csr', label: 'Corporate Sustainability / CSR' }, { key: 'rnd', label: 'Research & Development' }, { key: 'restaurant', label: 'Restaurant / Café Use' }, { key: 'school', label: 'School / University Project' }
  ];
  technologies = [
    { key: 'hydroponics', label: 'Hydroponics' }, { key: 'aquaponics', label: 'Aquaponics' }, { key: 'aeroponics', label: 'Aeroponics' }, { key: 'soil', label: 'Organic Soil-based' }, { key: 'not-sure', label: 'Not Sure / Need Guidance' }
  ];
  greenhouseOptions = [
    { key: 'yes', label: 'Yes' }, { key: 'no', label: 'No' }, { key: 'not-sure', label: 'Not Sure' }
  ];
  additionalServices = [
    { key: 'amc', label: 'AMC (Annual Maintenance Contract)' }, { key: 'harvest', label: 'Harvesting & Support' }, { key: 'sales', label: 'Sales & Marketing Assistance' }, { key: 'training', label: 'Training & Workshops' }, { key: 'supply', label: 'Nutrient & Equipment Supply' }, { key: 'iot', label: 'IoT / Mobile App Monitoring' }
  ];


  // some UI state
  otherSiteChecked = false;
  otherPurposeChecked = false;
  serviceOtherChecked = false;


  constructor(private fb: FormBuilder) { }


  ngOnInit() {
    this.enquiryForm = this.fb.group({
      fullName: ['', Validators.required],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      location: [''],
      siteTypes: [[]],
      siteTypeOther: [''],
      spaceType: [''],
      siteArea: [''],
      siteAreaCustom: [''],
      files: [null],
      purpose: [[]],
      purposeOther: [''],
      technology: [''],
      waterAvailable: [''],
      waterType: [''],
      electricityAvailable: [''],
      powerBackup: [''],
      greenhouseRequired: [''],
      budget: [''],
      timeline: [''],
      additionalServices: [[]],
      serviceOther: [''],
      message: [''],
      crops: [[]],
      customCrop: ['']
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


  toggleSiteType(event: any) {
    const val = event.target.value;
    const checked = event.target.checked;
    const arr = this.enquiryForm.get('siteTypes')?.value || [];
    if (checked) arr.push(val);
    else this.enquiryForm.get('siteTypes')?.setValue(arr.filter((x: any) => x !== val));


    // simple UI state for "Other"
    if (event.target.id === 'site-other') this.otherSiteChecked = checked;
  }


  togglePurpose(event: any) {
    const val = event.target.value;
    const checked = event.target.checked;
    const arr = this.enquiryForm.get('purpose')?.value || [];
    if (checked) arr.push(val);
    else this.enquiryForm.get('purpose')?.setValue(arr.filter((x: any) => x !== val));
    if (event.target.id === 'purpose-other') this.otherPurposeChecked = checked;
  }


  toggleService(event: any) {
    const val = event.target.value;
    const checked = event.target.checked;
    const arr = this.enquiryForm.get('additionalServices')?.value || [];
    if (checked) arr.push(val);
    else this.enquiryForm.get('additionalServices')?.setValue(arr.filter((x: any) => x !== val));
    if (event.target.id === 'svc-other') this.serviceOtherChecked = checked;
  }


  onFilesSelected(e: any) {
    const files = e.target.files;
    this.enquiryForm.get('files')?.setValue(files);
  }

  onSubmit() {
    if (this.enquiryForm.invalid) return;
    // send to API or emit
    console.log(this.enquiryForm.value);
  }

}
