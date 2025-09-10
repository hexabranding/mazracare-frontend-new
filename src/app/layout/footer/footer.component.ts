import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../admin-panel/pages/service-category/product-services/service/product-services.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  service:any;
constructor( private productService:ProductServicesService,private route:Router ){
  
}
   ngOnInit() {
    this.getServices();
   }

    getServices() {
    this.productService.getServiceList().subscribe(
      (response:any) => {
        console.log(response);
        this.service = response?.data;
      }
    );
  }

   gotoService(id:string , name:string){
    if (name === 'Residential'){
    this.route.navigateByUrl('products')
    }else {
      this.route.navigateByUrl('customize-form/'+id)
    }
  }
}
