import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FunctionService } from '../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

$baseUrl = environment.baseUrl

  constructor(private http: HttpClient , private _fun :FunctionService ) { }

  contactList(params?:any) {
    const param = this._fun.objectToQueryParams(params);
    return this.http.get( this.$baseUrl + "/getintouch/list"+(param ?? ''))
  }
}
