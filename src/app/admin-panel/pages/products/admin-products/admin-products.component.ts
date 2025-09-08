import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../pages/products/service/product.service';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AdminProductsComponent implements OnInit {

  tableConfig = {
    title: 'Product List',
    createButtonText: 'Add Product',
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
      price: {
        title: 'Price',
        type: 'number',
      },
      stock: {
        title: 'Stock',
        type: 'number',
      },
      discountPercent: {
        title: 'Discount Percent',
        type: 'number',
      },
      category: {
        title: 'Category',
        type: 'string',
      },
      service: {
        title: 'Service',
        type: 'string',
      },
    },
    actions: {
      add: false,
      edit: true,
      delete: true,
    },
  }

  constructor(
    private _router: Router,
    private _productService: ProductService,
  ) {}

  createProduct() {
    this._router.navigateByUrl('/admin-panel/products/add-products');
  }

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
    this._productService.productlist(params ?? defparams).subscribe(
      (response:any) => {
        console.log(response);
        this.tableData = response?.data;
        this.totalCount = response?.total;
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
        this.getProducts(env?.event);
        break;

      case 'add':
        this.createProduct();
        break;

      case 'edit':
        this._router.navigate(['/admin-panel/products/add-products', env?.event?.slug]);
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
          this._productService.deleteProducts(id)
          .subscribe((res:any)=>{
            this.getProducts();
            Swal.fire('Deleted!', res?.message, 'success');
          })
        }
      });
  }

}
