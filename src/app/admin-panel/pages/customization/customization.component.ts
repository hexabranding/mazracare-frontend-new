import { CustomerService } from './../customer-management/service/customer.service';
import { Component } from '@angular/core';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { CustomizationService } from './service/customization.service';

@Component({
  selector: 'app-customization',
  standalone: true,
  imports: [CommonModule , DataTableComponent],
  templateUrl: './customization.component.html',
  styleUrl: './customization.component.scss'
})
export class CustomizationComponent {
  tableConfig = {
    title: 'Customization List',
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
    fullName: {
      title: 'Name',
      type: 'string',
    },
    email: {
      title: 'Email',
      type: 'string',
    },
    phone: {
      title: 'Phone',
      type: 'string',
    },
    technology: {
      title: 'Technology',
      type: 'string',
    },
    budget: {
      title: 'Budget',
      type: 'string',
    },
    timeline: {
      title: 'Timeline',
      type: 'string',
    },
    status: {
      title: 'Status',
      type: 'string',
    },
    createdAt: {
      title: 'Created At',
      type: 'string',
    },
  }
}

 constructor(
  private _customizationService : CustomizationService
 ){}

  ngOnInit(): void {
    console.log('Admin Products Component Initialized');

    this.getcustomization();
  }

  getcustomization(params?:any) {
    this.isLoading = true;
    const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    this._customizationService.customizationList(params ?? defparams).subscribe({
      next:(res:any)=>{
        this.isLoading = false;
        this.tableData = res?.data || [];
        this.totalCount = res?.total || 0;
      },
      error:(err)=>{
        this.isLoading = false;
        console.log(err)
      }
    });
  }


  tableEvent(env:any){
    if(env?.type === 'apievent'){
      this.getcustomization(env?.event)
    }
  }
}
