import { CustomerService } from './../customer-management/service/customer.service';
import { Component } from '@angular/core';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { CustomizationService } from './service/customization.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal.component';

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
  },
  actions: {
    add: false,
    view: true
  }
}

 constructor(
  private _customizationService : CustomizationService,
  private dialog: MatDialog
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
          if(!res.success) return;
          this.tableData = (res?.data || []).map((item: any, index: number) => ({
          fullName: item.fullName || '-',
          email: item.email || '-',
          phone: item.phone || '-',
          technology: item.technology || '-',
          budget: item.budget || '-',
          timeline: item.timeline || '-',
          status: item.status || '-',
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          id: index + 1, // running index
          _id: item._id // keep the original id for reference
          }));
        this.isLoading = false;
        // this.tableData = res?.data || [];
        this.totalCount = res?.total || 0;
      },
      error:(err)=>{
        this.isLoading = false;
        console.log(err)
      }
    });
  }


  tableEvent(env:any){
    switch (env?.type) {
      case 'apievent':
        this.getcustomization(env?.event);
        break;
      case 'view':
        this.viewDetails(env?.event._id);
        break;

      default:
        break;
    }
  }


  viewDetails(id:string){
    console.log('View details for ID:', id);
    // Implement your logic to view details here
    this._customizationService.getCustomizationById(id).subscribe({
      next:(res:any)=>{
        console.log('Customization Details:', res);
        if(!res.success) return;

        const dialogRef = this.dialog.open(DynamicModalComponent, {
          width: '800px',
          data: res.data
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Updated Data:', result);
          }
        });
      },
      error:(err)=>{
        console.log('Error fetching details:', err);
      }
    })
  }
}
