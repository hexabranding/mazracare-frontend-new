import { AddServiceComponent } from './admin-panel/pages/service-category/product-services/add-service/add-service.component';
import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { AboutComponent } from './pages/about/about.component';
import { CareerComponent } from './pages/career/career.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { CommercialComponent } from './pages/commercial/commercial.component';
import { IndustrialComponent } from './pages/industrial/industrial.component';
import { InstitutionalComponent } from './pages/institutional/institutional.component';
import { PolicyGuidelinesComponent } from './pages/policy-guidelines/policy-guidelines.component';
import { ResidentialComponent } from './pages/residential/residential.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ForgetPageComponent } from './pages/forget-page/forget-page.component';
import { AdminViewComponent } from './admin-panel/layout/admin-view/admin-view.component';
import { AdminDashboardComponent } from './admin-panel/pages/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './core/guard/auth.guard';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ServicePageComponent } from './pages/service-page/service-page.component';
import { BlogListComponent } from './admin-panel/pages/blogs/blog-list/blog-list.component';
import { CustomizationFormComponent } from './pages/customization-form/customization-form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: '',
        component: ContentLayoutComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'career',
                component: CareerComponent
            },
            {
                path: 'contact',
                component: ContactComponent
            },
            // { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),canMatch:[AuthGuard]},
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'products/:id',
                component: ProductsComponent
            },
            {
                path: 'product-detail/:id',
                component: ProductDetailComponent
            },
            {
                path: 'service/:id',
                component: ServicePageComponent
            },
             {
                path: 'customize-form',
                component: CustomizationFormComponent
            },
            {
                path: 'commercial',
                component: CommercialComponent
            },
            {
                path: 'industrial',
                component: IndustrialComponent
            },
            {
                path: 'institutional',
                component: InstitutionalComponent
            },
            {
                path: 'policy-guidelines',
                component: PolicyGuidelinesComponent
            },
            {
                path: 'residential',
                component: ResidentialComponent
            },
            {
                path: 'terms-conditions',
                component: TermsConditionsComponent
            },
           
            // etc pages


            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'checkout',
                component: CheckoutComponent
            },
            {
                path: 'wishlist',
                component: WishlistComponent
            },
            {
                path: 'blog-list',
                component: BlogListComponent,
            },
            {
                path: 'blog-details',
                component: BlogDetailsComponent
            },
            {
                path: 'cart',
                component: CartComponent
            },
            {
                path: 'forget',
                component: ForgetPageComponent
            },
            { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
            { path: 'email-verification', loadComponent: () => import('./pages/email-verification/email-verification.component').then(m => m.EmailVerificationComponent) },

        ]
    },
    {
        path: 'admin-panel',
        loadComponent: () => import('./admin-panel/layout/admin-view/admin-view.component').then(m => m.AdminViewComponent),
        // component: AdminViewComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./admin-panel/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./admin-panel/pages/products/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
            },
            {
                path: 'products/add-products',
                loadComponent: () => import('./admin-panel/pages/products/add-products/add-products.component').then(m => m.AddProductsComponent)
            },
            {
                path: 'products/add-products/:id',
                loadComponent: () => import('./admin-panel/pages/products/add-products/add-products.component').then(m => m.AddProductsComponent)
              },
             {
                path: 'order',
                loadComponent: () => import('./admin-panel/pages/order-management/order-management.component').then(m => m.OrderManagementComponent),
            },
             {
                path: 'customers',
                loadComponent: () => import('./admin-panel/pages/customer-management/customer-management.component').then(m => m.CustomerManagementComponent),
            },
             {
                path: 'report-payments',
                loadComponent: () => import('./admin-panel/pages/report-payments/report-payments.component').then(m => m.ReportPaymentsComponent),
            },
             {
                path: 'service-category',
                loadComponent: () => import('./admin-panel/pages/service-category/service-category.component').then(m => m.ServiceCategoryComponent),
            },
           {
                path: 'service-category/add-service',
                loadComponent: () => import('./admin-panel/pages/service-category/product-services/add-service/add-service.component').then(m => m.AddServiceComponent)
            },
           {
                path: 'service-category/add-service/:id',
                loadComponent: () => import('./admin-panel/pages/service-category/product-services/add-service/add-service.component').then(m => m.AddServiceComponent)
            },
           {
                path: 'service-category/add-category',
                loadComponent: () => import('./admin-panel/pages/service-category/product-category/add-category/add-category.component').then(m => m.AddCategoryComponent)
            },
           {
                path: 'service-category/add-category/:id',
                loadComponent: () => import('./admin-panel/pages/service-category/product-category/add-category/add-category.component').then(m => m.AddCategoryComponent)
            },
            {
                path: 'service-category/edit-category/:id',
                loadComponent: () => import('./admin-panel/pages/service-category/product-category/add-category/add-category.component').then(m => m.AddCategoryComponent)
            },
             {
                path: 'blog',
                loadComponent: () => import('./admin-panel/pages/blogs/blog-management/blog-management.component').then(m => m.BlogManagementComponent),
            },
            {
                path: 'blogs/blogs-create',
                loadComponent: () => import('./admin-panel/pages/blogs/blog-create/blog-create.component').then(m => m.BlogCreateComponent),
            },
            {
                path: 'blogs/blogs-create/:id',
                loadComponent: () => import('./admin-panel/pages/blogs/blog-create/blog-create.component').then(m => m.BlogCreateComponent),
            },

        ]
    }
];
