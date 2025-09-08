import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FunctionService } from '../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

$baseUrl = environment.baseUrl

  constructor(private http: HttpClient, private _fun :FunctionService) { }
  
  customerlist(params?:any) {
    const param = this._fun.objectToQueryParams(params);
    return this.http.get( this.$baseUrl + "/user"+(param ?? ''))
  }
}
