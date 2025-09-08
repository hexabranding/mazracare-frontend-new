import { LoginService } from './../../pages/login/service/login.service';
import { CartService } from './../../pages/cart/service/cart.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ProductServicesService } from '../../admin-panel/pages/service-category/product-services/service/product-services.service';
import { LoaderService } from '../../core/services/loader.service';
import { filter, take } from 'rxjs';
import { WishlistService } from '../../pages/wishlist/service/wishlist.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule , MatMenuModule , MatMenuModule , MatButtonModule , MatIconModule, MatDividerModule , CommonModule,TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit , AfterViewInit  {
  isExpanded = false;
  itemCount: number = 0;
  wishlistCount: number = 0;
  username:string = '';
  email:string = '';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  service:any;
  constructor( private route:Router , private CartService: CartService , private authService: LoginService, private translate: TranslateService,
    private productService:ProductServicesService , private loaderService:LoaderService , private wishlistService: WishlistService ) { }


  ngOnInit() {
  this.authService.currentUser$.subscribe(user => {
    this.username = user?.username || '';
    this.email = user?.email || '';
    this.isAdmin = user?.role === 'Admin';
  });

  // this.authService.islogin$
  //   .pipe(filter(isLogin => isLogin && !!localStorage.getItem('token')), take(1))
  //   .subscribe(() => {
  if (localStorage.getItem('token')) {
      this.CartService.cartItemCount$.subscribe(count => {
        this.itemCount = count || 0;
      });
      this.CartService.refreshCartCount();
      this.wishlistService.wishlistCount$.subscribe(count => {
        this.wishlistCount = count || 0;
      });
      this.wishlistService.refreshWishlistCount();
    // });
  }
  this.getServices();
}

   ngAfterViewInit(){
    this.loadGoogleTranslateScript();
  }


   toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

    loadGoogleTranslateScript(): void {
    if ((window as any).google?.translate?.TranslateElement) {
      this.initializeGoogleTranslate();
      return;
    }

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Define the global callback (Google expects this function)
    (window as any).googleTranslateElementInit = () => {
      this.initializeGoogleTranslate();
    };
  }

  initializeGoogleTranslate(): void {
    new (window as any).google.translate.TranslateElement(
      { pageLanguage: 'en' },
      'google_translate_element'
    );
  }

  goToCart(){
    if(this.itemCount >= 0 && localStorage.getItem('token')) {
      this.route.navigate(['/cart']);
    }else if(this.itemCount === 0 && localStorage.getItem('token')) {
      Swal.fire({
        title: 'Empty Cart',
        text: 'Your cart is empty. Please add items to your cart.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      this.route.navigate(['/']);
    }else {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to view your cart. Are you sure you want to login?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.route.navigate(['/login']);
        }

      });
    }
  }

  goToWishlist() {
      this.route.navigate(['/wishlist']);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    localStorage.clear();
    this.loaderService.hide();
    this.CartService.cartItemCount.next(0);
    this.authService.islogin.next(false);
    this.authService.currentUserSubject.next(null);
    this.username =''
    this.email = '';
    this.isLoggedIn = false;
    this.route.navigate(['/login']);
    Swal.fire({
      title: 'Logged Out',
      text: 'You have been logged out successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    this.isLoggedIn = false;
  }

  getServices() {
    this.productService.getServiceList().subscribe(
      (response:any) => {
        console.log(response);
        this.service = response?.data;
      }
    );
  }

  gotoService(id:string){
    this.route.navigateByUrl('service/'+id)
  }
}
