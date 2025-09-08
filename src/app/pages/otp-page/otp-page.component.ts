import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-otp-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './otp-page.component.html',
  styleUrl: './otp-page.component.scss'
})
export class OtpPageComponent {
  constructor(    private router: Router,
public dialogRef: MatDialogRef<OtpPageComponent>) {}


   submitOtp() {
    console.log("OTP submitted");
    this.dialogRef.close();   // close the modal
    this.router.navigate(['/login']); // navigate to login
  }
}
