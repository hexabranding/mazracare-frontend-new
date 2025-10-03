import { Component } from '@angular/core';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { Router } from '@angular/router';
import { ProductService } from '../../../../pages/products/service/product.service';
import Swal from 'sweetalert2';
import { GalleryService } from '../service/gallery.service';

@Component({
  selector: 'app-gallery-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './gallery-list.component.html',
  styleUrl: './gallery-list.component.scss'
})
export class GalleryListComponent {
  tableConfig = {
    title: 'Gallery List',
    createButtonText: 'Add Gallery',
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
      title: {
        title: 'Title',
        type: 'string',
      },
      description: {
        title: 'Price',
        type: 'number',
      },
      image: {
        title: 'Image',
        type: 'image',
        imageUrl: 'image', // Assuming the image URL is stored in the 'image'
        imageAlt: 'Blog Image', // Alt text for the image
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
    private _galleryService: GalleryService,
  ) {}

  createProduct() {
    this._router.navigateByUrl('/admin-panel/gallery/add-gallery');
  }

  ngOnInit(): void {
    console.log('Admin Products Component Initialized');

    this.getGallery();
  }

  getGallery(params?:any) {
    this.isLoading = true;
    const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    this._galleryService.getgallery(params ?? defparams).subscribe(
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
    console.log(env);

    switch (env?.type) {
      case 'apievent':
        this.getGallery(env?.event);
        break;

      case 'add':
        this.createProduct();
        break;

      case 'edit':
        this._router.navigate(['/admin-panel/gallery/add-gallery', env?.event?._id]);
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
          this._galleryService.deleteGallery(id)
          .subscribe((res:any)=>{
            this.getGallery();
            Swal.fire('Deleted!', res?.message, 'success');
          })
        }
      });
  }

}
