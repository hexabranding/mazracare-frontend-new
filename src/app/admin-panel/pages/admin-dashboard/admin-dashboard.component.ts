import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis
} from 'ng-apexcharts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgApexchartsModule,CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent {
 metrics = [
    { title: 'Total Sales', value: '$24,000' },
    { title: 'Total Orders', value: '350' },
    { title: 'Customers', value: '120' },
    { title: 'Revenue', value: '$18,500' },
  ];

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [4500, 6500, 8000, 5500, 7200, 9100, 10000]
    }
  ];

  chartOptions: ApexChart = {
    type: 'bar',
    height: 350,
    toolbar: { show: false }
  };

  xaxis: ApexXAxis = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  };

  chartColors: string[] = ['#007bff'];

  recentOrders = [
    { id: 'ORD101', customer: 'Alice', amount: 150.50, date: '2025-07-10' },
    { id: 'ORD102', customer: 'Bob', amount: 245.00, date: '2025-07-11' },
    { id: 'ORD103', customer: 'Charlie', amount: 95.20, date: '2025-07-12' },
  ];

}
