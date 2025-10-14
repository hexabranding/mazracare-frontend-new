import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from './service/order.service';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent {
 tableConfig = {
     title: 'Order List',
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
     price: {
       title: 'Price',
       type: 'string',
     },
    paymentStatus: {
      title: 'Payment Status',
      type: 'string',
    },
    paymentMethod: {
      title: 'Payment Method',
      type: 'string',
    },
     createdAt: {
       title: 'Created At',
       type: 'string',
     },
   },
   actions: {
      view: true,
    },
 }

  constructor(
   private _order : OrderService,
   private dialog: MatDialog
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
     this._order.orderlist(params ?? defparams).subscribe({
       next:(res:any)=>{
          if(!res.success) return;
        this.tableData = (res?.data || []).map((item: any, index: number) => ({
          username: item.user?.username || '-',
          email: item.user?.email || '-',
          role: item.userId?.role || '-',
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          price: item.totalPrice || '-',
          paymentStatus: item.paymentStatus || '-',
          paymentMethod: item.paymentMethod || '-',
          id: index + 1, // running index
          _id: item._id // keep the original id for reference
        }));
        //  this.tableData = response?.data;
         this.totalCount = res?.total;
         this.isLoading = false;
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
        this.getProducts(env?.event)
        break;
      case 'view':
        this.viewDetails(env?.event._id);
        break;
      default:
        break;
    }
   }

  viewDetails(id: string) {
    this._order.getOrderById(id).subscribe({
      next: (res: any) => {
        if (!res.success) return;

        const dialogRef = this.dialog.open(DynamicModalComponent, {
          width: '800px',
          data: res.data
        });

        dialogRef.afterClosed().subscribe((result:any) => {
          if (result) {
            console.log('Updated Data:', result);
          }
        });
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
