import { NgFor, NgIf } from '@angular/common';
import { ProductCategoryService } from './../service/product-category.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ProductServicesService } from '../../product-services/service/product-services.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
categoryForm!: FormGroup;
  previewImage: any | null = null;
  imageLimitExceeded = false;
  selectedImageFile?: File;
  isEditMode = false;
  categoryId: string | null = null;

  categoryOptions: any[] = [];
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInputRef!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder , private categoryService: ProductCategoryService , private productService: ProductServicesService, private _router:Router
    , private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      service: ['', Validators.required],
      image: [null],
    });

    this._activatedRoute.paramMap.subscribe((data:any)=>{
      this.categoryId = data.get('id'); // expects `/edit/:id`
      if (this.categoryId) {
        this.isEditMode = true;
        this.loadCategory(this.categoryId);
      }
    })
    this.getserviceList();
  }

  async loadCategory(id: string) {
    try {
      const res: any = await this.categoryService.getCategoryDetailById(id).toPromise();
      const data = res?.data;

      this.categoryForm.patchValue({
        name: data.name,
        description: data.description,
        service: data.service._id,
      });

      if (data.image) {
        this.previewImage = data.image;

        // Optional: If you need to convert it back to a File
        this.selectedImageFile = await this.urlToFile(data.image.url);
      }
    } catch (err) {
      console.error('Error loading category', err);
    }
  }

    async urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'image.jpg';
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  }

  getserviceList() {
    this.productService.getServiceList().subscribe({
      next: (response:any) => {
        console.log('Service list fetched successfully', response);
        this.categoryOptions = response?.data;
        console.log(this.categoryOptions);
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

  get f() {
    return this.categoryForm.controls;
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result as string);
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    if (this.categoryForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.categoryForm.value.name);
    formData.append('description', this.categoryForm.value.description);
    formData.append('service', this.categoryForm.value.service);

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }


  const request = this.isEditMode ?
    this.categoryService.updateCategory(this.categoryId!, formData) :
    this.categoryService.addCategory(formData);

    // Call the service to add the service
    request.subscribe({
      next: (response) => {
        if(response && response.success) {
        Swal.fire({
          title: 'Success',
          text: response?.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this._router.navigate(['/admin-panel/service-category']);
        }
        this.categoryForm.reset();
        this.previewImage = null;

      this.imageInputRef.nativeElement.value = '';

      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
