import { Component } from '@angular/core';
import { ProductListCustomizationService } from './service/product-list-customization.service';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal.component';

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

  viewData = {
    crops: [],
    customCrop: "",
    typeOfSpace: '',
    siteArea: '',
    customSiteArea: null,
    sitePhotos: [],
    width: 0,
    height: 0
  }

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
  },
  actions: {
  add: false,
  edit: false,
  view: true,
  delete: false,
},
}

constructor( private _CustmizeService: ProductListCustomizationService , private dialog: MatDialog) {}

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
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        _id: item._id // keep the original id for reference
      }));
        this.totalCount = res?.total || 0;
      },
      error:(err)=>{
        this.isLoading = false;
        console.log(err)
      }
    })
}


tableEvent(env: any) {
  switch (env?.type) {
    case 'apievent':
      this.getcustomizationList(env?.event);
      break;
    case 'view':
      this.viewDetails(env?.event._id);
      break;

    default:
      break;
  }
}

viewDetails(event: any) {

  this._CustmizeService.getCustomizationById(event).subscribe({
    next: (res: any) => {

      if (!res.success) return;
      this.viewData = {
        crops: res?.data?.crops || [],
        customCrop: res?.data?.customCrop || '',
        typeOfSpace: res?.data?.typeOfSpace || '',
        siteArea: res?.data?.siteArea || '',
        customSiteArea: res?.data?.customSiteArea || null,
        sitePhotos: res?.data?.sitePhotos || [],
        width: res?.data?.width || 0,
        height: res?.data?.height || 0
      }
      console.log('View Data:', this.viewData);

      const dialogRef = this.dialog.open(DynamicModalComponent, {
        width: '600px',
        data: this.viewData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Updated Data:', result);
        }
      });
      // Here, you can open a modal or navigate to a detail page to show the customization details
    },
    error: (err) => {
      console.log('Error fetching customization details:', err);
    }
  });

}

}
