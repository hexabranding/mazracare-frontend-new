import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CategoryListComponent } from "./product-category/category-list/category-list.component";
import { ServiceListComponent } from './product-services/service-list/service-list.component';

@Component({
  selector: 'app-service-category',
  standalone: true,
  imports: [MatTabsModule, CategoryListComponent, ServiceListComponent],
  templateUrl: './service-category.component.html',
  styleUrl: './service-category.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ServiceCategoryComponent {


  selectedIndex = 0;

  selectTab(index: number) {
    this.selectedIndex = index;
  }

}
