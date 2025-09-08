import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { CustomerService } from './service/customer.service';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent {
  tableConfig = {
    title: 'Customer List',
  }
  totalCount!:number;
  tableData:any[]=[];
  isLoading:boolean=false;
  
  tableSettings = {
  columns: {
    id: {
      title: '#',
      type: 'id',
    },
    username: {
      title: 'Name',
      type: 'string',
    },
    email: {
      title: 'Email',
      type: 'string',
    },
    role: {
      title: 'Role',
      type: 'string',
    },
    createdAt: {
      title: 'Created At',
      type: 'string',
    },
  }
}
 
 constructor(
  private _customer : CustomerService
 ){}

  ngOnInit(): void {
    console.log('Admin Products Component Initialized');
    
    this.getProducts();
  }

  getProducts(params?:any) {
    this.isLoading = true;
    const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    this._customer.customerlist(params ?? defparams).subscribe(
      (response:any) => {
        this.tableData = response?.data;
        this.totalCount = response?.total;
        this.isLoading = false;
      }
    );
  }


  tableEvent(env:any){
    if(env?.type === 'apievent'){
      this.getProducts(env?.event)
    }
  }
}
