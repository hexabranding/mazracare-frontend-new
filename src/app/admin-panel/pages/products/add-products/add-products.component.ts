import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { ProductService } from '../../../../pages/products/service/product.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategoryService } from '../../service-category/product-category/service/product-category.service';
import { ProductServicesService } from '../../service-category/product-services/service/product-services.service';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss'
})
export class AddProductsComponent implements OnInit {
  productForm: FormGroup;
  images: File[] = [];
  previewImages: any[] = [];
  imageLimitExceeded = false;
  services: any[] = [];
  categorys: any[] = [];
  isEdit = false;
  productId: string | null = null;
  productSlug: string | null = null;

  constructor(private fb: FormBuilder,
    private _productService: ProductService,
    private _router: Router,
    private categoryService: ProductCategoryService,
    private productService: ProductServicesService,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      discountPercent: [null],
      category: ['', Validators.required],
      service: ['', Validators.required],
      points: this.fb.array([this.fb.control('')])
    });
  }

  ngOnInit(): void {
    this.getserviceList();

    this.productSlug = this.route.snapshot.paramMap.get('id');
    console.log(this.productSlug);

    if (this.productSlug) {
      this.isEdit = true;
      this.loadProduct(this.productSlug);
    }
  }

  get points(): FormArray {
    return this.productForm.get('points') as FormArray;
  }

  loadProduct(id: string) {
    this._productService.getProductBySlug(id).subscribe({
      next: async (product: any) => {
        console.log('Product loaded:', product);

        if (!product) return;

        this.productForm.patchValue({
          name: product.data.name,
          description: product.data.description,
          price: product.data.price,
          stock: product.data.stock,
          discountPercent: product.data.discountPercent,
          category: product.data.category,
          service: product.data.service
        });

        this.getCategoryById(product.data.service);
        this.productId = product.data._id;


        // Set points
        this.points.clear();
        if (product.data.usp?.length) {
          product.data.usp.forEach((p: string) => this.points.push(this.fb.control(p)));
        } else {
          this.points.push(this.fb.control(''));
        }

        this.previewImages = product.data.images || [];
        this.images = [];
        for (let i = 0; i < this.previewImages.length; i++) {
          this.convertImageUrlToFileAndPush(this.previewImages[i]?.url)
        }

      },
      error: (err) => console.error('Failed to load product', err)
    });
  }

  async convertImageUrlToFileAndPush(url: any) {
    const filename = url.substring(url.lastIndexOf('/') + 1);

    try {
      const file = await this.urlToFile(url, filename);
      this.images.push(file);
    } catch (err) {
      console.error('Error converting image URL to File:', err);
    }
  }

  async urlToFile(url: string, filename: string): Promise < File > {

    const response = await fetch(url);
    const blob = await response.blob();
    console.log('Blob fetched from URL:', blob);

    // Default to 'image/jpeg' if blob.type is not valid
    const mimeType = blob.type.startsWith('image/') ? blob.type : 'image/jpeg';

    return new File([blob], filename, {
      type: mimeType
    });
  }

  getserviceList() {
    this.productService.getServiceList().subscribe({
      next: (response: any) => {
        console.log('Service list fetched successfully', response);
        this.services = response?.data;
        // Handle the response as needed
      },
      error: (error) => {
        console.error('Error fetching service list', error);
        Swal.fire({
          title: 'Error',
          text: error?.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onServiceChange(event: Event) {
    const selectedServiceId = (event.target as HTMLSelectElement).value;
    if (selectedServiceId) {
      this.getCategoryById(selectedServiceId);
    } else {
      this.categorys = [];
      this.productForm.get('category')?.setValue('');
      this.productForm.get('category')?.disable();
    }
  }

  getCategoryById(id: string) {
    this.categoryService.getCategoryById(id).subscribe({
      next: (res: any) => {
        this.categorys = res?.data || [];
        this.productForm.get('category')?.enable();
      },
      error: (err: any) => {
        console.error('Category fetch error', err);
        this.categorys = [];
        this.productForm.get('category')?.disable();
      }
    });
  }



  addItem() {
    this.points.push(this.fb.control(''));
  }

  deleteItem(index: number) {
    this.points.removeAt(index);
  }

  get f() {
    return this.productForm.controls;
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (files.length > 5) {
      this.imageLimitExceeded = true;
      return;
    }

    this.imageLimitExceeded = false;
    this.images = files;
    this.previewImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.previewImages.push(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
  this.previewImages.splice(index, 1);
  this.images.splice(index, 1);
}

  onSubmit() {
    if (this.productForm.invalid || this.imageLimitExceeded) return;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('discountPercent', this.productForm.value.discountPercent || '');
    formData.append('category', this.productForm.value.category);
    formData.append('stock', this.productForm.value.stock);
    formData.append('service', this.productForm.value.service);

    this.productForm.value.points.forEach((point: string, index: number) => {
      formData.append(`usp[]`, point);
    });


    this.images.forEach((file, index) => {
      formData.append(`images`, file);
    });

    if (this.isEdit && this.productId) {
      this._productService.updateProduct(this.productId, formData).subscribe(
        (response) => {
          if (response?.success) {
            Swal.fire('Success', response.message || 'Product updated successfully', 'success');
            this._router.navigate(['/admin-panel/products']);
          }
        },
        (error) => Swal.fire('Error', error?.error?.message || 'Failed to update product', 'error')
      );
    } else {
      this._productService.addProducts(formData).subscribe(
        response => {
          if (response && response.success) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: response.message || 'Product added successfully',
              showConfirmButton: false,
              timer: 1500
            });
            this._router.navigate(['/admin-panel/products']);
          }
          // Reset form and images after successful submission
          this.productForm.reset();
          this.images = [];
          this.previewImages = [];
        },
        error => {
          console.error('Error adding product', error);
          // Handle error appropriately
          Swal.fire({
            title: 'Error',
            text: error?.error?.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }

  }
}
