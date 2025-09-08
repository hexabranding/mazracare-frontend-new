import { ResetPasswordService } from './service/reset-password.service';
import { Component, inject, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
 private fb = inject(FormBuilder);
  // @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  private getOtpInputElement(index: number): HTMLInputElement | null {
  const inputs = document.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;
  return inputs[index] ?? null;
}

constructor(private ResetService: ResetPasswordService , private router: Router ) { }

  resetForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
    otp0: ['', Validators.required],
    otp1: ['', Validators.required],
    otp2: ['', Validators.required],
    otp3: ['', Validators.required],
    otp4: ['', Validators.required],
    otp5: ['', Validators.required]
  });

  get otpControls() {
    return Array(6);
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Allow only digits

    // Manually update the form control value to just 1 digit
    if (value.length > 1) {
      input.value = value.charAt(0);
      this.resetForm.get(`otp${index}`)?.setValue(value.charAt(0));
    }

    if (value.length === 1 && index < 5) {
      const nextInput = this.getOtpInputElement(index + 1);
      nextInput?.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.getOtpInputElement(index - 1);
      prevInput?.focus();
    }

    if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }


  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const otp = Array.from({ length: 6 }, (_, i) => this.resetForm.get(`otp${i}`)?.value).join('');
    const payload = {
      email: this.resetForm.get('email')?.value,
      newPassword: this.resetForm.get('password')?.value,
      otp
    };


    this.ResetService.resetPassword(payload).subscribe(
      (res:any) => {
        Swal.fire({
          title: 'Password Reset Successful',
          text: res.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Handle success, e.g., navigate to login page or show a success message
        this.router.navigate(['/login']);
      },
      (error) => {
        Swal.fire({
          title: 'Password Reset Failed',
          text: error?.error?.message ,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        // Handle error, e.g., show a notification
      }
    );
  }
}
