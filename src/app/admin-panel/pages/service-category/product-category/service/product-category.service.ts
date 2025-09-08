import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { FunctionService } from '../../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  $baseUrl = environment.baseUrl

  constructor(private http: HttpClient ,private _fun :FunctionService) { }

  addCategory(data: any): Observable<any> {
    return this.http.post(this.$baseUrl + "/service/add-category", data);
  }

  getCategoryList(params?: any): Observable<any> {
  const param = this._fun.objectToQueryParams(params);
  return this.http.get( this.$baseUrl + "/service/categories/"+(param ?? ''))
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete( this.$baseUrl + "/service/category/"+id)
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get( this.$baseUrl + "/service/categories/"+id)
  }

  getCategoryDetailById(id: string): Observable<any> {
    return this.http.get( this.$baseUrl + "/service/category/"+id)
  }


  getProductsByCategoryId(id: string): Observable<any> {
    return this.http.get( this.$baseUrl + "/products/category/"+id);
  }

  updateCategory(id:string , data:any): Observable<any> {
    return this.http.put( this.$baseUrl + "/service/category/" + id, data);
  }

}
