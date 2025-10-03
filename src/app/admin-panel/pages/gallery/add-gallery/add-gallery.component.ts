import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../pages/products/service/product.service';
import { ProductCategoryService } from '../../service-category/product-category/service/product-category.service';
import { ProductServicesService } from '../../service-category/product-services/service/product-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgFor, NgIf } from '@angular/common';
import { GalleryService } from '../service/gallery.service';

@Component({
  selector: 'app-add-gallery',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './add-gallery.component.html',
  styleUrl: './add-gallery.component.scss'
})
export class AddGalleryComponent {
galleryForm: FormGroup;
  images: File[] = [];
  // previewImages: any[] = [];
  previewImages: any;
  imageLimitExceeded = false;
  services: any[] = [];
  categorys: any[] = [];
  isEdit = false;
  productId: string | null = null;
  productSlug: string | null = null;
  iscategory: boolean = false;

  constructor(private fb: FormBuilder,
    private _productService: ProductService,
    private _router: Router,
    private route: ActivatedRoute,
    private _galleryService: GalleryService,
  ) {
    this.galleryForm = this.fb.group({
      name: [''],
      description: [''],
      images: [null, Validators.required]
      // price: [''],
      // stock: [null, [Validators.required, Validators.min(0)]],
      // discountPercent: [null],
      // category: [''],
      // service: ['', Validators.required],
      // points: this.fb.array([this.fb.control('')])
    });
  }

  ngOnInit(): void {
    // this.getserviceList();

    this.productSlug = this.route.snapshot.paramMap.get('id');
    console.log(this.productSlug);

    if (this.productSlug) {
      this.isEdit = true;
      this.loadProduct(this.productSlug);
    }
  }

  get points(): FormArray {
    return this.galleryForm.get('points') as FormArray;
  }

  loadProduct(id: string) {
    this._galleryService.getSingleGallery(id).subscribe({
      next: async (res: any) => {
        console.log('Product loaded:', res);

        if (!res) return;

        this.galleryForm.patchValue({
          name: res.data.title,
          description: res.data.description,
          // price: product.data.price,
          // stock: product.data.stock,
          // discountPercent: product.data.discountPercent,
          // category: product.data.category,
          // service: product.data.service
        });

        // this.getCategoryById(product.data.service);
        this.productId = res.data._id;


        // Set points

        // if (product.data.usp?.length) {
        //   product.data.usp.forEach((p: string) => this.points.push(this.fb.control(p)));
        // } else {
        //   this.points.push(this.fb.control(''));
        // }

        // this.previewImages = res.data.image || [];
        this.images = [];
        // for (let i = 0; i < this.previewImages.length; i++) {
        //   this.convertImageUrlToFileAndPush(this.previewImages[i]?.url)
        // }

        this.previewImages = res.data.image
        this.convertImageUrlToFileAndPush(this.previewImages.url)

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

  get f() {
    return this.galleryForm.controls;
  }


onFileChange(event: any) {
  const input = event.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];

  if (files.length > 5) {
    this.imageLimitExceeded = true;
    this.galleryForm.get('images')?.setErrors({ limitExceeded: true });
    return;
  }

  this.imageLimitExceeded = false;
  this.images = files;
  this.previewImages = [];

  if (files.length > 0) {
    this.galleryForm.patchValue({ images: files });
    this.galleryForm.get('images')?.updateValueAndValidity();
  } else {
    this.galleryForm.patchValue({ images: null });
    this.galleryForm.get('images')?.updateValueAndValidity();
  }

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

  if (this.images.length === 0) {
    this.galleryForm.patchValue({ images: null });
    this.galleryForm.get('images')?.updateValueAndValidity();
  } else {
    this.galleryForm.patchValue({ images: this.images });
    this.galleryForm.get('images')?.updateValueAndValidity();
  }
}

  onSubmit() {
    console.log(this.galleryForm.value, 'test submit');
    if (this.galleryForm.invalid || this.imageLimitExceeded) return;

    const formData = new FormData();
    formData.append('title', this.galleryForm.value.name);
    formData.append('description', this.galleryForm.value.description);

    this.images.forEach((file, index) => {
      formData.append(`image`, file);
    });

    if (this.isEdit && this.productId) {
      this._galleryService.updateGallery(this.productId, formData).subscribe(
        (response:any) => {
          if (response?.success) {
            Swal.fire('Success', response.message, 'success');
            this._router.navigate(['/admin-panel/gallery']);
          }
        },
        (error) => Swal.fire('Error', error?.error?.message, 'error')
      );
    } else {
      this._galleryService.addgallery(formData).subscribe(
        (response:any) => {
          if (response && response.success) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: response.message,
              showConfirmButton: false,
              timer: 1500
            });
            this._router.navigate(['/admin-panel/gallery']);
          }
          // Reset form and images after successful submission
          this.galleryForm.reset();
          this.images = [];
          this.previewImages = [];
        },
        (error:any) => {
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

