import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule , CommonModule],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss'
})
export class CareerComponent implements OnInit{
 applicationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      currentCity: ['', Validators.required],
      position: ['', Validators.required],
      education: ['', Validators.required],
      experience: ['', Validators.required],
      expDetails: [''],
      skills: [''],
      workOutdoor: ['', Validators.required],
      physicallyFit: ['', Validators.required],
      drivingLicense: ['', Validators.required],
      languages: [[], Validators.required],
      joinWhen: ['', Validators.required],
      relocate: ['', Validators.required],
      accommodation: ['', Validators.required],
      shifts: ['', Validators.required],
      salary: ['', [Validators.min(0)]],
      emergencyName: ['', Validators.required],
      emergencyPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      enjoyFarming: ['', Validators.required],
      dedication: [''],
      questions: [''],
      jobRole: [''],
      ugPercentage: ['', [Validators.min(0), Validators.max(100)]],
      vacationYears: ['', Validators.min(0)],
      settleFamily: ['', Validators.required],
      familyMembers: ['', Validators.min(0)],
      familyIncome: ['', Validators.min(0)],
      familyAgri: ['', Validators.required],
      whyAgri: [''],
      sustainableLiving: [''],
      workYears: ['', Validators.min(0)],
      stayYears: ['', Validators.min(0)],
      cv: [null]
    });

    // Enable expDetails only if experience is "Yes"
    this.applicationForm.get('experience')?.valueChanges.subscribe(value => {
      const expDetails = this.applicationForm.get('expDetails');
      if (value === 'Yes') {
        expDetails?.setValidators(Validators.required);
      } else {
        expDetails?.clearValidators();
      }
      expDetails?.updateValueAndValidity();
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.applicationForm.patchValue({ cv: file });
  }

  onSubmit() {
    if (this.applicationForm.valid) {
      console.log('Form Submitted:', this.applicationForm.value);
      alert('Application submitted successfully!');
    } else {
      this.applicationForm.markAllAsTouched();
    }
  }
}
