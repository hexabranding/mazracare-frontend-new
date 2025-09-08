import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { FunctionService } from '../../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {
  $baseUrl = environment.baseUrl

  constructor(private http: HttpClient ,private _fun :FunctionService ) { }

  addService(data: any): Observable<any> {
    return this.http.post(this.$baseUrl + "/service/add-service", data);
  }

  getServiceList(params?:any) {
  const param = this._fun.objectToQueryParams(params);
  return this.http.get( this.$baseUrl + "/service/services"+(param ?? ''))
  }

  deleteService(id:string): Observable<any> {
    return this.http.delete( this.$baseUrl + "/service/service/"+id)
  }

  getService(id: any): Observable<any> {
    return this.http.get(this.$baseUrl + "/service/service/"+ id);
  }

  updateService(id:string , data:any): Observable<any> {
    return this.http.put( this.$baseUrl + "/service/service/" + id, data);
  }

}
