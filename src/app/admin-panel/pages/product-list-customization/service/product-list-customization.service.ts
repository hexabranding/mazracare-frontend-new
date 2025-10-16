import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FunctionService } from '../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListCustomizationService {
$baseUrl = environment.baseUrl

  constructor(private http: HttpClient , private _fun :FunctionService ) { }

  proCustomizationList(params?:any) {
      const param = this._fun.objectToQueryParams(params);
    return this.http.get( this.$baseUrl + "/product-details-customisation/admin/all"+(param ?? ''))
  }

  getCustomizationById(id:string) {
    return this.http.get( this.$baseUrl + "/product-details-customisation/my-customisations-single?id="+id)
  }

  getProductDetailsList(params?:any) {
    const param = this._fun.objectToQueryParams(params);
    return this.http.get( this.$baseUrl + "/customization/admin/all"+(param ?? ''))
  }

  getProductDetailsById(id:string) {
    return this.http.get( this.$baseUrl + "/customization/my-customizations-single?id="+id)
  }




}
