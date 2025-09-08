import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BlogService } from '../../admin-panel/pages/blogs/service/blog.service';
import { NgFor } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgFor,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {

  blogDetails: any[] = []; // Initialize as an empty array
  constructor(private router: Router, private blogService: BlogService) { }
  @ViewChild('mainCarousel') mainCarousel!: ElementRef;
  @ViewChild('thumbCarousel') thumbCarousel!: ElementRef;
  @ViewChild('projectCarousel') projectCarousel!: ElementRef;
  @ViewChild('blogCarousel') blogCarousel!: ElementRef;


  
  projectSlides = [
    {
      title: 'Residential',
      link: '/residential',
      img: '../assets/images/pintrest/Image_2.png.jpg'
    },
    {
      title: 'Commercial',
      link: '/commercial',
      img: '../assets/images/pintrest/agri2.jpg'
    },
    {
      title: 'Industrial',
      link: '/industrial',
      img: '../assets/images/pintrest/indr4.jpg'
    },
    {
      title: 'Institutional',
      link: '/institutional',
      img: '../assets/images/pintrest/school2.jpg'
    }
  ];

  testimonials = [
    {
      quote: `Partnering with Mazra Care has been a turning point in our sustainability journey.`,
      name: "Mike Hardson",
      designation: "Customer",
      img: "../assets/images/team/person.jpeg"
    },
    {
      quote: `Mazra Care embodies the future of food security in the UAE.`,
      name: "Joseph Kennedy",
      designation: "Founder",
      img: "../assets/images/team/person.jpeg"
    },
    {
      quote: `Thanks to Mazra Care’s adaptable systems, we now grow fresh vegetables...`,
      name: "Mark Smith",
      designation: "Manager",
      img: "../assets/images/team/person.jpeg"
    },
    {
      quote: `As a mother, I was worried about the safety of store-bought vegetables.`,
      name: "Amelia Rose",
      designation: "Parent",
      img: "../assets/images/team/person.jpeg"
    }
  ];
  ngOnInit() {
    // Any initialization logic can go here
    this.loadBlogs();


  }
  ngAfterViewInit(): void {
    // jQuery Slick Init
    const $main = $(this.mainCarousel.nativeElement);
    const $thumb = $(this.thumbCarousel.nativeElement);

    $main.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      autoplay: true,
      infinite: true,
      asNavFor: $thumb
    });

    $thumb.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: $main,
      dots: false,
      arrows: false,
      centerMode: true,
      focusOnSelect: true,
      infinite: true,
      responsive: [
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

    $(this.projectCarousel.nativeElement).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      dots: true,
      arrows: true,
      speed: 700,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 0,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });

    // $(this.blogCarousel.nativeElement).slick({
    //   slidesToShow: 3,
    //   slidesToScroll: 1,
    //   autoplay: true,
    //   dots: true,
    //   arrows: true,
    //   speed: 700,
    //   draggable: true,
    //   responsive: [
    //     {
    //       breakpoint: 1600,
    //       settings: {
    //         slidesToShow: 4,
    //         slidesToScroll: 1
    //       }
    //     },
    //     {
    //       breakpoint: 1100,
    //       settings: {
    //         slidesToShow: 3,
    //         slidesToScroll: 1
    //       }
    //     },
    //     {
    //       breakpoint: 768,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 1
    //       }
    //     },
    //     {
    //       breakpoint: 480,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1
    //       }
    //     }
    //   ]
    // });
  }



  loadBlogs() {
    this.blogService.getBlogs().subscribe({
      next: (response: any) => {
        console.log('Blogs loaded:', response);
        this.blogDetails = response?.data || []; // Ensure it's an array
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
      }
    });
  }


  mainSliderConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: '.testimonials-two__carousel-thumb',
    autoplay: true,
    infinite: true,
    dots: true,
    arrows: true,
    autoplaySpeed: 5000,
    centerPadding: 0
  };

  thumbSliderConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.testimonials-two__carousel',
    centerMode: true,
    focusOnSelect: true,
    autoplay: true,
    infinite: true,
    dots: true,
    arrows: true,
    centerPadding: 0,
    responsive: [
      {
        breakpoint: 501,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  };

  projects = [
    {
      title: 'Residential',
      link: '/residential',
      image: '../assets/images/pintrest/Image_2.png.jpg'
    },
    {
      title: 'Commercial',
      link: '/commercial',
      image: '../assets/images/pintrest/agri2.jpg'
    },
    {
      title: 'Industrial',
      link: '/industrial',
      image: '../assets/images/pintrest/indr4.jpg'
    },
    {
      title: 'Institutional',
      link: '/institutional',
      image: '../assets/images/pintrest/school2.jpg'
    }
  ];

  customOptions = {
    loop: false,
    margin: 30,
    smartSpeed: 700,
    nav: false,
    dots: true,
    autoplay: false,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1024: {
        items: 3
      },
      1400: {
        items: 4
      }
    }
  };
}
