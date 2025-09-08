import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { FunctionService } from '../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  $baseUrl = environment.baseUrl

  constructor(private http: HttpClient, private _fun :FunctionService) { }

    productlist(params?:any) {
      const param = this._fun.objectToQueryParams(params);
      return this.http.get( this.$baseUrl + "/products"+(param ?? ''))
    }

    addProducts(data: any): Observable<any> {
      return this.http.post( this.$baseUrl + "/products", data)
    }

    deleteProducts(id:string): Observable<any> {
      return this.http.delete( this.$baseUrl + "/products/"+id)
    }

    getProductBySlug(slug: string): Observable<any> {
      return this.http.get( this.$baseUrl + "/products/" + slug);
    }

    updateProduct(id: string, data: any): Observable<any> {
      return this.http.put( this.$baseUrl + "/products/" + id, data);
    }
}
