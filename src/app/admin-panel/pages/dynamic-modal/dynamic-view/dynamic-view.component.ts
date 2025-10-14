import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dynamic-view',
  standalone: true,
  imports: [MatIconModule , MatDialogModule , CommonModule , ReactiveFormsModule],
  templateUrl: './dynamic-view.component.html',
  styleUrl: './dynamic-view.component.scss'
})
export class DynamicViewComponent {
 @Input() data: any;
  @Input() isNested: boolean = false;

  keys: string[] = [];
  hiddenKeys = ['__v', '_id', 'updatedAt', 'createdAt' , 'userId'];

  ngOnInit(): void {
    if (!this.data) {
      this.keys = [];
      return;
    }
    // keep original key order (if needed) or sort as required
    this.keys = Object.keys(this.data);
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  isNumber(val: any): boolean {
    return typeof val === 'number';
  }

  isLongString(val: any, threshold = 60): boolean {
    return this.isString(val) && (val as string).length > threshold;
  }

  // Determine if array contains objects (for rendering)
  arrayIsObject(arr: any[]): boolean {
    return Array.isArray(arr) && arr.length > 0 && this.isObject(arr[0]);
  }


}
