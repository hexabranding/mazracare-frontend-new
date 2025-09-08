import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../../pages/products/service/product.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ProductServicesService } from '../service/product-services.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule , NgFor],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {
serviceForm!: FormGroup;
  images: File[] = [];
  previewImages: any[] = [];
  imageLimitExceeded = false;
  videos: File[] = [];
  previewVideos: any[] = [];
  videoLimitExceeded = false;
  previewVideo: string | null = null;
  selectedImageFile?: File;
  selectedVideoFile?: File;
  isEditMode = false;
  serviceId: string | null = null;
  existingImages: any[] = [];
  existingVideos: any[] = [];

  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInputRef!: ElementRef<HTMLInputElement>;

  // categoryOptions: string[] = ['Residential', 'Commercial', 'Agricultural'];

  constructor(private fb: FormBuilder , private productService: ProductServicesService, private _router:Router , private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      subdescription: ['', Validators.required],
      subhead: ['', Validators.required],
      image: [null],
      video: [null]
    });

    this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('id'); // expects `/edit/:id`
      if (this.serviceId) {
        this.isEditMode = true;
        this.loadService(this.serviceId);
      }
    });
  }

  loadService(id: string) {
    this.productService.getService(id).subscribe(data => {
      console.log(data)
      this.serviceForm.patchValue({
        name: data.data?.name,
        description: data.data?.description,
        subdescription: data.data?.subdescription,
        subhead: data.data?.subhead
      });

      this.previewImages = data.data.image || [];
      this.previewVideos = data.data.video || []
      this.images = [];


      data.data.image.forEach((Url: any) => {
        this.convertMediaUrlToFileAndPush(Url?.url);
      });

      data.data.video.forEach((Url: any) => {
        this.convertMediaUrlToFileAndPush(Url?.url);
      });


      // this.existingImages = data.data?.image || [];
      // this.existingVideos = data.data?.video || [];
    });
  }

  async convertMediaUrlToFileAndPush(url: string) {
    console.log(url)
    const filename = url.substring(url.lastIndexOf('/') + 1);

    try {
      const file = await this.urlToMediaFile(url, filename);

      if (file.type.startsWith('image/')) {
        this.images.push(file);
      } else if (file.type.startsWith('video/')) {
        this.videos.push(file);
      } else {
        console.warn('Unsupported media type:', file.type);
      }
    } catch (err) {
      console.error('Error converting media URL to File:', err);
    }
  }

  async urlToMediaFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  console.log('Blob fetched from URL:', blob);

  let mimeType = blob.type;

  // Fallback for unknown MIME types
  if (!mimeType || (!mimeType.startsWith('image/') && !mimeType.startsWith('video/'))) {
    if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
      mimeType = 'image/jpeg';
    } else if (filename.match(/\.(mp4|webm|ogg)$/i)) {
      mimeType = 'video/mp4';
    } else {
      mimeType = 'application/octet-stream'; // generic fallback
    }
  }

  return new File([blob], filename, { type: mimeType });
}

  get f() {
    return this.serviceForm.controls;
  }

  onFileChange(event: Event) {
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

  onVideoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? Array.from(input.files) : [];

    if (file.length > 5) {
      this.videoLimitExceeded = true;
      return;
    }

    this.videoLimitExceeded = false;
    this.videos = file;
    this.previewVideos = [];

    file.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.previewVideos.push(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
  this.previewImages.splice(index, 1);
  this.images.splice(index, 1);
}
  removeVideo(index: number) {
    this.previewVideos.splice(index ,1)
    this.videos.splice(index,1)
  }

  onSubmit() {
    if (this.serviceForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.serviceForm.value.name);
    formData.append('description', this.serviceForm.value.description);
    formData.append('subdescription', this.serviceForm.value.subdescription);
    formData.append('subhead', this.serviceForm.value.subhead);
    // formData.append('category', this.serviceForm.value.category);

    this.images.forEach((file, index) => {
      formData.append(`image`, file);
    });

    this.videos.forEach((file, index) => {
      formData.append(`video`, file);
    });


    const request = this.isEditMode
    ? this.productService.updateService(this.serviceId!, formData)
    : this.productService.addService(formData);

    request.subscribe({
      next: (response) => {
        console.log('Service added successfully', response);
        if(response && response.success) {
        Swal.fire({
          title: 'Success',
          text: response?.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this._router.navigate(['/admin-panel/service-category']);
        }
        // Optionally, reset the form or navigate to another page
        this.serviceForm.reset();
        this.previewImages = [];
        this.previewVideo = null;

        this.imageInputRef.nativeElement.value = '';
        this.videoInputRef.nativeElement.value = '';

      },
      error: (error) => {
        console.error('Error adding service', error);
        Swal.fire({
          title: 'Error',
          text: error?.error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });


    // TODO: Call service to POST formData
    console.log('Submitting form...', formData);
  }
}
