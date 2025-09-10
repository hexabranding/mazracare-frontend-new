import { Component } from '@angular/core';
import { ProductListCustomizationService } from './service/product-list-customization.service';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list-customization',
  standalone: true,
  imports: [CommonModule , DataTableComponent],
  templateUrl: './product-list-customization.component.html',
  styleUrl: './product-list-customization.component.scss'
})
export class ProductListCustomizationComponent {
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
    username: {
      title: 'Name',
      type: 'string'
    },
    userEmail: {
      title: 'Email',
      type: 'string',
    },
    siteArea: {
      title: 'Site area',
      type: 'string',
    },
    height: {
      title: 'Height',
      type: 'string',
    },
    width: {
      title: 'Width',
      type: 'string',
    },
    typeOfSpace: {
      title: 'Type of space',
      type: 'string',
    },
    createdAt: {
      title: 'Created At',
      type: 'string',
      valuePrepareFunction: (createdAt: string) => {
        return new Date(createdAt).toLocaleDateString();
      }
    },
  }
}

constructor( private _CustmizeService: ProductListCustomizationService) {}

ngOnInit(): void {
  this.getcustomizationList();
}


getcustomizationList(params?:any){
  this.isLoading = true;
     const defparams = {
        page : 1,
        limit : 10,
        search : ''
    };
    this._CustmizeService.proCustomizationList(defparams).subscribe({
      next:(res:any)=>{
        this.isLoading = false;
        // this.tableData = res?.data || [];
        this.tableData = (res?.data || []).map((item: any, index: number) => ({
        id: index + 1, // running index
        username: item.userId?.username || '-',
        userEmail: item.userId?.email || '-',
        siteArea: item.siteArea,
        height: item.height,
        width: item.width,
        typeOfSpace: item.typeOfSpace,
        createdAt: new Date(item.createdAt).toLocaleDateString()
      }));
        this.totalCount = res?.total || 0;
      },
      error:(err)=>{
        this.isLoading = false;
        console.log(err)
      }
    })
}


tableEvent(env:any){
  if(env?.type === 'apievent'){
    this.getcustomizationList(env?.event)
  }
}

}

