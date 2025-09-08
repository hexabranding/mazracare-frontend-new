import { Component, ViewEncapsulation } from '@angular/core';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { NgClass } from '@angular/common';
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [AdminSidebarComponent, NgClass, RouterOutlet],
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AdminViewComponent {
  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
