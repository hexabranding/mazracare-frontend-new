import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCategoryService } from '../../service-category/product-category/service/product-category.service';
import { BlogService } from '../service/blog.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule , CommonModule],
  templateUrl: './blog-create.component.html',
  styleUrl: './blog-create.component.scss'
})
export class BlogCreateComponent implements OnInit {

  blogForm!: FormGroup;
  previewImage: string | null = null;
  selectedImageFile?: File;
  categorys:any [] = [];
  blogId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder ,
    private router: Router,
    private categoryService: ProductCategoryService ,
    private _activatedRoute: ActivatedRoute,
    private blogService: BlogService)
  {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      // date: ['', Validators.required],
      category: ['', Validators.required],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      image: [null]
    });

    this._activatedRoute.paramMap.subscribe((data:any)=>{
    this.blogId = data.get('id'); // expects `/edit/:id`
    if (this.blogId) {
      this.isEditMode = true;
      this.loadBlog(this.blogId);
    }
    })
  }

  ngOnInit(): void {
    this.getCategoryList();
  }

  get f() {
    return this.blogForm.controls;
  }

 loadBlog(id: string) {
    this.blogService.getBlogId(id).subscribe({
      next: async (response:any) => {
        const data = response?.data;
        this.blogForm.patchValue({
          title: data.title,
          author: data.author,
          category: data.category,
          excerpt: data.excerpt,
          content: data.content,
        });
        if (data.image) {
          this.previewImage = data.image.url;
        }

        this.selectedImageFile = await this.urlToFile(data.image.url);
      }
    });
  }

  async urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'image.jpg';
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  }


  getCategoryList() {
    this.categoryService.getCategoryList().subscribe({
      next: (response:any) => {
        this.categorys = response?.data;
      },
      error: (error) => {
        console.error('Error fetching category list', error);
      }
    });
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result as string);
      reader.readAsDataURL(file);
    }
  }


  submitBlog() {
    if (this.blogForm.valid) {
      const formData = new FormData();
      formData.append('title', this.blogForm.value.title);
      formData.append('author', this.blogForm.value.author);
      formData.append('category', this.blogForm.value.category);
      formData.append('excerpt', this.blogForm.value.excerpt);
      formData.append('content', this.blogForm.value.content);
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      const request = this.isEditMode ?
        this.blogService.updateBlog(this.blogId!, formData) :
        this.blogService.addBlog(formData);
      request.subscribe({
        next: (response: any) => {

          if (response && response.success) {
            const res = Swal.fire({
              title: 'Success',
              text: response?.message || 'Blog has been created successfully.',
              icon: 'success',
              showCancelButton: false,
              timer: 2000,
            });
            this.router.navigate(['/admin-panel/blog']);
          }
          this.blogForm.reset();
          this.previewImage = null;
          this.selectedImageFile = undefined;
        },
        error: (error: any) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.message || 'Failed to create blog',
            icon: 'error',
          });
        }
      });
    }
  }

}
