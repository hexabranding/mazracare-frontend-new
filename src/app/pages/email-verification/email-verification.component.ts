import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { EmailService } from './service/email.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {
 private fb = inject(FormBuilder);
  // @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  private getOtpInputElement(index: number): HTMLInputElement | null {
  const inputs = document.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;
  return inputs[index] ?? null;
}

constructor(private emailService: EmailService , private router: Router ) { }

  emailVerifyForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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
      this.emailVerifyForm.get(`otp${index}`)?.setValue(value.charAt(0));
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
    if (this.emailVerifyForm.invalid) {
      this.emailVerifyForm.markAllAsTouched();
      return;
    }

    const otp = Array.from({ length: 6 }, (_, i) => this.emailVerifyForm.get(`otp${i}`)?.value).join('');
    const payload = {
      email: this.emailVerifyForm.get('email')?.value,
      password: this.emailVerifyForm.get('password')?.value,
      otp: otp
    };
    console.log('Payload:', payload);

    // Here you can handle the form submission, e.g., send data to a server
    // For demonstration, we'll just log the payload
    this.emailService.verifyEmail(payload).subscribe((res:any) => {
      console.log('Email verification successful', res);
      // Navigate to the next page or show a success message
      Swal.fire({
        title: 'Email Verified',
        text: res.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.router.navigate(['/login']);
    }, error => {
      Swal.fire({
        title: 'Verification Failed',
        text: error?.error?.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error('Email verification failed', error);
    });



  }
}
