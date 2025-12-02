import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FunctionService } from '../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
$baseUrl = environment.baseUrl

  constructor(private http: HttpClient , private _fun :FunctionService ) { }

  addAddress(data:any){
    return this.http.post(this.$baseUrl + '/address', data)
  }

  getAddressList(params?:any) {
      const param = this._fun.objectToQueryParams(params);
    return this.http.get( this.$baseUrl + "/address" +(param ?? ''))
  }

  setDefaultAddress(id:any){
    return this.http.put(this.$baseUrl + '/address/default/'+id, {})
  }

  deleteAddress(id:any){
    return this.http.delete(this.$baseUrl + '/address/'+id)
  }

  getDefaultAddress(){
    return this.http.get(this.$baseUrl + '/address/default')
  }


}
