import { LoginService } from './service/login.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../service/dataService/data.service';
import { NotifierModule, NotifierService } from 'angular-notifier';
import Swal from 'sweetalert2'
import { Router, RouterModule } from '@angular/router';


export interface login {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NotifierModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly notifier: NotifierService;
  loggedUser: any;

  constructor( private fb: FormBuilder, private LoginService: LoginService, notifierService: NotifierService , private router: Router) {
    this.notifier = notifierService;

  }

 loginForm = this.fb.group({
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ]),
  password: new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(15)
  ])
});


  ngOnInit(): void { }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      // Call the login service here
      // this.dataService.customSnackBar("Login successful", "success", "success");
      // this.router.navigate(['/dashboard']);
      this.LoginService.login(formData).subscribe(res => {
        this.saveUserData(res)
        if(this.loggedUser === 'Admin')
          this.router.navigate(['/admin-panel/dashboard']);
        else
          this.router.navigate(['/home']);
        Swal.fire({
          title: 'Login Successful',
          text: 'Welcome back!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }, error => {
        // Handle login error, e.g., show a notification
        // this.dataService.customSnackBar("Login failed", "error", "error");
        Swal.fire({
          title: 'Login Failed',
          text:   error?.error?.message || 'something went wrong, please try again.' ,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
}

 saveUserData(data:any){
    // data?.data?.language == 1 ? localStorage.setItem("lang", "en") : localStorage.setItem("lang", "du")
    // localStorage.setItem("user", JSON.stringify(data?.data))
    this.LoginService.setUser(data?.data);
    localStorage.setItem("token", data.token)
    this.loggedUser = data?.data?.role;
    localStorage.setItem("role", this.loggedUser)
    this.LoginService.islogin.next(true);
  }

    // Swal.fire("SweetAlert2 is working!");
}
