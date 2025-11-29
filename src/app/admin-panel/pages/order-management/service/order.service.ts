import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FunctionService } from '../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

$baseUrl = environment.baseUrl

  constructor(private http: HttpClient, private _fun :FunctionService) { }

  orderlist(params?:any) {
    const param = this._fun.objectToQueryParams(params);
    return this.http.get( this.$baseUrl + "/order"+(param ?? ''))
  }

  getOrderById(id:any) {
    return this.http.get( this.$baseUrl + "/order/single?id="+id)
  }

  getOrderUserId() {
    return this.http.get( this.$baseUrl + "/order/my")
  }

  updateOrderStatus(id:any, status:any) {
    return this.http.patch( this.$baseUrl + `/order/${id}/status`,  status )
  }
}
