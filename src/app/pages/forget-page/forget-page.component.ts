import { ForgetService } from './service/forget.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpPageComponent } from '../otp-page/otp-page.component';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-forget-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatDialogModule , RouterModule],
  templateUrl: './forget-page.component.html',
  styleUrl: './forget-page.component.scss'
})
export class ForgetPageComponent {
  dialog = inject(MatDialog);

  loginForm: FormGroup;

  constructor(private fb: FormBuilder , private ForgetService: ForgetService , private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Submitted:', this.loginForm.value);
      //  You can call your API here to send reset link
      this.ForgetService.forgetPassword(this.loginForm.value).subscribe(
        (res:any) => {
          console.log('Reset link sent successfully', res);
          // Handle success, e.g., show a notification
          Swal.fire({
            title: res.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.router.navigate(['/reset-password'])
        },
        (error) => {
          console.error('Error sending reset link', error);
          // Handle error, e.g., show a notification
        }
      );
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
