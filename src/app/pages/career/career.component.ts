import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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

  constructor(private fb: FormBuilder, private _careerService: CareerService , private router: Router) { }

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
      experience: ['', [Validators.min(1), Validators.required]],
      skills: [''],
      message: [''],   // ✅ custom message field
      cv: [null , [Validators.required]]
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

      formData.append('fullName', this.applicationForm.get('fullName')?.value);
      formData.append('email', this.applicationForm.get('email')?.value);
      formData.append('phone', this.applicationForm.get('mobile')?.value);
      formData.append('position', this.applicationForm.get('position')?.value);
      formData.append('experience', this.applicationForm.get('experience')?.value);
      formData.append('skills', this.applicationForm.get('skills')?.value || '');
      formData.append('message', this.applicationForm.get('message')?.value || '');
      formData.append('resume', this.applicationForm.get('cv')?.value);


      this._careerService.AddCareer(formData).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res?.message || 'Application Submitted',
            text: 'Your application has been submitted successfully!'
          });
          this.applicationForm.reset();
          this.router.navigate(['/about']);
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
