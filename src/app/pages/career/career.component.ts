import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CareerService } from './service/career.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss'
})
export class CareerComponent implements OnInit {
  applicationForm!: FormGroup;

  constructor(private fb: FormBuilder, private _careerService: CareerService) { }

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?:\+9715[0-9]{8}|05[0-9]{8})$/)
        ]
      ],
      position: ['', Validators.required],
      experience: ['', [Validators.min(0)]],
      skills: [''],
      message: [''],   // ✅ custom message field
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
      const formData = new FormData();
      this._careerService.AddCareer(this.applicationForm.value).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res?.message || 'Application Submitted',
            text: 'Your application has been submitted successfully!'
          });
          this.applicationForm.reset();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'There was an error submitting your application. Please try again later.'
          });
        }
      })

    } else {
      this.applicationForm.markAllAsTouched();
    }
  }
}
