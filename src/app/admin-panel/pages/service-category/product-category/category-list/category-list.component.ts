import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ProductService } from '../../../../../pages/products/service/product.service';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { ProductCategoryService } from '../service/product-category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
tableConfig = {
    title: 'Category List',
    createButtonText: 'Add Category',
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
    private categoryService: ProductCategoryService,
  ) {}

  createProduct() {
    this._router.navigateByUrl('/admin-panel/service-category/add-category');
  }

  editProduct(id:string) {
    this._router.navigate(['/admin-panel/service-category/add-category/',id]);
  }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(params?:any) {
    this.isLoading = true;
    const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    this.categoryService.getCategoryList(params ?? defparams).subscribe(
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
        this.getCategory(env?.event);
        break;

      case 'add':
        this.createProduct();
        break;

      case 'delete':
        this.deleteProduct(env?.event?._id);
        break;

      case 'edit':
        this.editProduct(env?.event?._id);
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
          this.categoryService.deleteCategory(id)
          .subscribe((res:any)=>{
            this.getCategory();
            Swal.fire('Deleted!', res?.message, 'success');
          })
        }
      });
  }

}
