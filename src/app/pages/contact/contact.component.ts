import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactService } from './service/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.contactService.submitContactForm(this.contactForm.value).subscribe({
        next: (res: any) => {
          console.log('Form submitted successfully', res);
          Swal.fire({
            title: 'Success',
            text: 'Thanks for sharing the details,our team will get in touch with you soon',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.contactForm.reset();
        },
        error: (err) => {
          console.error('Error submitting form', err);
          Swal.fire({
            title: 'Error',
            text: err?.error.error,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
