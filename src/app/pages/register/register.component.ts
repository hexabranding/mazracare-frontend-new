import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../service/dataService/data.service';
import { CommonModule } from '@angular/common';
import { RegisterService } from './service/register.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export interface register {
  username: FormControl<string | null>;
  lastname: FormControl<string | null>;
  // phone: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , HttpClientModule , RouterModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

constructor(private fb: FormBuilder , private router: Router , private registerService:RegisterService ) { }

  registerForm = this.fb.group<register>({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)])
  })

  ngOnInit(): void {}

  onSubmit() {
    this.registerForm.markAllAsTouched(); // Mark all fields as touched to show validation errors

    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Form Data:', formData);

      if (formData.password === formData.confirmPassword) {
        // Call the registration service here
        this.registerService.signup(formData).subscribe((res:any) => {
            console.log(res);
            Swal.fire({
              title: 'Registration Successful',
              text: res.message,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/email-verification']);
          }, error => {
            console.log(error);

            Swal.fire({
              title: 'Registration Failed',
              text: error?.error?.message || 'Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Registration failed', error);
            // Handle error, e.g., show a notification
          });
            // this.dataService.customSnackBar("Registration successful", "success", "success");
      } else {
        Swal.fire({
          title: 'Password Mismatch',
          text: 'The passwords do not match. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Invalid Form',
        text: 'Please fill out all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  }
