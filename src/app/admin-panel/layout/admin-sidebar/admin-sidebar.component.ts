import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [NgClass, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'], // <-- fixed typo
  encapsulation: ViewEncapsulation.None
})
export class AdminSidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    { icon: 'fas fa-home', label: 'Dashboard', route: '/admin-panel/dashboard', isOpen: false },
    { icon: 'fas fa-box', label: 'Products', route: '/admin-panel/products', isOpen: false },
    { icon: 'fa fa-shopping-cart', label: 'Order', route: '/admin-panel/order', isOpen: false },
    { icon: 'fa fa-users', label: 'Customers', route: '/admin-panel/customers', isOpen: false },
    { icon: 'fas fa-tools', label: 'Service / Category', route: '/admin-panel/service-category', isOpen: false },
    { icon: 'fas fa-money-bill-wave', label: 'Report / Payments', route: '/admin-panel/report-payments', isOpen: false },
    { icon: 'fa fa-book', label: 'Blog', route: '/admin-panel/blog', isOpen: false },
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(i: number) {
    if (this.isSidebarCollapsed) {
      return; // If collapsed, don't toggle submenus
    }

    this.menuItems.forEach((item, index) => {
      if (index === i) {
        item.isOpen = !item.isOpen; // toggle clicked
      } else {
        item.isOpen = false; // close others
      }
    });
  }
}

interface MenuItem {
  icon: string;
  label: string;
  isOpen?: boolean;
  children?: any[];
  route?: string;
}
