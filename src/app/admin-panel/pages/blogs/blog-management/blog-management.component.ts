import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { BlogService } from '../service/blog.service';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, RouterModule ,FormsModule, DataTableComponent],
  templateUrl: './blog-management.component.html',
  styleUrl: './blog-management.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BlogManagementComponent implements OnInit {

  tableConfig = {
    title: 'Blog List',
    createButtonText: 'Create Blog',
  };
  totalCount!: number; // Total number of blogs
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
      author: {
        title: 'Author',
        type: 'string',
      },
      date: {
        title: 'Date',
        type: 'date',
      },
      category: {
        title: 'Category',
        type: 'string',
      },
      content: {
        title: 'Content',
        type: 'string',
      },
      image: {
        title: 'Image',
        type: 'image',
        imageUrl: 'image', // Assuming the image URL is stored in the 'image'
        imageAlt: 'Blog Image', // Alt text for the image
      }
    },
    actions: {
      add: false,
      edit: true,
      delete: true,
    },
  };

    constructor(private router: Router , private blogService: BlogService) { }

  // blogs: BlogPost[] = [
  //   {
  //     id: 1,
  //     image: 'assets/images/blog/blog-details-1-1.jpg',
  //     title: 'This Leader in Organic Agriculture Growth',
  //     author: 'Lorat',
  //     date: '02 Sep 2024',
  //     category: 'Organic',
  //     content: `There are many variations of passages agency we have covered many special events such as
  //     fireworks, fairs, parades, races, walks, a Lorem Ipsum Fasts injecte dedicated product design
  //     team can help you achieve your business goals...`,
  //   },
  //   {
  //     id: 2,
  //     image: 'assets/images/blog/blog-details-1-1.jpg',
  //     title: 'Sustainable Farming Practices for the Future',
  //     author: 'Admin',
  //     date: '10 Aug 2024',
  //     category: 'Agriculture',
  //     content: `This article discusses sustainable practices in modern farming and how these techniques
  //     can be scaled globally for better yield.`,
  //   },
  //   {
  //     id: 3,
  //     image: 'assets/images/blog/blog-details-1-1.jpg',
  //     title: 'Exploring Eco-Friendly Techniques',
  //     author: 'John Doe',
  //     date: '21 Jul 2024',
  //     category: 'Environment',
  //     content: `Explore different eco-friendly approaches to traditional agricultural methods.`,
  //   },
  //   {
  //     id: 4,
  //     image: 'assets/images/blog/blog-details-1-1.jpg',
  //     title: 'Market Trends in Organic Produce',
  //     author: 'Jane Smith',
  //     date: '15 Jun 2024',
  //     category: 'Market',
  //     content: `How market demand is shaping the organic produce industry in 2024.`,
  //   }
  // ];

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs(params?:any) {
    this.isLoading = true;
    const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    this.blogService.getBlogs(params ?? defparams).subscribe(
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
        this.getBlogs(env?.event);
        break;

      case 'add':
        this.createBlog();
        break;

      case 'edit':
        this.editBlog(env?.event?._id);
        break;

      case 'delete':
        this.deleteBlog(env?.event?._id);
        break;

      default:
        break;
    }
  }


  createBlog() {
    // Swal.fire('Create Blog', 'This would open a create blog modal (dummy).', 'info');
    this.router.navigate(['/admin-panel/blogs/blogs-create']);

  }

  editBlog(id: string) {
    this.router.navigate(['/admin-panel/blogs/blogs-create' , id]);
  }

  deleteBlog(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        this.blogService.deleteBlog(id).subscribe({
          next: (response:any) => {
            console.log('Blog deleted successfully', response);
            Swal.fire({
              title: 'Deleted!',
              text: response?.message || 'Blog has been deleted.',
              icon: 'success',
            });
            this.getBlogs(); // Refresh the blog list
          },
          error: (error:any) => {
            console.error('Error deleting blog', error);
            Swal.fire({
              title: 'Error',
              text: error?.error?.message || 'Failed to delete blog',
              icon: 'error'
            });
          }
        });
      }
    });
  }
}
