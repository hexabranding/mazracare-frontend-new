import { Injectable } from '@angular/core';
import { SnackbarComponent } from '../../core/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private snackBar: MatSnackBar) { }

  // snackbar success/error messages
  customSnackBar(message: string, type: string, status: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        type: type,
        status: status
      },
      duration: 500000,
    });
  }
}
