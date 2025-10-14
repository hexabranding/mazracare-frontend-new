import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DynamicViewComponent } from './dynamic-view/dynamic-view.component';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [DynamicViewComponent],
  templateUrl: './dynamic-modal.component.html',
  styleUrl: './dynamic-modal.component.scss'
})
export class DynamicModalComponent {

   constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DynamicModalComponent>
  ) {}


  close() {
    this.dialogRef.close();
  }
}
