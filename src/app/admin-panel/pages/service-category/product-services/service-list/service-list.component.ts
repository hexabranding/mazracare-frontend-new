import { Component } from '@angular/core';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { ProductService } from '../../../../../pages/products/service/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ProductServicesService } from '../service/product-services.service';


@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent {
 tableConfig = {
    title: 'Service List',
    createButtonText: 'Add service',
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
      name: {
        title: 'Name',
        type: 'string',
      },
      // price: {
      //   title: 'Price',
      //   type: 'number',
      // },
      // stock: {
      //   title: 'Stock',
      //   type: 'number',
      // },
      // discountPercent: {
      //   title: 'Discount Percent',
      //   type: 'number',
      // },
      // category: {
      //   title: 'Category',
      //   type: 'string',
      // },
      // service: {
      //   title: 'Service',
      //   type: 'string',
      // },
    },
    actions: {
      add: false,
      edit: true,
      delete: true,
    },
  }

  constructor(
    private _router: Router,
    private productService: ProductServicesService,
    private _productService: ProductService,
  ) {}

  createProduct() {
    this._router.navigateByUrl('/admin-panel/service-category/add-service');
  }

  ngOnInit(): void {
    console.log('Admin Products Component Initialized');

    this.getServices();
  }


  getServices(params?:any) {
    this.isLoading = true;
    const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    this.productService.getServiceList(params ?? defparams).subscribe(
      (response:any) => {
        console.log(response);
        this.tableData = response?.data;
        this.totalCount = response?.data.length || 0 ;
        this.isLoading = false;
      },
      error => {
        // Handle HTTP error
        console.error('HTTP error while fetching products', error);
      }
    );
  }


  tableEvent(env:any){
    switch (env?.type) {
      case 'apievent':
        this.getServices(env?.event);
        break;

      case 'add':
        this.createProduct();
        break;

      case 'edit':
      this._router.navigate(['/admin-panel/service-category/add-service', env?.event?._id]);
        break;

      case 'delete':
        this.deleteProduct(env?.event?._id);
        break;

      default:
        break;
    }
  }

  deleteProduct(id:string){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      }).then(result => {
        if (result.isConfirmed) {
          this.productService.deleteService(id)
          .subscribe((res:any)=>{
            this.getServices();
            Swal.fire('Deleted!', res?.message, 'success');
          })
        }
      });
  }

}
